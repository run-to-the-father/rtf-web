import { clsx, type ClassValue } from "clsx";
import { customTwMerge } from "@shared/config/tailwind/utils";

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
