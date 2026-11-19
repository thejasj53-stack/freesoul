export type MoodType = 'Happy' | 'Calm' | 'Good' | 'Neutral' | 'Sad' | 'Anxious' | 'Stressed' | 'Overwhelmed' | 'Angry' | 'Exhausted';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  score: number;
  note?: string;
  tags: string[];
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bestie';
  text: string;
  timestamp: string;
  isCrisis?: boolean;
}

export interface WellnessReportData {
  summary: string;
  moodPatterns: string;
  frequentlyMentionedConcerns: string[];
  observedTriggers: string[];
  positiveCoping: string[];
  suggestedDiscussionPoints: string[];
}