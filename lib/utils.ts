import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const exempted = ["https://unityindiversity.co.za","https://www.unityindiversity.co.za"];

const exemptedList = ["https://unityindiversity.co.za", "https://www.unityindiversity.co.za"];
export const isProd=exemptedList.includes(process.env.AUTH_URL)?? process.env.NEXT_PUBLIC_URL