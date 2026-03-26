"use client";

import React from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Github, 
  Download, 
  ChevronRight 
} from 'lucide-react';
import { BenchmarkData } from '@/lib/data';
import { HeaderTooltip } from './HeaderTooltip';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategoryViewProps {
  selectedCategory: string;
  benchmarkData: BenchmarkData[];
  onBack: () => void;
  onAboutClick: () => void;
  onModelClick: (model: BenchmarkData) => void;
  onDownload: (id: string, name: string) => void;
}

export const CategoryView = ({ 
  selectedCategory, 
  benchmarkData, 
  onBack, 
  onAboutClick, 
  onModelClick,
  onDownload
}: CategoryViewProps) => {
  const categoryTitle = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  const sortedData = [...benchmarkData].sort((a, b) => {
    if (selectedCategory === 'creator') return a.provider.localeCompare(b.provider);
    if (selectedCategory === 'successrate') return b.successRate - a.successRate;
    if (selectedCategory === 'speed') return (a.bestTime || 0) - (b.bestTime || 0);
    if (selectedCategory === 'cost') {
      if (a.bestCost === '--') return 1;
      if (b.bestCost === '--') return -1;
      return ((a.bestCost as number) || 0) - ((b.bestCost as number) || 0);
    }
    if (selectedCategory === 'value') {
      if (a.valueScore === '--') return 1;
      if (b.valueScore === '--') return -1;
      return ((b.valueScore as number) || 0) - ((a.valueScore as number) || 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-bg-deep text-text-secondary font-sans selection:bg-coral-mid/30">
      <header className="bg-brand-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
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
                <span className="text-xl font-black text-white tracking-tighter leading-none">ClawBench</span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-sm font-bold text-white/60 hover:text-brand-red transition-colors uppercase tracking-widest">About</a>
            <a 
              href="https://github.com/clawbench" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-sm font-bold text-white transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-coral-bright transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
        </button>

        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black text-text-primary mb-4 uppercase tracking-tight">
              Top Models by <span className="text-coral-bright">{categoryTitle}</span>
            </h1>
            <p className="text-text-muted max-w-2xl">
              Detailed leaderboard ranking models based on their performance in {categoryTitle}. 
              Data is updated daily based on real-world benchmark results.
            </p>
          </div>
        </div>

        <div className="bg-white border border-border-subtle rounded-3xl shadow-xl mb-12 capture-container" id="category-table">
          {/* Branding Top */}
          <div className="p-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between rounded-t-3xl relative z-10">
            <div className="flex items-center gap-4">
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
                  <span className="text-xl font-black text-text-primary tracking-tighter leading-none">ClawBench</span>
                  <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border-subtle mx-2"></div>
              <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Top Models by {categoryTitle}</h2>
            </div>
            <button 
              onClick={() => onDownload('category-table', `leaderboard-${selectedCategory}`)}
              className="download-btn flex items-center justify-center bg-brand-black/60 backdrop-blur-sm text-white rounded-lg p-2.5 hover:bg-brand-red transition-all cursor-pointer shadow-lg shadow-brand-black/10"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-b-3xl">
            <table className="w-full text-sm text-left min-w-[800px] border-collapse">
              <thead>
                <tr className="text-text-muted border-b border-border-subtle bg-bg-elevated/50 relative z-20">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Rank</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">Model</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      CLAW SCORE
                      <HeaderTooltip text="Percentage of all evaluations resolved in ClawBench; Higher is Better" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Speed
                      <HeaderTooltip text="Time (s) to run all evaluations in the ClawBench; Lower is better" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Cost
                      <HeaderTooltip text="Cost (USD) to run all evaluations in the ClawBench; Lower is better" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                    <div className="flex items-center justify-center gap-1">
                      Value
                      <HeaderTooltip text="CLAW SCORE/COST; Higher is Better" />
                    </div>
                  </th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {sortedData.map((item, idx) => (
                  <tr 
                    key={item.model} 
                    className="hover:bg-bg-elevated/50 transition-colors group cursor-pointer"
                    onClick={() => onModelClick(item)}
                  >
                    <td className="px-6 py-4">
                      <span className={cn(
                        "font-black text-lg",
                        idx === 0 ? "text-coral-bright" : "text-text-muted"
                      )}>#{idx + 1}</span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white border border-border-subtle shrink-0 shadow-sm p-1.5">
                          {item.logo ? (
                            <Image 
                              src={item.logo} 
                              alt={`${item.provider} logo`} 
                              width={28} 
                              height={28} 
                              className="object-contain w-full h-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-lg font-black uppercase" style={{ color: item.color }}>
                              {item.provider[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 items-start">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-text-primary group-hover:text-coral-bright transition-colors text-base text-left">
                              {item.model.split('/').pop()}
                            </span>
                            <span className={cn(
                              "text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-md",
                              item.type === 'open' 
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                            )}>
                              {item.type === 'open' ? 'Open Weights' : 'Proprietary'}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-text-muted/80 text-left">
                            {item.provider.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-center font-bold",
                      selectedCategory === 'successrate' ? "text-coral-bright" : "text-text-primary"
                    )}>
                      {item.successRate.toFixed(1)}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-center font-medium",
                      selectedCategory === 'speed' ? "text-coral-bright" : "text-text-secondary"
                    )}>
                      {item.bestTime ? `${item.bestTime.toFixed(0)}s` : '--'}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-center font-medium",
                      selectedCategory === 'cost' ? "text-coral-bright" : "text-text-secondary"
                    )}>
                      {item.bestCost === '--' ? '--' : (item.bestCost ? `$${(item.bestCost as number).toFixed(2)}` : '--')}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-center font-medium",
                      selectedCategory === 'value' ? "text-brand-red" : "text-text-secondary"
                    )}>
                      {item.valueScore === '--' ? '--' : (item.valueScore ? (item.valueScore as number).toFixed(1) : '--')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-coral-bright group-hover:text-coral-mid transition-colors flex items-center justify-end">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Branding Bottom */}
          <div className="branding-bottom p-8 bg-bg-deep border-t border-border-subtle text-center">
            <div className="text-[10px] font-medium text-text-muted lowercase tracking-[0.2em]">
              https://clawbenchlabs.com
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
