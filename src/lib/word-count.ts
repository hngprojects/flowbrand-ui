export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/** Keeps whitespace between words; stops after maxWords non-whitespace tokens. */
export function truncateToMaxWords(text: string, maxWords: number): string {
  if (!text) return text;

  const tokens = text.match(/\S+|\s+/g);
  if (!tokens) return text;

  let words = 0;
  let result = "";

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      if (words < maxWords) {
        result += token;
      }
      continue;
    }
    if (words >= maxWords) break;
    result += token;
    words += 1;
  }

  return result;
}
