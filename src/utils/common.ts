export function formatString(str: string, maxLen: number = 15): string {
  if (str.length > maxLen) {
    return `${str.slice(0, 8)}......${str.slice(-4)}`;
  }
  return str;
}

export function formatNumberWithCommas(num: number) {
  const numStr = Math.ceil(num).toString();
  const reversedNumStr = numStr.split('').reverse().join('');
  const commaInserted = reversedNumStr.replace(/(\d{3})(?=\d)/g, '$1,');
  return commaInserted.split('').reverse().join('')
}