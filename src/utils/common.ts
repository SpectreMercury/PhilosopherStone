export function formatString(str: string, maxLen: number = 15): string {
  if (str.length > maxLen) {
    return `${str.slice(0, 8)}......${str.slice(-4)}`;
  }
  return str;
}
