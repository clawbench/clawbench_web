import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Brain, Info, Download } from 'lucide-react';
import { type BenchmarkData } from '@/lib/data';
import { getModelDetail } from '@/lib/detailData';
import Image from 'next/image';

interface DimensionsViewProps {
  benchmarkData: BenchmarkData[];
  onModelClick: (model: BenchmarkData) => void;
  onDownload: (id: string, name: string) => void;
}

const CATEGORIES = [
  "Office Collaboration",
  "Information Retrieval and Research",
  "Content Creation",
  "Data Processing and Analysis",
  "Software Engineering"
];

export function DimensionsView({ benchmarkData, onModelClick, onDownload }: DimensionsViewProps) {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);

  const chartData = useMemo(() => {
    return benchmarkData.map(model => {
      const detail = getModelDetail(model.model, model.provider, model.successRate);
      
      let score = 0;
      const cat = detail.categories.find(c => c.name === activeTab);
      score = cat ? cat.score : 0;

      return {
        ...model,
        score: Math.round(score),
      };
    }).sort((a, b) => b.score - a.score);
  }, [benchmarkData, activeTab]);

  return (
    <div className="mb-12 border-t border-border-subtle pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
          Multidimensional Analysis
        </h2>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 p-1 rounded-xl flex flex-wrap gap-1 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-1 min-w-[150px] text-center py-3 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === cat 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-border-subtle rounded-3xl shadow-xl capture-container" id="dimensions-card">
        {/* Branding Top */}
        <div className="branding-top p-8 bg-bg-surface border-b border-border-subtle flex items-center justify-between rounded-t-3xl relative z-10">
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
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-tight">Multidimensional Analysis: {activeTab}</h2>
          </div>
        </div>

        <div className="p-6 relative">
          {/* Download Button in top right of card content */}
          <div className="absolute top-2 right-6 z-20">
            <button 
              onClick={() => onDownload('dimensions-card', `dimensions-${activeTab.toLowerCase().replace(/ /g, '-')}`)}
              className="download-btn flex items-center justify-center bg-brand-black/60 backdrop-blur-sm text-white rounded-lg p-2.5 hover:bg-brand-red transition-all cursor-pointer shadow-lg shadow-brand-black/10"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>

          {/* Chart Area */}
          <div className="relative mt-4 pb-4">
            {/* Dynamic Category Title */}
            <h3 className="text-xl font-bold text-text-primary tracking-tight mb-8">
              {activeTab}
            </h3>
            
            <div className="relative">
              {/* Y-axis grid lines */}
              <div className="absolute top-0 left-0 right-0 h-[180px] flex flex-col justify-between pointer-events-none z-0">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full border-t border-gray-100 h-0" />
                ))}
              </div>

              {/* Bars */}
              <div className="relative h-[180px] flex items-end justify-between px-2 z-10 gap-[2px]">
                {chartData.map((item, index) => {
                  const heightPercentage = Math.max((item.score / 100) * 100, 5);
                  
                  return (
                    <div key={item.model} className="flex-1 flex flex-col items-center group h-full justify-end min-w-0">
                      {/* Score above bar */}
                      <span className="text-gray-700 font-bold text-[9px] mb-1">{item.score}</span>
                      
                      {/* Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.01 }}
                        className="w-full max-w-[16px] rounded-t-sm relative transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ backgroundColor: item.color || '#cbd5e1' }}
                        onClick={() => onModelClick(item)}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="relative flex justify-between px-2 mt-4 z-10 gap-[2px]">
                {chartData.map((item) => (
                  <div key={item.model} className="flex-1 flex flex-col items-center min-w-0 cursor-pointer" onClick={() => onModelClick(item)}>
                    {item.logo && (
                      <div className="w-3 h-3 relative mb-2 shrink-0">
                        <Image 
                          src={item.logo} 
                          alt={item.provider} 
                          fill 
                          className="object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div className="relative w-full h-20 mt-1">
                      <span 
                        className="absolute top-0 right-1/2 text-[8px] font-medium text-gray-500 whitespace-nowrap pr-1"
                        style={{ transform: 'rotate(-60deg)', transformOrigin: 'top right' }}
                      >
                        {item.model.split('/').pop()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>ClawBench Multidimensional Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image 
                  src="/logo-transparent.png" 
                  alt="ClawBench Logo" 
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-gray-900">ClawBench</span>
            </div>
          </div>
        </div>

        {/* Branding Bottom */}
        <div className="branding-bottom p-8 bg-bg-deep border-t border-border-subtle text-center rounded-b-3xl">
          <div className="text-[10px] font-medium text-text-muted lowercase tracking-[0.2em]">
            https://clawbenchlabs.com
          </div>
        </div>
      </div>
    </div>
  );
}
