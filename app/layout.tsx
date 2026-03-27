import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ClawBench | Independent LLM Agent Evaluation & Benchmarks",
  description: "An in-depth benchmark dedicated to evaluating LLM Agents. Built on an isolated sandbox environment with 30 advanced tasks, it comprehensively covers five core business scenarios: office collaboration, information retrieval, content creation, data analysis, and software engineering.",
  icons: {
    icon: [
      { url: "/logo-transparent.png" },
      { url: "/logo-transparent.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-transparent.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: [{ url: "/logo-transparent.png" }],
    apple: [{ url: "/logo-black.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
