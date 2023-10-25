import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectEntries<TObj extends Record<string, unknown>>(obj: TObj) {
  return Object.entries(obj) as [keyof TObj, TObj[keyof TObj]][];
}

export function objectKeys<Obj>(obj: Obj) {
  return Object.keys(obj as Record<string, unknown>) as (keyof Obj)[];
}

export function objectValues<Obj>(obj: Obj) {
  return Object.values(obj as Record<string, unknown>) as Obj[keyof Obj][];
}
