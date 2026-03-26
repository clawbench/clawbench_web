import { benchmarkData, type BenchmarkData } from './data';

/**
 * 获取排行榜数据
 * 
 * 当前阶段：从本地静态文件获取数据，并模拟异步请求。
 * 未来阶段：只需将此函数改为 fetch 真实 API，UI 组件无需任何改动。
 */
export async function getLeaderboardData(): Promise<BenchmarkData[]> {
  // 模拟一个极其短暂的网络请求，确保前端能处理异步逻辑
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(benchmarkData);
    }, 100);
  });
}

// 未来接入后端时的写法示例：
/*
export async function getLeaderboardData(): Promise<BenchmarkData[]> {
  const res = await fetch('https://api.yourdomain.com/leaderboard', {
    next: { revalidate: 3600 } // 可选：配置 Next.js 缓存
  });
  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }
  return res.json();
}
*/
