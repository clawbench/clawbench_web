"use client";

import React from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Clock, 
  Code, 
  Calculator, 
  FileText 
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { motion } from 'motion/react';
import { BenchmarkData } from '@/lib/data';
import { ModelDetailData } from '@/lib/detailData';
import { cn } from '@/lib/utils';

interface ModelDetailViewProps {
  selectedModel: BenchmarkData;
  detailData: ModelDetailData;
  selectedCategory: string | null;
  onBack: () => void;
  onAboutClick: () => void;
}

const RadarTick = (props: any) => {
  const { payload, x, y, textAnchor } = props;
  const value = payload.value;
  const parts = value.split('|');
  
  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="#6b7280"
        fontSize={10}
        fontWeight={600}
        className="uppercase tracking-tighter"
      >
        <tspan x={x} dy="-0.2em">{parts[0]}</tspan>
        <tspan x={x} dy="1.4em" fill="var(--color-coral-bright)" fontWeight={900} fontSize={12}>{parts[1]}</tspan>
      </text>
    </g>
  );
};

export const ModelDetailView = ({ 
  selectedModel, 
  detailData, 
  selectedCategory, 
  onBack,
  onAboutClick
}: ModelDetailViewProps) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep text-text-secondary font-sans selection:bg-coral-mid/30">
      {/* Header */}
      <header className="bg-brand-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-brand-red transition-colors font-bold text-sm group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to {selectedCategory ? 'Category' : 'Leaderboard'}
          </button>
          <div className="flex items-center gap-2">
            <div className="relative h-12 w-12">
              <Image 
                src="/logo-transparent.png" 
                alt="ClawBench Logo" 
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center items-start">
              <span className="font-black text-lg tracking-tight text-white leading-none">ClawBench</span>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-white border border-border-subtle shadow-sm p-2">
                {detailData.logo ? (
                  <Image 
                    src={detailData.logo} 
                    alt={`${detailData.provider} logo`} 
                    width={48} 
                    height={48} 
                    className="object-contain w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl font-black uppercase" style={{ color: selectedModel.color }}>
                    {selectedModel.provider[0]}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-start gap-2">
                  <h1 className="text-4xl font-bold text-text-primary tracking-tight">{detailData.model}</h1>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border mt-1.5",
                    detailData.type === 'open' 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                      : "bg-indigo-100 text-indigo-700 border-indigo-200"
                  )}>
                    {detailData.type === 'open' ? 'Open Weights' : 'Proprietary'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-text-muted font-medium">by {detailData.provider.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Updated 03/23/2026</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Top Section: Overall Score & Radar Chart Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              {/* Overall Score Card */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full">
                <div className="relative w-48 h-48 flex items-center justify-center mb-4">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-bg-elevated"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="var(--color-coral-bright)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 80}
                      initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 80) - (selectedModel.successRate / 100) * (2 * Math.PI * 80) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-text-primary tracking-tighter">{selectedModel.successRate.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-text-primary tracking-widest uppercase">CLAW SCORE</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* Radar Chart Analysis */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm h-full">
                <h3 className="text-xl font-bold text-text-primary mb-8 uppercase tracking-tight">Multidimensional Analysis</h3>
                <div className="h-[300px] w-full">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { label: 'Office Collaboration', category: 'Office Collaboration' },
                        { label: 'Information Retrieval and Research', category: 'Information Retrieval and Research' },
                        { label: 'Content Creation', category: 'Content Creation' },
                        { label: 'Data Processing and Analysis', category: 'Data Processing and Analysis' },
                        { label: 'Software Engineering', category: 'Software Engineering' }
                      ].map(({ label, category }) => {
                        const categoryTasks = detailData.tasks.filter(t => t.category === category);
                        const avgScore = categoryTasks.length > 0 
                          ? categoryTasks.reduce((sum, t) => sum + t.score, 0) / categoryTasks.length 
                          : 0;
                        const scoreVal = (avgScore * 100).toFixed(1);
                        return {
                          subject: `${label}|${scoreVal}`,
                          A: parseFloat(scoreVal),
                          fullMark: 100
                        };
                      })}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={<RadarTick />}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name={selectedModel.model}
                          dataKey="A"
                          stroke={selectedModel.color || 'var(--color-brand-red)'}
                          fill={selectedModel.color || 'var(--color-brand-red)'}
                          fillOpacity={0.6}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any) => [Number(value).toFixed(1), 'Score']}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Task Breakdown */}
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-text-primary mb-8 uppercase tracking-tight">Task Breakdown</h3>
            <div className="space-y-12">
              {Object.entries(
                detailData.tasks.reduce((acc, task) => {
                  if (!acc[task.category]) acc[task.category] = [];
                  acc[task.category].push(task);
                  return acc;
                }, {} as Record<string, typeof detailData.tasks>)
              ).map(([category, categoryTasks]) => (
                <div key={category}>
                  <h4 className="text-sm font-black text-text-muted mb-4 uppercase tracking-widest">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryTasks.map((task) => (
                      <div key={task.id} className="border border-border-subtle rounded-xl p-4 bg-bg-deep/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-bg-elevated rounded-lg text-text-muted">
                              {task.name.includes('Code') ? <Code className="w-4 h-4" /> : 
                               task.name.includes('Math') ? <Calculator className="w-4 h-4" /> : 
                               <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-text-primary text-sm">{task.name}</div>
                              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-0.5">
                                {task.method.replace('_', ' ')}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-text-primary text-sm">{(task.score * 100).toFixed(1)}</span>
                        </div>
                        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${task.score * 100}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: selectedModel.color || 'var(--color-brand-red)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-surface py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image 
                  src="/logo-transparent.png" 
                  alt="ClawBench Logo" 
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col justify-center items-start">
                <span className="text-text-primary font-black tracking-tighter leading-none">ClawBench</span>
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-text-muted">
              <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="hover:text-text-primary transition-colors">About</a>
              <a href="https://github.com/clawbench" target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
