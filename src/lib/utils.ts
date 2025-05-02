import { clsx, type ClassValue } from "clsx";
import localFont from "next/font/local";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const headerFont = localFont({
  src: "../../public/fonts/font.woff2",
  display: "swap",
  variable: "--font-geist-sans",
});

export const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};
