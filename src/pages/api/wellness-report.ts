import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeForAI } from '../../lib/privacyFilter';
import type { WellnessReportData } from '../../types';

type ReportInput = {
  moods?: Array<{ mood: string; score: number; note?: string; created_at: string }>;
  journal?: Array<{ title: string; content: string; created_at: string }>;
};

const systemPrompt = `You create a careful, non-clinical wellness reflection from a student's own records. Use only evidence in the supplied records. Do not invent causes, events, diagnoses, trends, or coping strategies. If evidence is sparse, say so plainly. Return only valid JSON with keys summary (string), moodPatterns (string), frequentlyMentionedConcerns (string array), observedTriggers (string array), positiveCoping (string array), suggestedDiscussionPoints (string array). Distinguish direct observations from tentative patterns. Do not include identifying information.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ report?: WellnessReportData; error?: string }>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST to generate a report.' });
  }
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return res.status(503).json({ error: 'Report generation needs GROQ_API_KEY in .env.local. Add it and restart the app.' });

  const input = (req.body ?? {}) as ReportInput;
  const moods = Array.isArray(input.moods) ? input.moods.slice(0, 100) : [];
  const journal = Array.isArray(input.journal) ? input.journal.slice(0, 50) : [];
  if (moods.length === 0 && journal.length === 0) return res.status(400).json({ error: 'Add at least one mood entry or journal entry before generating a report.' });

  const records = {
    moods: moods.map((entry) => ({
      mood: String(entry.mood || '').slice(0, 40),
      score: Number.isFinite(entry.score) ? Math.max(0, Math.min(10, entry.score)) : null,
      note: sanitizeForAI(String(entry.note || '').slice(0, 1000)),
      date: String(entry.created_at || '').slice(0, 30),
    })),
    journal: journal.map((entry) => ({
      title: sanitizeForAI(String(entry.title || '').slice(0, 200)),
      reflection: sanitizeForAI(String(entry.content || '').slice(0, 3000)),
      date: String(entry.created_at || '').slice(0, 30),
    })),
  };
  const totalChars = JSON.stringify(records).length;
  if (totalChars > 40_000) return res.status(413).json({ error: 'Your saved records are too long for one report. Try again after shortening some entries.' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a wellness report using these self-reported records only:\n${JSON.stringify(records)}` },
        ],
        max_completion_tokens: 1200,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`Groq Wellness Report API returned ${response.status}.`);
      return res.status(response.status === 429 ? 503 : 502).json({ error: response.status === 429 ? 'Groq free-tier limit reached. Please wait and try again.' : 'Could not generate the report. Check GROQ_API_KEY and GROQ_MODEL.' });
    }
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return res.status(502).json({ error: 'The report service returned an invalid response.' });
    const parsed = JSON.parse(content) as Partial<WellnessReportData>;
    const report: WellnessReportData = {
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      moodPatterns: typeof parsed.moodPatterns === 'string' ? parsed.moodPatterns : '',
      frequentlyMentionedConcerns: Array.isArray(parsed.frequentlyMentionedConcerns) ? parsed.frequentlyMentionedConcerns.filter((x): x is string => typeof x === 'string').slice(0, 8) : [],
      observedTriggers: Array.isArray(parsed.observedTriggers) ? parsed.observedTriggers.filter((x): x is string => typeof x === 'string').slice(0, 8) : [],
      positiveCoping: Array.isArray(parsed.positiveCoping) ? parsed.positiveCoping.filter((x): x is string => typeof x === 'string').slice(0, 8) : [],
      suggestedDiscussionPoints: Array.isArray(parsed.suggestedDiscussionPoints) ? parsed.suggestedDiscussionPoints.filter((x): x is string => typeof x === 'string').slice(0, 8) : [],
    };
    if (!report.summary || !report.moodPatterns) return res.status(502).json({ error: 'The report service returned an incomplete report. Please try again.' });
    return res.status(200).json({ report });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(502).json({ error: timedOut ? 'Report generation took too long. Please try again.' : 'Could not connect to the report service.' });
  } finally {
    clearTimeout(timeout);
  }
}
