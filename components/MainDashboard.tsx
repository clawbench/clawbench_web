"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { 
  Github, 
  ChevronDown,
  ChevronUp,
  Activity,
  Download,
  ChevronRight,
  Info,
  Search,
  Filter
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  LabelList,
  ReferenceLine,
  Label,
  ReferenceArea
} from 'recharts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { domToPng } from 'modern-screenshot';
import { benchmarkData, type BenchmarkData, providerColors } from '@/lib/data';
import { getModelDetail } from '@/lib/detailData';
import { TopMetricChart } from './TopMetricChart';
import { HeaderTooltip } from './HeaderTooltip';
import { AboutView } from './AboutView';
import { ModelDetailView } from './ModelDetailView';
import { CategoryView } from './CategoryView';
import { DimensionsView } from './DimensionsView';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'success' | 'speed' | 'cost' | 'value' | 'graphs';

export default function Dashboard({ initialData }: { initialData: BenchmarkData[] }) {
  const [activeView, setActiveView] = useState<'leaderboard' | 'graphs'>('leaderboard');
  const [activeGraph, setActiveGraph] = useState<'cost' | 'speed'>('cost');
  const [searchQuery, setSearchQuery] = useState('');
  const [renderTick, setRenderTick] = useState(0);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const placedBoxesRef = React.useRef<Array<{left: number, right: number, top: number, bottom: number}>>([]);
  const dotCacheRef = React.useRef<Record<string, {x: number, y: number}>>({});
  const lastGraphTypeRef = React.useRef('');

  useEffect(() => {
    if (activeView === 'graphs') {
      const timer = setTimeout(() => setRenderTick(t => t + 1), 50);
      return () => clearTimeout(timer);
    }
  }, [activeView, activeGraph, searchQuery]);

  const [modelTypeFilter, setModelTypeFilter] = useState<'all' | 'open' | 'proprietary'>('all');
  const [selectedModel, setSelectedModel] = useState<BenchmarkData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof BenchmarkData, direction: 'asc' | 'desc' } | null>({ key: 'successRate', direction: 'desc' });
  const [isMounted, setIsMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedModel) {
      window.scrollTo(0, 0);
    }
  }, [selectedModel]);

  const handleSort = (key: keyof BenchmarkData) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof BenchmarkData }) => {
    if (sortConfig?.key !== columnKey) {
      return <div className="flex flex-col opacity-30"><ChevronUp className="w-3 h-3 -mb-1.5" /><ChevronDown className="w-3 h-3" /></div>;
    }
    return (
      <div className="flex flex-col">
        <ChevronUp className={cn("w-3 h-3 -mb-1.5", sortConfig.direction === 'asc' ? "opacity-100 text-coral-bright" : "opacity-30")} />
        <ChevronDown className={cn("w-3 h-3", sortConfig.direction === 'desc' ? "opacity-100 text-coral-bright" : "opacity-30")} />
      </div>
    );
  };

  const handleDownload = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }
    
    try {
      const dataUrl = await domToPng(element, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        features: {
          removeControlCharacter: true,
        },
        onCloneNode: (clone: any) => {
          if (clone.classList && clone.classList.contains('capture-container')) {
            clone.classList.add('is-capturing');
          }
        },
        filter: (node: any) => {
          if (node.classList?.contains('download-btn')) return false;
          if (node.classList?.contains('recharts-tooltip-wrapper')) return false;
          return true;
        },
        style: {
          '--branding-display-top': 'flex',
          '--branding-display-bottom': 'block',
        } as any
      });
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const detailData = useMemo(() => {
    if (!selectedModel) return null;
    return getModelDetail(selectedModel.model, selectedModel.provider, selectedModel.successRate);
  }, [selectedModel]);

  const baseData = useMemo(() => (initialData && initialData.length > 0) ? initialData : benchmarkData, [initialData]);

  const filteredData = useMemo(() => {
    let data = baseData.filter(item => {
      const matchesSearch = item.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModelType = modelTypeFilter === 'all' || item.type === modelTypeFilter;
      return matchesSearch && matchesModelType;
    });

    if (sortConfig) {
      data.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'bestCost' || sortConfig.key === 'valueScore') {
          if (aValue === '--') return 1;
          if (bValue === '--') return -1;
        }

        if (aValue === null || aValue === undefined) aValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
        if (bValue === null || bValue === undefined) bValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [searchQuery, modelTypeFilter, sortConfig, baseData]);

  const sortedBySuccess = useMemo(() => [...baseData].sort((a, b) => b.successRate - a.successRate), [baseData]);
  const sortedByCost = useMemo(() => [...baseData].sort((a, b) => {
    if (a.bestCost === '--') return 1;
    if (b.bestCost === '--') return -1;
    return (a.bestCost as number || 0) - (b.bestCost as number || 0);
  }), [baseData]);
  const sortedBySpeed = useMemo(() => [...baseData].filter(d => d.bestTime !== null && d.bestTime !== undefined).sort((a, b) => (a.bestTime || 0) - (b.bestTime || 0)), [baseData]);

  const xMid = useMemo(() => {
    const values = filteredData
      .map(d => activeGraph === 'cost' ? d.bestCost : d.bestTime)
      .filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 0;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return (min + max) / 2;
  }, [filteredData, activeGraph]);

  const yMid = useMemo(() => {
    return 75; // Fixed middle for Y-axis domain [50, 100]
  }, []);

  if (showAbout) {
    return <AboutView onBack={() => setShowAbout(false)} />;
  }

  if (selectedModel && detailData) {
    return (
      <ModelDetailView 
        selectedModel={selectedModel} 
        detailData={detailData} 
        selectedCategory={selectedCategory} 
        onBack={() => setSelectedModel(null)}
        onAboutClick={() => { setShowAbout(true); setSelectedModel(null); }}
      />
    );
  }

  if (selectedCategory) {
    return (
      <CategoryView 
        selectedCategory={selectedCategory} 
        benchmarkData={benchmarkData} 
        onBack={() => setSelectedCategory(null)}
        onAboutClick={() => { setShowAbout(true); setSelectedCategory(null); }}
        onModelClick={setSelectedModel}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-text-secondary font-sans selection:bg-coral-mid/30">
      {/* Header */}
      <header className="bg-brand-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCategory(null)}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); setShowAbout(true); }} className="text-sm font-bold text-white/60 hover:text-brand-red transition-colors uppercase tracking-widest">About</a>
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
        {/* Top Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <TopMetricChart 
            title="CLAW SCORE" 
            subtitle="Percentage of all evaluations resolved in ClawBench; Higher is Better" 
            data={sortedBySuccess} 
            dataKey="successRate" 
            color="var(--color-accent-teal)"
            unit=""
            precision={1}
            onModelClick={setSelectedModel}
          />
          <TopMetricChart 
            title="SPEED" 
            subtitle="Time (s) to run all evaluations in the ClawBench; Lower is better" 
            data={sortedBySpeed} 
            dataKey="bestTime" 
            color="var(--color-brand-red)"
            unit="s"
            precision={0}
            onModelClick={setSelectedModel}
          />
          <TopMetricChart 
            title="COST" 
            subtitle="Cost (USD) to run all evaluations in the ClawBench; Lower is better" 
            data={sortedByCost} 
            dataKey="bestCost" 
            color="var(--color-accent-slate)"
            unit=""
            prefix="$"
            precision={2}
            onModelClick={setSelectedModel}
          />
        </div>

        {/* Top Stats & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 bg-bg-elevated border border-border-subtle p-1 rounded-xl shadow-sm">
              <button 
                className={cn("px-6 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer", activeView === 'leaderboard' ? "bg-white shadow-sm text-coral-bright" : "text-text-muted hover:text-text-primary")}
                onClick={() => setActiveView('leaderboard')}
              >
                Leaderboard
              </button>
              <button 
                className={cn("px-6 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer", activeView === 'graphs' ? "bg-white shadow-sm text-coral-bright" : "text-text-muted hover:text-text-primary")}
                onClick={() => setActiveView('graphs')}
              >
                Graphs
              </button>
            </div>
            
            <div className="h-8 w-px bg-border-subtle hidden md:block" />
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-coral-bright transition-colors" />
                <input 
                  type="text"
                  placeholder="Search models or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-coral-bright/20 focus:border-coral-bright transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 bg-white border border-border-subtle p-1 rounded-full shadow-sm overflow-x-auto max-w-full">
              <button 
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer whitespace-nowrap",
                  modelTypeFilter === 'all' ? "bg-brand-black text-white" : "text-text-muted hover:text-text-primary"
                )}
                onClick={() => setModelTypeFilter('all')}
              >
                All
              </button>
              <button 
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer whitespace-nowrap",
                  modelTypeFilter === 'open' ? "bg-brand-black text-white" : "text-text-muted hover:text-text-primary"
                )}
                onClick={() => setModelTypeFilter('open')}
              >
                Open Weights
              </button>
              <button 
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer whitespace-nowrap",
                  modelTypeFilter === 'proprietary' ? "bg-brand-black text-white" : "text-text-muted hover:text-text-primary"
                )}
                onClick={() => setModelTypeFilter('proprietary')}
              >
                Proprietary
              </button>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border-subtle" />
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Updated 03/23/2026</span>
          </div>
        </div>

        {/* Content Table or Graphs */}
        <div className="bg-white border border-border-subtle rounded-3xl shadow-xl mb-12 capture-container overflow-x-auto" id="leaderboard-content">
          {activeView === 'leaderboard' && (
            <div className="p-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between rounded-t-3xl relative z-10">
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
              <button 
                onClick={() => handleDownload('leaderboard-content', 'clawbench-leaderboard')}
                className="download-btn flex items-center justify-center bg-brand-black/60 backdrop-blur-sm text-white rounded-lg p-2.5 hover:bg-brand-red transition-all cursor-pointer shadow-lg shadow-brand-black/10"
                title="Download Image"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          )}

          {activeView === 'leaderboard' ? (
            <div className="bg-white rounded-b-3xl">
              <table className="w-full text-sm text-left min-w-[1000px] border-separate border-spacing-0">
                <thead>
                  <tr className="text-text-muted bg-bg-elevated/50 relative z-30">
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] border-b border-border-subtle">Model</th>
                    <th 
                      className="px-6 py-4 font-black uppercase tracking-widest text-[10px] cursor-pointer hover:text-coral-bright transition-colors group border-b border-border-subtle"
                      onClick={() => handleSort('successRate')}
                    >
                      <div className="flex items-center gap-1">
                        CLAW SCORE 
                        <HeaderTooltip text="Percentage of all evaluations resolved in ClawBench; Higher is Better" />
                        <SortIcon columnKey="successRate" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center cursor-pointer hover:text-coral-bright transition-colors group border-b border-border-subtle"
                      onClick={() => handleSort('bestTime')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Speed 
                        <HeaderTooltip text="Time (s) to run all evaluations in the ClawBench; Lower is better" />
                        <SortIcon columnKey="bestTime" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center cursor-pointer hover:text-coral-bright transition-colors group border-b border-border-subtle"
                      onClick={() => handleSort('bestCost')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Cost 
                        <HeaderTooltip text="Cost (USD) to run all evaluations in the ClawBench; Lower is better" />
                        <SortIcon columnKey="bestCost" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center cursor-pointer hover:text-coral-bright transition-colors group border-b border-border-subtle"
                      onClick={() => handleSort('valueScore')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Value 
                        <HeaderTooltip text="CLAW SCORE/COST; Higher is Better" />
                        <SortIcon columnKey="valueScore" />
                      </div>
                    </th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right border-b border-border-subtle">Report</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {(showAll ? filteredData : filteredData.slice(0, 20)).map((item) => (
                    <tr 
                      key={item.model} 
                      className="hover:bg-bg-elevated/50 transition-colors group cursor-pointer active:bg-transparent outline-none select-none"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                      onClick={() => setSelectedModel(item)}
                    >
                      <td className="px-6 py-4 border-b border-border-subtle relative">
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
                      <td className="px-6 py-4 border-b border-border-subtle">
                        <div className="flex items-center gap-4">
                          <div className="w-[240px] h-3 bg-bg-elevated rounded-full overflow-hidden border border-border-subtle/30 shadow-inner">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${item.successRate}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className="font-black text-text-primary w-12 text-right text-base">{item.successRate.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-text-secondary border-b border-border-subtle">
                        {item.bestTime ? `${item.bestTime.toFixed(0)}s` : '--'}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-text-secondary border-b border-border-subtle">
                        {item.bestCost === '--' ? '--' : (item.bestCost ? `$${(item.bestCost as number).toFixed(2)}` : '--')}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-text-secondary border-b border-border-subtle">
                        {item.valueScore === '--' ? '--' : (typeof item.valueScore === 'number' ? item.valueScore.toFixed(1) : '--')}
                      </td>
                      <td className="px-6 py-4 text-right border-b border-border-subtle">
                        <div className="text-coral-bright group-hover:text-coral-mid transition-colors flex items-center justify-end">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {!showAll && filteredData.length > 20 && (
                <div className="p-8 text-center border-t border-border-subtle">
                  <button 
                    onClick={() => setShowAll(true)}
                    className="px-8 py-3 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-red transition-all cursor-pointer shadow-lg shadow-brand-black/10 flex items-center gap-2 mx-auto"
                  >
                    <span>Show all ({filteredData.length - 20} more)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Branding Bottom */}
              <div className="branding-bottom p-8 bg-bg-deep border-t border-border-subtle text-center rounded-b-3xl">
                <div className="text-[10px] font-medium text-text-muted lowercase tracking-[0.2em]">
                  https://clawbenchlabs.com
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-bg-surface min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-start justify-start gap-6 mb-12">
                  <div className="flex flex-col gap-4 items-start">
                    <div className="flex items-center gap-2 bg-bg-deep p-1.5 rounded-xl border border-border-subtle shadow-inner">
                      <button 
                        className={cn("px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer", activeGraph === 'cost' ? "bg-white shadow-md text-text-primary" : "text-text-muted hover:text-text-primary")}
                        onClick={() => setActiveGraph('cost')}
                      >
                        CLAW SCORE vs. COST
                      </button>
                      <button 
                        className={cn("px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer", activeGraph === 'speed' ? "bg-white shadow-md text-text-primary" : "text-text-muted hover:text-text-primary")}
                        onClick={() => setActiveGraph('speed')}
                      >
                        CLAW SCORE vs. SPEED
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-border-subtle p-10 shadow-2xl shadow-brand-black/5 relative overflow-hidden capture-container" id="graph-container">
                  {/* Branding Top */}
                  <div className="branding-top p-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between -mx-10 -mt-10 mb-10 rounded-t-[2.5rem]">
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
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-text-primary tracking-tighter leading-none">ClawBench</span>
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 mb-8 border-b border-border-subtle pb-8 relative">
                      <div className="text-left flex-1">
                        <h3 className="text-3xl font-black text-text-primary uppercase tracking-tighter mb-1">
                          {activeGraph === 'cost' ? 'CLAW SCORE vs. COST' : 'CLAW SCORE vs. SPEED'}
                        </h3>
                        <div className="h-1 w-20 bg-brand-red mb-6" />
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-6">
                          {activeGraph === 'cost' 
                            ? 'CLAW SCORE; Cost to Run ClawBench' 
                            : 'CLAW SCORE; Time to Run ClawBench'}
                        </p>
                        
                        {/* Custom Legend */}
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                          {Array.from(new Set(filteredData.map(d => d.provider))).sort().map((provider) => {
                            const isSelected = selectedProviders.includes(provider);
                            const isHovered = hoveredProvider === provider;
                            const hasSelection = selectedProviders.length > 0;
                            const isDimmed = (hasSelection && !isSelected) || (hoveredProvider && !isHovered && !isSelected);

                            return (
                              <div 
                                key={provider} 
                                className={cn(
                                  "flex items-center gap-2 cursor-pointer transition-all duration-200",
                                  isDimmed ? "opacity-20 grayscale-[0.5]" : "opacity-100 scale-105"
                                )}
                                onMouseEnter={() => setHoveredProvider(provider)}
                                onMouseLeave={() => setHoveredProvider(null)}
                                onClick={() => {
                                  setSelectedProviders(prev => 
                                    prev.includes(provider) 
                                      ? prev.filter(p => p !== provider)
                                      : [...prev, provider]
                                  );
                                }}
                              >
                                <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: providerColors[provider] || '#00e5cc' }} />
                                <span className="text-[10px] font-black tracking-widest text-text-muted/80">{provider.replace('_', ' ')}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 flex flex-col items-end justify-start">
                        <button 
                          onClick={() => handleDownload('graph-container', `clawbench-graph-${activeGraph}`)}
                          className="download-btn flex items-center justify-center bg-brand-black/60 backdrop-blur-sm text-white rounded-xl p-3 hover:bg-brand-red transition-all cursor-pointer shadow-xl shadow-brand-black/10 group"
                          title="Download Image"
                        >
                          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                      </div>

                      {/* Logo aligned to the bottom right of the header, exactly on the line */}
                      <div className="absolute -bottom-2.5 right-0 bg-white pl-4 flex items-center gap-2 opacity-80">
                        <div className="relative h-5 w-5">
                          <Image 
                            src="/logo-transparent.png" 
                            alt="ClawBench Logo" 
                            fill
                            className="object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[12px] font-black text-text-primary tracking-tighter leading-none">ClawBench</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                      <div className="h-[650px] min-w-[800px] w-full bg-white relative">
                        {isMounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart key={`${activeGraph}-${renderTick}`} margin={{ top: 40, right: 100, bottom: 60, left: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={true} />
                            <XAxis 
                              type="number" 
                              dataKey={activeGraph === 'cost' ? 'bestCost' : 'bestTime'} 
                              name={activeGraph === 'cost' ? 'Cost' : 'Time'} 
                              stroke="#333"
                              tick={{ fill: '#666', fontSize: 11, fontWeight: 700 }}
                              tickLine={{ stroke: '#ddd' }}
                              axisLine={{ stroke: '#ddd' }}
                              tickFormatter={(value) => activeGraph === 'cost' ? `$${value.toFixed(2)}` : `${value.toFixed(0)}s`}
                              domain={['dataMin', 'dataMax']}
                              padding={{ left: 50, right: 50 }}
                            >
                            <Label 
                              value={activeGraph === 'cost' ? 'COST (USD)' : 'SPEED (SECONDS)'} 
                              offset={-40} 
                              position="insideBottom" 
                              fill="#000" 
                              style={{ fontWeight: 900, fontSize: 11, letterSpacing: '0.15em' }} 
                            />
                          </XAxis>
                          <YAxis 
                            type="number" 
                            dataKey="successRate" 
                            name="CLAW SCORE" 
                            stroke="#333"
                            tick={{ fill: '#666', fontSize: 11, fontWeight: 700 }}
                            tickLine={{ stroke: '#ddd' }}
                            axisLine={{ stroke: '#ddd' }}
                            domain={[50, 100]}
                          >
                            <Label 
                              value="CLAW SCORE" 
                              angle={-90} 
                              position="insideLeft" 
                              offset={-10}
                              fill="#000" 
                              style={{ fontWeight: 900, fontSize: 11, letterSpacing: '0.15em' }} 
                            />
                          </YAxis>
                          <ZAxis type="number" range={[200, 200]} />
                          <Tooltip 
                            isAnimationActive={false}
                            cursor={{ stroke: '#ddd', strokeWidth: 1, strokeDasharray: '5 5' }}
                            wrapperStyle={{ pointerEvents: 'none', zIndex: 100 }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-brand-black text-white p-5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl">
                                      <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white overflow-hidden p-1">
                                          {data.logo ? (
                                            <Image 
                                              src={data.logo} 
                                              alt={data.provider} 
                                              width={24} 
                                              height={24} 
                                              className="object-contain"
                                              referrerPolicy="no-referrer"
                                            />
                                          ) : (
                                            <span className="text-[10px] font-black uppercase text-brand-black">
                                              {data.provider[0]}
                                            </span>
                                          )}
                                        </div>
                                        <div>
                                          <p className="font-black text-sm tracking-tight">{data.model.split('/').pop()}</p>
                                          <p className="text-[10px] font-black tracking-widest text-white/50">{data.provider.replace('_', ' ')}</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">CLAW SCORE</p>
                                          <p className="text-xl font-black text-coral-bright">{data.successRate.toFixed(1)}</p>
                                        </div>
                                      <div>
                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">
                                          {activeGraph === 'cost' ? 'Cost' : 'Speed'}
                                        </p>
                                        <p className="text-xl font-black">
                                          {activeGraph === 'cost' ? (data.bestCost === '/' ? '/' : `$${(data.bestCost as number).toFixed(2)}`) : `${data.bestTime.toFixed(0)}s`}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <ReferenceArea x1={-10000} x2={xMid} y1={yMid} y2={150} fill="#10b981" fillOpacity={0.04} />
                          <ReferenceArea x1={xMid} x2={100000} y1={yMid} y2={150} fill="#3b82f6" fillOpacity={0.04} />
                          <ReferenceArea x1={-10000} x2={xMid} y1={-100} y2={yMid} fill="#f59e0b" fillOpacity={0.04} />
                          <ReferenceArea x1={xMid} x2={100000} y1={-100} y2={yMid} fill="#ef4444" fillOpacity={0.04} />
                          <ReferenceLine x={xMid} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" />
                          <ReferenceLine y={yMid} stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" />
                            <Scatter 
                              name="Models" 
                              data={filteredData.filter(d => activeGraph === 'cost' ? (d.bestCost !== null && d.bestCost !== undefined && d.bestCost !== '--') : (d.bestTime !== null && d.bestTime !== undefined))} 
                              isAnimationActive={false}
                              onClick={(data) => {
                                if (data && data.payload) {
                                  setSelectedModel(data.payload);
                                } else if (data) {
                                  setSelectedModel(data as any);
                                }
                              }}
                              shape={(props: any) => {
                                const { cx, cy, payload } = props;
                                if (!payload) return <g />;
                                
                                const isSelected = selectedProviders.includes(payload.provider);
                                const isHovered = hoveredProvider === payload.provider;
                                const hasSelection = selectedProviders.length > 0;
                                const isDimmed = (hasSelection && !isSelected) || (hoveredProvider && !isHovered && !isSelected);
                                
                                const fill = providerColors[payload.provider] || '#00e5cc';
                                return (
                                  <circle 
                                    cx={cx} 
                                    cy={cy} 
                                    r={isHovered || isSelected ? 12 : 8} 
                                    fill={fill} 
                                    opacity={isDimmed ? 0.2 : 1}
                                    className="filter drop-shadow-md cursor-pointer transition-all duration-300" 
                                    style={{ transition: 'r 0.3s, opacity 0.3s' }}
                                    onClick={() => setSelectedModel(payload)}
                                  />
                                );
                              }}
                            />
                            <Scatter 
                              name="Labels"
                              data={filteredData} 
                              shape={(props: any) => {
                                const { cx, cy, payload, index, offset } = props;
                                if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) return <g />;
                                
                                const name = payload.model ? payload.model.split('/').pop() : '';
                                
                                if (index === 0) {
                                  placedBoxesRef.current = [];
                                  if (lastGraphTypeRef.current !== activeGraph) {
                                    dotCacheRef.current = {};
                                    lastGraphTypeRef.current = activeGraph;
                                  }
                                }
                                
                                // Store dot position for collision avoidance in next render pass
                                dotCacheRef.current[name] = { x: cx, y: cy };
                                
                                const dotBoxes = Object.values(dotCacheRef.current).map(dot => ({
                                  left: dot.x - 15,
                                  right: dot.x + 15,
                                  top: dot.y - 15,
                                  bottom: dot.y + 15
                                }));
                                
                                const chartLeft = (props.xAxis?.x || offset?.left || 60) + 2;
                                const chartRight = (props.xAxis ? props.xAxis.x + props.xAxis.width : offset ? offset.left + offset.width : 800) - 2;
                                const chartTop = (props.yAxis?.y || offset?.top || 40) + 2;
                                const chartBottom = (props.yAxis ? props.yAxis.y + props.yAxis.height : offset ? offset.top + offset.height : 600) - 2;
                                
                                const textWidth = name.length * 6.5;
                                const textHeight = 12;
                                
                                const angles = [
                                  -Math.PI / 4, -Math.PI / 6, -Math.PI / 3,
                                  Math.PI / 4, Math.PI / 6, Math.PI / 3,
                                  -3 * Math.PI / 4, -5 * Math.PI / 6, -2 * Math.PI / 3,
                                  3 * Math.PI / 4, 5 * Math.PI / 6, 2 * Math.PI / 3,
                                  -Math.PI / 2, Math.PI / 2, 0, Math.PI,
                                  -Math.PI / 8, Math.PI / 8, -7 * Math.PI / 8, 7 * Math.PI / 8,
                                  -3 * Math.PI / 8, 3 * Math.PI / 8, -5 * Math.PI / 8, 5 * Math.PI / 8
                                ];
                                const distances = [25, 40, 60, 80, 100, 130, 160, 200, 250, 300];
                                
                                let bestPos = null;
                                let fallbackPos = null;
                                
                                for (const d of distances) {
                                  for (const angle of angles) {
                                    const isLeft = Math.cos(angle) < -0.1;
                                    const isCenter = Math.abs(Math.cos(angle)) <= 0.1;
                                    
                                    let textAnchor = "start";
                                    if (isLeft) textAnchor = "end";
                                    if (isCenter) textAnchor = "middle";
                                    
                                    const lineEndX = cx + Math.cos(angle) * d;
                                    const lineEndY = cy + Math.sin(angle) * d;
                                    
                                    let textX = lineEndX + (isLeft ? -4 : (isCenter ? 0 : 4));
                                    const textY = lineEndY + (Math.sin(angle) > 0 ? 4 : -4);
                                    
                                    let left = textX;
                                    let right = textX + textWidth;
                                    if (isLeft) {
                                      left = textX - textWidth;
                                      right = textX;
                                    } else if (isCenter) {
                                      left = textX - textWidth / 2;
                                      right = textX + textWidth / 2;
                                    }
                                    
                                    const top = textY - textHeight + 2;
                                    const bottom = textY + 4;
                                    
                                    const isOutside = left < chartLeft || right > chartRight || top < chartTop || bottom > chartBottom;
                                    
                                    if (!fallbackPos && !isOutside) {
                                      fallbackPos = { angle, d, textX, textY, textAnchor, lineEndX, lineEndY, left, right, top, bottom };
                                    }
                                    
                                    if (isOutside) continue;
                                    
                                    const hasCollision = placedBoxesRef.current.some(box => {
                                      return !(right < box.left || 
                                               left > box.right || 
                                               bottom < box.top || 
                                               top > box.bottom);
                                    }) || dotBoxes.some(box => {
                                      return !(right < box.left || 
                                               left > box.right || 
                                               bottom < box.top || 
                                               top > box.bottom);
                                    });
                                    
                                    if (!hasCollision) {
                                      bestPos = { angle, d, textX, textY, textAnchor, lineEndX, lineEndY, left, right, top, bottom };
                                      break;
                                    }
                                  }
                                  if (bestPos) break;
                                }
                                
                                if (!bestPos) {
                                  if (fallbackPos) {
                                    bestPos = fallbackPos;
                                  } else {
                                    const angle = angles[0];
                                    const d = distances[0];
                                    const isLeft = Math.cos(angle) < 0;
                                    const lineEndX = cx + Math.cos(angle) * d;
                                    const lineEndY = cy + Math.sin(angle) * d;
                                    
                                    let textX = lineEndX + (isLeft ? -4 : 4);
                                    let textY = lineEndY + (Math.sin(angle) > 0 ? 4 : -4);
                                    
                                    let left = isLeft ? textX - textWidth : textX;
                                    let right = isLeft ? textX : textX + textWidth;
                                    let top = textY - textHeight + 2;
                                    let bottom = textY + 4;
                                    
                                    if (left < chartLeft) {
                                      const shift = chartLeft - left;
                                      textX += shift; left += shift; right += shift;
                                    }
                                    if (right > chartRight) {
                                      const shift = right - chartRight;
                                      textX -= shift; left -= shift; right -= shift;
                                    }
                                    if (top < chartTop) {
                                      const shift = chartTop - top;
                                      textY += shift; top += shift; bottom += shift;
                                    }
                                    if (bottom > chartBottom) {
                                      const shift = bottom - chartBottom;
                                      textY -= shift; top -= shift; bottom -= shift;
                                    }
                                    
                                    bestPos = {
                                      angle, d, textX, textY, textAnchor: isLeft ? "end" : "start",
                                      lineEndX, lineEndY, left, right, top, bottom
                                    };
                                  }
                                }
                                
                                if (!bestPos || !props.payload) return <g />;
                                
                                const isSelected = selectedProviders.includes(props.payload.provider);
                                const isHovered = hoveredProvider === props.payload.provider;
                                const hasSelection = selectedProviders.length > 0;
                                const isDimmed = (hasSelection && !isSelected) || (hoveredProvider && !isHovered && !isSelected);
                                
                                placedBoxesRef.current.push({
                                  left: bestPos.left - 4,
                                  right: bestPos.right + 4,
                                  top: bestPos.top - 4,
                                  bottom: bestPos.bottom + 4
                                });
                                
                                const r = isHovered || isSelected ? 12 : 8;
                                const lineStartX = cx + Math.cos(bestPos.angle) * r;
                                const lineStartY = cy + Math.sin(bestPos.angle) * r;
                                
                                return (
                                  <g className={cn("pointer-events-none transition-all duration-300", isDimmed ? "opacity-20" : "opacity-100")}>
                                    <line 
                                      x1={lineStartX} 
                                      y1={lineStartY} 
                                      x2={bestPos.lineEndX} 
                                      y2={bestPos.lineEndY} 
                                      stroke="#9ca3af" 
                                      strokeWidth={1} 
                                      strokeDasharray="2 2"
                                    />
                                    <text 
                                      x={bestPos.textX} 
                                      y={bestPos.textY} 
                                      fill="#6b7280" 
                                      fontSize={10} 
                                      fontWeight={500} 
                                      textAnchor={bestPos.textAnchor as any}
                                      className="tracking-tighter"
                                      style={{ 
                                        paintOrder: 'stroke', 
                                        stroke: '#fff', 
                                        strokeWidth: 2, 
                                        strokeLinecap: 'round', 
                                        strokeLinejoin: 'round' 
                                      }}
                                    >
                                      {name}
                                    </text>
                                  </g>
                                );
                              }}
                            />
                          </ScatterChart>
                      </ResponsiveContainer>
                      )}
                    </div>
                    </div>
                  </div>
                  {/* Branding Bottom */}
                  <div className="branding-bottom p-8 bg-bg-deep border-t border-border-subtle text-center -mx-10 -mb-10 mt-10 rounded-b-[2.5rem]">
                    <div className="text-[10px] font-medium text-text-muted lowercase tracking-[0.2em]">
                      https://clawbenchlabs.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-24">
          <DimensionsView benchmarkData={baseData} onModelClick={setSelectedModel} onDownload={handleDownload} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bg-surface border-t border-border-subtle py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
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
                <span className="text-lg font-black text-text-primary tracking-tighter leading-none">ClawBench</span>
                <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-1 leading-none">LLM Agent Benchmark</span>
              </div>
            </div>
            <div className="text-text-muted text-sm font-medium">
              © 2026 ClawBench. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowAbout(true); }} className="text-text-muted hover:text-text-primary transition-colors text-sm font-bold uppercase tracking-widest">About</a>
              <a href="https://github.com/clawbench" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
