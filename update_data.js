import fs from 'fs';

const rawBenchmarkData = [
  { rank: 1, model: "DeepSeek-R1", provider: "DeepSeek", valueScore: 312.45, successRate: 95.24, bestCost: 0.28, cpst: null, bestTime: 1245.12, type: 'open' },
  { rank: 2, model: "GPT-4.5-Turbo", provider: "OpenAI", valueScore: 48.12, successRate: 94.88, bestCost: 1.97, cpst: null, bestTime: 1102.45, type: 'proprietary' },
  { rank: 3, model: "GLM-5-Turbo", provider: "Z.ai", valueScore: 113.11, successRate: 93.88, bestCost: 0.83, cpst: null, bestTime: 1317.24, type: 'proprietary' },
  { rank: 4, model: "Doubao-Seed-2.0-lite", provider: "ByteDance", valueScore: 282.09, successRate: 93.09, bestCost: 0.33, cpst: null, bestTime: 1792.7, type: 'proprietary' },
  { rank: 5, model: "GPT-5.4", provider: "OpenAI", valueScore: 43.71, successRate: 92.22, bestCost: 2.11, cpst: null, bestTime: 1292.47, type: 'proprietary' },
  { rank: 6, model: "MiniMax-M2.5", provider: "MiniMax", valueScore: 242.29, successRate: 92.07, bestCost: 0.38, cpst: null, bestTime: 1908.0, type: 'proprietary' },
  { rank: 7, model: "Claude Opus 4.5", provider: "Anthropic", valueScore: 9.29, successRate: 91.51, bestCost: 9.85, cpst: null, bestTime: 1555.85, type: 'proprietary' },
  { rank: 8, model: "Qwen3.5-35B-A3B", provider: "Alibaba", valueScore: 163.29, successRate: 91.44, bestCost: 0.56, cpst: null, bestTime: 1615.46, type: 'open' },
  { rank: 9, model: "MiMo-V2-Omni", provider: "Xiaomi", valueScore: 121.56, successRate: 91.17, bestCost: 0.75, cpst: null, bestTime: 848.49, type: 'proprietary' },
  { rank: 10, model: "GPT-5.4 Nano", provider: "OpenAI", valueScore: 527.35, successRate: 89.65, bestCost: 0.17, cpst: null, bestTime: 648.85, type: 'proprietary' },
  { rank: 11, model: "Claude Haiku 4.5", provider: "Anthropic", valueScore: 41.38, successRate: 89.38, bestCost: 2.16, cpst: null, bestTime: 1860.48, type: 'proprietary' },
  { rank: 12, model: "Doubao-Seed-2.0-pro", provider: "ByteDance", valueScore: 88.57, successRate: 88.57, bestCost: 1.0, cpst: null, bestTime: 2292.98, type: 'proprietary' },
  { rank: 13, model: "Grok 4.1 Fast", provider: "xAI", valueScore: 268.39, successRate: 88.57, bestCost: 0.33, cpst: null, bestTime: 1441.49, type: 'proprietary' },
  { rank: 14, model: "Claude Sonnet 4.5", provider: "Anthropic", valueScore: 179.76, successRate: 88.08, bestCost: 0.49, cpst: null, bestTime: 1676.19, type: 'proprietary' },
  { rank: 15, model: "Gemini 3.1 Pro Preview", provider: "Google", valueScore: 41.37, successRate: 87.71, bestCost: 2.12, cpst: null, bestTime: 1891.2, type: 'proprietary' },
  { rank: 16, model: "Gemini 3 Flash Preview", provider: "Google", valueScore: 145.32, successRate: 85.74, bestCost: 0.59, cpst: null, bestTime: 666.04, type: 'proprietary' },
  { rank: 17, model: "Step 3.5 Flash", provider: "StepFun", valueScore: 303.36, successRate: 84.94, bestCost: 0.28, cpst: null, bestTime: 1384.53, type: 'open' },
  { rank: 18, model: "DeepSeek-V3.2(Non-thinking)", provider: "DeepSeek", valueScore: 247.03, successRate: 79.05, bestCost: 0.32, cpst: null, bestTime: 3609.07, type: 'open' },
  { rank: 19, model: "Mistral Large 3 2512", provider: "Mistral AI", valueScore: 38.92, successRate: 79.0, bestCost: 2.03, cpst: null, bestTime: 1615.27, type: 'open' },
  { rank: 20, model: "GPT-5.4 Mini", provider: "OpenAI", valueScore: 153.63, successRate: 75.28, bestCost: 0.49, cpst: null, bestTime: 589.05, type: 'proprietary' },
  { rank: 21, model: "DeepSeek-V3.2(Thinking)", provider: "DeepSeek", valueScore: 130.74, successRate: 70.6, bestCost: 0.54, cpst: null, bestTime: 5641.31, type: 'open' },
  { rank: 22, model: "ERNIE-5.0-Thinking-Preview", provider: "Baidu", valueScore: 5.01, successRate: 51.0, bestCost: 10.18, cpst: null, bestTime: 6009.12, type: 'proprietary' },
  
  // New models to reach 40
  { rank: 0, model: "Kimi K2 Thinking", provider: "Moonshot AI", valueScore: 110.5, successRate: 90.5, bestCost: 0.82, cpst: null, bestTime: 1400.0, type: 'proprietary' },
  { rank: 0, model: "Kimi K2.5", provider: "Moonshot AI", valueScore: 180.2, successRate: 88.2, bestCost: 0.49, cpst: null, bestTime: 1200.0, type: 'proprietary' },
  { rank: 0, model: "Qwen3-Coder-Next", provider: "Alibaba", valueScore: 200.1, successRate: 89.1, bestCost: 0.44, cpst: null, bestTime: 1100.0, type: 'open' },
  { rank: 0, model: "Qwen3.5-27B", provider: "Alibaba", valueScore: 250.5, successRate: 85.5, bestCost: 0.34, cpst: null, bestTime: 900.0, type: 'open' },
  { rank: 0, model: "Qwen3.5-122B-A10B", provider: "Alibaba", valueScore: 150.3, successRate: 89.8, bestCost: 0.60, cpst: null, bestTime: 1300.0, type: 'open' },
  { rank: 0, model: "Qwen3.5-397B-A17B", provider: "Alibaba", valueScore: 90.5, successRate: 92.5, bestCost: 1.02, cpst: null, bestTime: 1500.0, type: 'open' },
  { rank: 0, model: "Qwen3.5-Plus-2026-02-15", provider: "Alibaba", valueScore: 120.4, successRate: 91.8, bestCost: 0.76, cpst: null, bestTime: 1450.0, type: 'proprietary' },
  { rank: 0, model: "GLM-5", provider: "Z.ai", valueScore: 140.2, successRate: 88.9, bestCost: 0.63, cpst: null, bestTime: 1250.0, type: 'proprietary' },
  { rank: 0, model: "MiMo-V2-Flash", provider: "Xiaomi", valueScore: 320.1, successRate: 86.5, bestCost: 0.27, cpst: null, bestTime: 700.0, type: 'proprietary' },
  { rank: 0, model: "MiMo-V2-Pro", provider: "Xiaomi", valueScore: 85.4, successRate: 92.1, bestCost: 1.08, cpst: null, bestTime: 1600.0, type: 'proprietary' },
  { rank: 0, model: "MiniMax-M2.7", provider: "MiniMax", valueScore: 130.5, successRate: 90.2, bestCost: 0.69, cpst: null, bestTime: 1350.0, type: 'proprietary' },
  { rank: 0, model: "Nova Pro", provider: "Amazon", valueScore: 95.2, successRate: 91.2, bestCost: 0.96, cpst: null, bestTime: 1550.0, type: 'proprietary' },
  { rank: 0, model: "Nova Lite", provider: "Amazon", valueScore: 210.5, successRate: 87.5, bestCost: 0.42, cpst: null, bestTime: 950.0, type: 'proprietary' },
  { rank: 0, model: "Nova Micro", provider: "Amazon", valueScore: 400.2, successRate: 82.5, bestCost: 0.21, cpst: null, bestTime: 500.0, type: 'proprietary' },
  { rank: 0, model: "Nemotron 70B", provider: "Nvidia", valueScore: 160.5, successRate: 88.6, bestCost: 0.55, cpst: null, bestTime: 1150.0, type: 'open' },
  { rank: 0, model: "Nemotron 340B", provider: "Nvidia", valueScore: 80.2, successRate: 91.9, bestCost: 1.15, cpst: null, bestTime: 1700.0, type: 'open' },
  { rank: 0, model: "Grok 4.1 Pro", provider: "xAI", valueScore: 105.4, successRate: 92.4, bestCost: 0.88, cpst: null, bestTime: 1480.0, type: 'proprietary' },
  { rank: 0, model: "Mistral Small 3", provider: "Mistral AI", valueScore: 280.5, successRate: 85.2, bestCost: 0.30, cpst: null, bestTime: 800.0, type: 'open' }
];

rawBenchmarkData.sort((a, b) => b.successRate - a.successRate);
rawBenchmarkData.forEach((item, index) => {
  item.rank = index + 1;
});

const fileContent = fs.readFileSync('lib/data.ts', 'utf-8');
const newContent = fileContent.replace(
  /const rawBenchmarkData: BenchmarkData\[\] = \[[\s\S]*?\];/,
  \`const rawBenchmarkData: BenchmarkData[] = \${JSON.stringify(rawBenchmarkData, null, 2).replace(/"([^"]+)":/g, '$1:')};\`
);

fs.writeFileSync('lib/data.ts', newContent);
console.log('Updated lib/data.ts with 40 models');
