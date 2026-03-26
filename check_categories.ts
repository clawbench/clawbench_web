import { benchmarkData } from './lib/data';
import * as fs from 'fs';

const detailDataContent = fs.readFileSync('./lib/detailData.ts', 'utf-8');

// Extract TASKS
const tasksMatch = detailDataContent.match(/const TASKS = \[([\s\S]*?)\] as const;/);
const tasksStr = tasksMatch ? tasksMatch[1] : '';
const tasks = [];
const taskRegex = /\{ id: '([^']+)', name: '([^']+)', category: '([^']+)'/g;
let match;
while ((match = taskRegex.exec(tasksStr)) !== null) {
  tasks.push({ id: match[1], name: match[2], category: match[3] });
}

// Extract SPECIAL_MODEL_TASK_SCORES
const taskScoresMatch = detailDataContent.match(/const SPECIAL_MODEL_TASK_SCORES: Record<string, Record<string, number>> = (\{[\s\S]*?\n\});/);
let taskScores = {};
if (taskScoresMatch) {
  taskScores = eval('(' + taskScoresMatch[1] + ')');
}

// Extract SPECIAL_MODEL_CATEGORY_SCORES
const catScoresMatch = detailDataContent.match(/const SPECIAL_MODEL_CATEGORY_SCORES: Record<string, Record<string, number>> = (\{[\s\S]*?\n\});/);
let catScores = {};
if (catScoresMatch) {
  catScores = eval('(' + catScoresMatch[1] + ')');
}

for (const model in taskScores) {
  const scores = taskScores[model];
  const catAvgs = {};
  const catCounts = {};
  for (const task of tasks) {
    if (!catAvgs[task.category]) {
      catAvgs[task.category] = 0;
      catCounts[task.category] = 0;
    }
    catAvgs[task.category] += scores[task.id] || 0;
    catCounts[task.category]++;
  }
  
  console.log(`\nModel: ${model}`);
  let totalScore = 0;
  let totalCount = 0;
  for (const cat in catAvgs) {
    const avg = catAvgs[cat] / catCounts[cat];
    const expected = catScores[model]?.[cat];
    totalScore += catAvgs[cat];
    totalCount += catCounts[cat];
    if (Math.abs(avg - expected) > 0.01) {
      console.log(`  Category ${cat}: Avg=${avg.toFixed(2)}, Expected=${expected}`);
    }
  }
  const overallAvg = totalScore / totalCount;
  const dataSuccessRate = benchmarkData.find(m => m.model === model)?.successRate;
  if (Math.abs(overallAvg - dataSuccessRate) > 0.01) {
    console.log(`  Overall: Avg=${overallAvg.toFixed(2)}, Data=${dataSuccessRate}`);
  }
}
