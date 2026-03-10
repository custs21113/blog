import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatDate(date: string) {
  const _date = new Date(date);
  const [year, month, day] = _date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).split('/');
  const hour = _date.getHours();
  const minute = _date.getMinutes();

  const formattedMinute = minute.toString().padStart(2, '0');
  const formattedHour = hour.toString().padStart(2, '0');

  return `${year}年${month}月${day}日 ${formattedHour}时${formattedMinute}分`;
}
