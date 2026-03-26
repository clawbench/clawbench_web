import type { Metadata } from 'next';
import ClientPage from '@/components/ClientPage';
import { getLeaderboardData } from '@/lib/api';

export const metadata: Metadata = {
  title: "ClawBench | Independent LLM Agent Evaluation & Benchmarks",
  description: "An in-depth benchmark dedicated to evaluating LLM Agents. Built on an isolated sandbox environment with 30 advanced tasks, it comprehensively covers five core business scenarios: office collaboration, information retrieval, content creation, data analysis, and software engineering.",
  keywords: ["LLM Leaderboard", "AI Benchmarking", "Foundation Models", "ClawBench", "Claw score", "OpenClaw", "LLM API Pricing", "OpenAI vs Anthropic cost"],
  openGraph: {
    title: "ClawBench | Independent LLM Agent Evaluation & Benchmarks",
    description: "An in-depth benchmark dedicated to evaluating LLM Agents.",
    type: "website",
  },
};

export default async function Home() {
  const data = await getLeaderboardData();

  return (
    <main>
      <ClientPage initialData={data} />
    </main>
  );
}
