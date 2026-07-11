import { Geist, Geist_Mono } from "next/font/google";

// Shared between the marketing site's root layout ([lang]/layout.tsx) and
// the Blueseas OS shell's root layout ((shell)/layout.tsx) - both are
// independent Next.js "root layouts" (see route-groups multi-root pattern),
// so the font setup lives here once instead of being duplicated in both.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
