import type { JournalEntry, MoodEntry } from '../types';

const MOODS_KEY = 'freesoul.moods.v1';
const JOURNAL_KEY = 'freesoul.journal.v1';

function read<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}

function write<T>(key: string, entries: T[]) {
  window.localStorage.setItem(key, JSON.stringify(entries));
}

export const localData = {
  getMoods: () => read<MoodEntry>(MOODS_KEY),
  addMood: (entry: MoodEntry) => write(MOODS_KEY, [entry, ...read<MoodEntry>(MOODS_KEY)]),
  deleteMood: (id: string) => write(MOODS_KEY, read<MoodEntry>(MOODS_KEY).filter((entry) => entry.id !== id)),
  getJournal: () => read<JournalEntry>(JOURNAL_KEY),
  addJournal: (entry: JournalEntry) => write(JOURNAL_KEY, [entry, ...read<JournalEntry>(JOURNAL_KEY)]),
  deleteJournal: (id: string) => write(JOURNAL_KEY, read<JournalEntry>(JOURNAL_KEY).filter((entry) => entry.id !== id)),
};
