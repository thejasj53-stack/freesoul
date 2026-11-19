import type { NextApiRequest, NextApiResponse } from 'next';
import { sanitizeForAI } from '../../lib/privacyFilter';

type Message = { role: 'user' | 'assistant'; content: string };
type Reply = { reply?: string; error?: string };

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const systemPrompt = `You are Bestie, a warm and supportive student wellness companion. Listen with empathy and keep replies concise. You are not a therapist: do not diagnose or prescribe. If someone may be in immediate danger, encourage them to contact local emergency services or a crisis hotline and use FreeSoul's Support Hub. Never promise confidentiality or minimize someone's feelings.`;

export const config = { api: { bodyParser: { sizeLimit: '32kb' } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Reply>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST to send a message.' });
  }
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return res.status(503).json({ error: 'Add a Groq API key as GROQ_API_KEY in .env.local, then restart the app.' });

  const now = Date.now();
  const ip = req.socket.remoteAddress ?? 'unknown';
  const current = requestCounts.get(ip);
  if (current && current.resetAt > now && current.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Please wait a minute before sending another message.' });
  }
  requestCounts.set(ip, !current || current.resetAt <= now ? { count: 1, resetAt: now + WINDOW_MS } : { ...current, count: current.count + 1 });

  const raw = (req.body as { messages?: unknown } | undefined)?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 12) return res.status(400).json({ error: 'Please refresh and try again.' });
  const messages: Message[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return res.status(400).json({ error: 'Invalid chat history.' });
    const message = item as Partial<Message>;
    if ((message.role !== 'user' && message.role !== 'assistant') || typeof message.content !== 'string') return res.status(400).json({ error: 'Invalid chat history.' });
    messages.push({ role: message.role, content: sanitizeForAI(message.content.trim().slice(0, 2000)) });
  }
  if (messages[messages.length - 1]?.role !== 'user' || messages.reduce((sum, item) => sum + item.content.length, 0) > 8000) {
    return res.status(400).json({ error: 'Please send a shorter message.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_completion_tokens: 400,
      }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`Groq Chat API returned ${response.status}.`);
      return res.status(response.status === 429 ? 503 : 502).json({ error: response.status === 429 ? 'Groq free-tier limit reached. Please wait and try again.' : 'Groq rejected the request. Check GROQ_API_KEY and GROQ_MODEL.' });
    }
    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return res.status(502).json({ error: 'Bestie returned an empty reply. Please try again.' });
    return res.status(200).json({ reply: reply.trim() });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(502).json({ error: timedOut ? 'Groq is taking too long to respond. Please try again.' : 'Bestie could not connect right now. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
}
