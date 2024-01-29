import { SHA256 } from 'crypto-js';

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

export function GenerateHashKey(str: string): string {
  const hash = SHA256(str).toString();
  return hash.substring(12, 24);
}

export const formatDate = (dateStr: string): string => {
  const dateObj = new Date(dateStr);

  const suffixes = ["th", "st", "nd", "rd"];
  const day = dateObj.getDate();
  const daySuffix = suffixes[(day % 10) - 1] || suffixes[0];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()]; // getMonth() is zero-indexed
  const year = dateObj.getFullYear();

  return `${day}${daySuffix}, ${month}, ${year}`;
}