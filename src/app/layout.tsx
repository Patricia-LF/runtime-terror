import type { Metadata } from "next";
import { Eater, Rubik_Glitch, IM_Fell_English } from "next/font/google";
import "./globals.css";

const eater = Eater({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-eater",
});

const rubikGlitch = Rubik_Glitch({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-glitch",
});

const imFellEnglish = IM_Fell_English({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fell",
});

export const metadata: Metadata = {
  title: "Runtime terror",
  description: "Enter if you dare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${eater.variable} ${rubikGlitch.variable} ${imFellEnglish.variable}`} >
        {children}
      </body>
    </html>
  );
}
