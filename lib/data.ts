export interface BenchmarkData {
  rank: number | string;
  model: string;
  provider: string;
  valueScore: number | string | null;
  successRate: number;
  bestCost: number | string | null;
  cpst: number | null;
  bestTime?: number;
  avgSuccess?: number;
  type: 'open' | 'proprietary';
  logo?: string;
  color?: string;
  updatedDate?: string;
}

const rawBenchmarkData: BenchmarkData[] = [
  { rank: 1, model: "GLM-5-Turbo", provider: "Z.ai", valueScore: 113.11, successRate: 93.88, bestCost: 0.83, cpst: null, bestTime: 1317.24, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 2, model: "Doubao-Seed-2.0-lite", provider: "ByteDance", valueScore: 282.09, successRate: 93.09, bestCost: 0.33, cpst: null, bestTime: 1792.7, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 3, model: "GPT-5.4", provider: "OpenAI", valueScore: 43.71, successRate: 92.22, bestCost: 2.11, cpst: null, bestTime: 1292.47, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 4, model: "MiniMax-M2.5", provider: "MiniMax", valueScore: 242.29, successRate: 92.07, bestCost: 0.38, cpst: null, bestTime: 1908.0, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 5, model: "MiniMax-M2.7", provider: "MiniMax", valueScore: 208.50, successRate: 91.74, bestCost: 0.44, cpst: null, bestTime: 2002.75, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 6, model: "GLM-5", provider: "Z.ai", valueScore: 70.50, successRate: 91.65, bestCost: 1.3, cpst: null, bestTime: 2376.61, type: 'open', updatedDate: '03/27/2026' },
  { rank: 7, model: "Claude Opus 4.5", provider: "Anthropic", valueScore: 9.29, successRate: 91.51, bestCost: 9.85, cpst: null, bestTime: 1555.85, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 8, model: "Qwen3.5-35B-A3B", provider: "Alibaba", valueScore: 163.29, successRate: 91.44, bestCost: 0.56, cpst: null, bestTime: 1615.46, type: 'open', updatedDate: '03/27/2026' },
  { rank: 9, model: "MiMo-V2-Omni", provider: "Xiaomi", valueScore: 121.56, successRate: 91.17, bestCost: 0.75, cpst: null, bestTime: 848.49, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 10, model: "GLM-5V-Turbo", provider: "Z.ai", valueScore: 21.71, successRate: 90.11, bestCost: 4.15, cpst: null, bestTime: 1832.25, type: 'proprietary', updatedDate: '04/02/2026' },
  { rank: 11, model: "Qwen3.5-397B-A17B", provider: "Alibaba", valueScore: 105.84, successRate: 89.96, bestCost: 0.85, cpst: null, bestTime: 1661.01, type: 'open', updatedDate: '03/27/2026' },
  { rank: 12, model: "GPT-5.4 Nano", provider: "OpenAI", valueScore: 527.35, successRate: 89.65, bestCost: 0.17, cpst: null, bestTime: 648.85, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 13, model: "Claude Haiku 4.5", provider: "Anthropic", valueScore: 41.38, successRate: 89.38, bestCost: 2.16, cpst: null, bestTime: 1860.48, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 14, model: "MiMo-V2-Pro", provider: "Xiaomi", valueScore: 16.82, successRate: 89.33, bestCost: 5.31, cpst: null, bestTime: 1712.94, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 15, model: "Doubao-Seed-2.0-pro", provider: "ByteDance", valueScore: 88.57, successRate: 88.57, bestCost: 1.0, cpst: null, bestTime: 2292.98, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 16, model: "Grok 4.1 Fast", provider: "xAI", valueScore: 268.39, successRate: 88.57, bestCost: 0.33, cpst: null, bestTime: 1441.49, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 17, model: "Qwen3.5-Plus-2026-02-15", provider: "Alibaba", valueScore: 75.57, successRate: 88.42, bestCost: 1.17, cpst: null, bestTime: 2793.97, type: 'open', updatedDate: '03/27/2026' },
  { rank: 18, model: "Claude Opus 4.6", provider: "Anthropic", valueScore: 13.59, successRate: 88.18, bestCost: 6.49, cpst: null, bestTime: 1524.28, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 19, model: "Claude Sonnet 4.5", provider: "Anthropic", valueScore: 179.76, successRate: 88.08, bestCost: 0.49, cpst: null, bestTime: 1676.19, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 20, model: "Gemini 3.1 Pro Preview", provider: "Google", valueScore: 41.37, successRate: 87.71, bestCost: 2.12, cpst: null, bestTime: 1891.2, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 21, model: "Qwen3.5-122B-A10B", provider: "Alibaba", valueScore: 85.98, successRate: 85.98, bestCost: 1.00, cpst: null, bestTime: 1431.2, type: 'open', updatedDate: '03/27/2026' },
  { rank: 22, model: "Gemini 3 Flash Preview", provider: "Google", valueScore: 145.32, successRate: 85.74, bestCost: 0.59, cpst: null, bestTime: 666.04, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 23, model: "Qwen3.6-Plus", provider: "Alibaba", valueScore: 41.63, successRate: 85.75, bestCost: 2.06, cpst: null, bestTime: 1590.11, type: 'open', updatedDate: '04/02/2026' },
  { rank: 24, model: "MiMo-V2-Flash", provider: "Xiaomi", valueScore: 122.31, successRate: 85.62, bestCost: 0.70, cpst: null, bestTime: 2059.59, type: 'open', updatedDate: '03/27/2026' },
  { rank: 25, model: "Step 3.5 Flash", provider: "StepFun", valueScore: 303.36, successRate: 84.94, bestCost: 0.28, cpst: null, bestTime: 1384.53, type: 'open', updatedDate: '03/27/2026' },
  { rank: 26, model: "Kimi K2 Thinking", provider: "Moonshot AI", valueScore: 51.26, successRate: 82.53, bestCost: 1.61, cpst: null, bestTime: 2745.35, type: 'open', updatedDate: '03/27/2026' },
  { rank: 27, model: "Kimi K2.5", provider: "Moonshot AI", valueScore: 35.53, successRate: 81.72, bestCost: 2.30, cpst: null, bestTime: 2621.14, type: 'open', updatedDate: '03/27/2026' },
  { rank: 28, model: "Gemini 2.5 Pro", provider: "Google", valueScore: 37.21, successRate: 80.37, bestCost: 2.16, cpst: null, bestTime: 1547.31, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 29, model: "DeepSeek-V3.2(Non-thinking)", provider: "DeepSeek", valueScore: 247.03, successRate: 79.05, bestCost: 0.32, cpst: null, bestTime: 3609.07, type: 'open', updatedDate: '03/27/2026' },
  { rank: 30, model: "Mistral Large 3 2512", provider: "Mistral AI", valueScore: 38.92, successRate: 79.0, bestCost: 2.03, cpst: null, bestTime: 1615.27, type: 'open', updatedDate: '03/27/2026' },
  { rank: 31, model: "Claude Sonnet 4.6", provider: "Anthropic", valueScore: 12.73, successRate: 77.91, bestCost: 6.12, cpst: null, bestTime: 2133.62, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 32, model: "Qwen3-Coder-Next", provider: "Alibaba", valueScore: 26.80, successRate: 75.83, bestCost: 2.83, cpst: null, bestTime: 1937.18, type: 'open', updatedDate: '03/27/2026' },
  { rank: 33, model: "GPT-5.4 Mini", provider: "OpenAI", valueScore: 153.63, successRate: 75.28, bestCost: 0.49, cpst: null, bestTime: 589.05, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 34, model: "Qwen3.5-27B", provider: "Alibaba", valueScore: 38.19, successRate: 75.24, bestCost: 1.97, cpst: null, bestTime: 2800.59, type: 'open', updatedDate: '03/27/2026' },
  { rank: 35, model: "Grok 4.20 Beta", provider: "xAI", valueScore: 34.86, successRate: 73.91, bestCost: 2.12, cpst: null, bestTime: 524.15, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 36, model: "Nemotron 3 Nano", provider: "Nvidia", valueScore: "--", successRate: 71.59, bestCost: "--", cpst: null, bestTime: 1297.79, type: 'open', updatedDate: '03/27/2026' },
  { rank: 37, model: "DeepSeek-V3.2(Thinking)", provider: "DeepSeek", valueScore: 130.74, successRate: 70.6, bestCost: 0.54, cpst: null, bestTime: 5641.31, type: 'open', updatedDate: '03/27/2026' },
  { rank: 38, model: "Nova 2 Lite", provider: "Amazon", valueScore: 58.08, successRate: 68.54, bestCost: 1.18, cpst: null, bestTime: 1563.92, type: 'proprietary', updatedDate: '03/27/2026' },
  { rank: 39, model: "gpt-oss-20b", provider: "OpenAI", valueScore: 851.50, successRate: 68.12, bestCost: 0.08, cpst: null, bestTime: 530.47, type: 'open', updatedDate: '03/27/2026' },
  { rank: 40, model: "Nemotron 3 Super", provider: "Nvidia", valueScore: "--", successRate: 66.27, bestCost: "--", cpst: null, bestTime: 5189.28, type: 'open', updatedDate: '03/27/2026' },
  { rank: 41, model: "gpt-oss-120b", provider: "OpenAI", valueScore: 361.00, successRate: 64.98, bestCost: 0.18, cpst: null, bestTime: 1217.58, type: 'open', updatedDate: '03/27/2026' },
  { rank: 42, model: "ERNIE-5.0-Thinking-Preview", provider: "Baidu", valueScore: 5.01, successRate: 51.0, bestCost: 10.18, cpst: null, bestTime: 6009.12, type: 'proprietary', updatedDate: '03/27/2026' }
];

const logoExtensions: Record<string, string> = {
  'Alibaba': 'svg',
  'Moonshot AI': 'svg',
  'Baidu': 'svg',
  'ByteDance': 'svg',
  'DeepSeek': 'svg',
  'MiniMax': 'svg',
  'StepFun': 'svg',
  'Xiaomi': 'svg',
  'Z.ai': 'svg',
  'Amazon': 'svg',
  'Anthropic': 'svg',
  'Google': 'svg',
  'OpenAI': 'svg',
  'Mistral AI': 'svg',
  'Nvidia': 'svg',
  'xAI': 'svg'
};

export const providerColors: Record<string, string> = {
  'Alibaba': '#ff6a00',
  'Moonshot AI': '#1a88ff',
  'Baidu': '#4e6ef2',
  'ByteDance': '#3c8cff',
  'DeepSeek': '#3b82f6',
  'MiniMax': '#eb3568',
  'StepFun': '#165dff',
  'Xiaomi': '#ff6700',
  'Z.ai': '#134cff',
  'Amazon': '#ff9900',
  'Anthropic': '#141413',
  'Google': '#1a73e8',
  'OpenAI': '#000000',
  'Mistral AI': '#fa520f',
  'Nvidia': '#76b900',
  'xAI': '#0a0a0a'
};

const processedBenchmarkData = rawBenchmarkData.map(item => {
  const logoName = item.provider.replace(' ', '');
  const ext = logoExtensions[item.provider] || 'svg';
  return {
    ...item,
    logo: `/logos/${logoName}.${ext}`,
    color: providerColors[item.provider] || '#6366f1'
  };
}) as BenchmarkData[];

export const benchmarkData = processedBenchmarkData;
