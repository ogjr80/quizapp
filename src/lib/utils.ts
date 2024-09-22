import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any) {
  return twMerge(clsx(inputs));
}

export const exemptedList = ["https://unityindiversity.co.za", "https://www.unityindiversity.co.za"];
export const isProd = exemptedList.includes(process.env.AUTH_URL as any ?? process.env.NEXT_PUBLIC_URL)