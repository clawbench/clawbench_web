import fs from 'fs';

const dataContent = fs.readFileSync('lib/data.ts', 'utf-8');
const detailDataContent = fs.readFileSync('lib/detailData.ts', 'utf-8');

const dataModels = [];
const dataMatch = dataContent.match(/const rawBenchmarkData: BenchmarkData\[\] = (\[[\s\S]*?\]);/);
if (dataMatch) {
  const data = eval('(' + dataMatch[1] + ')');
  data.forEach(item => dataModels.push(item.model));
}

const detailModels = [];
const detailMatch = detailDataContent.match(/const SPECIAL_MODEL_TASK_SCORES: Record<string, Record<string, number>> = (\{[\s\S]*?\n\});/);
if (detailMatch) {
  const scores = eval('(' + detailMatch[1] + ')');
  for (const model in scores) {
    detailModels.push(model);
  }
}

const allModels = new Set([...dataModels, ...detailModels]);
console.log(`Total unique models: ${allModels.size}`);
console.log(Array.from(allModels).sort());
