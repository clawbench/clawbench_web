import fs from 'fs';

const detailDataContent = fs.readFileSync('lib/detailData.ts', 'utf-8');
const match = detailDataContent.match(/const SPECIAL_MODEL_TASK_SCORES: Record<string, Record<string, number>> = (\{[\s\S]*?\n\});/);

if (match) {
  const scoresStr = match[1];
  const scores = eval('(' + scoresStr + ')');
  
  for (const model in scores) {
    const taskScores = Object.values(scores[model]);
    const avg = taskScores.reduce((a, b) => a + (b as number), 0) / taskScores.length;
    console.log(`${model}: ${avg.toFixed(2)}`);
  }
} else {
  console.log("Could not find SPECIAL_MODEL_TASK_SCORES");
}
