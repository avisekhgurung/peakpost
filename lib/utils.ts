import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

export function formatTime(hour: number, minute = 0): string {
  const h = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "AM" : "PM";
  const m = minute.toString().padStart(2, "0");
  return `${h}:${m} ${ampm}`;
}

export function dayName(idx: number, short = false): string {
  const long = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const sh = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return short ? sh[idx] : long[idx];
}

export function relativeFromNow(date: Date): string {
  const ms = date.getTime() - Date.now();
  const minutes = Math.round(ms / 60000);
  if (Math.abs(minutes) < 60) return minutes >= 0 ? `in ${minutes}m` : `${-minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return hours >= 0 ? `in ${hours}h` : `${-hours}h ago`;
  const days = Math.round(hours / 24);
  return days >= 0 ? `in ${days}d` : `${-days}d ago`;
}
