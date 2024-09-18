import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const exempted = ["https://unityindiversity.co.za","https://www.unityindiversity.co.za"];
