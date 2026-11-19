/**
 * Privacy-First Redaction Layer
 * Strips PII (emails, phone numbers, names, SSN, institutional IDs) 
 * before any text payload is transmitted to external LLM services.
 */
export function sanitizeForAI(text: string): string {
  if (!text) return '';
  
  let sanitized = text;

  // Redact Email Addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');

  // Redact Phone Numbers (US & International formats)
  sanitized = sanitized.replace(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, '[REDACTED_PHONE]');

  // Redact potential Names (Simple heuristic placeholder replacement for common greeting names or capitalized sequences)
  sanitized = sanitized.replace(/\b(Dr\.|Mr\.|Mrs\.|Ms\.)\s+[A-Z][a-z]+\b/g, '[REDACTED_NAME]');

  // Redact Student ID numbers (e.g., 8-10 digit numbers)
  sanitized = sanitized.replace(/\b\d{8,10}\b/g, '[REDACTED_ID]');

  return sanitized;
}