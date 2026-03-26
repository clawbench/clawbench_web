"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Activity, GraduationCap, CircleDollarSign } from 'lucide-react';
import { BenchmarkData } from '@/lib/data';

interface TopMetricChartProps {
  title: string;
  subtitle: string;
  data: BenchmarkData[];
  dataKey: keyof BenchmarkData;
  color: string;
  unit?: string;
  prefix?: string;
  precision?: number;
  transform?: (val: number) => number;
  onModelClick?: (model: BenchmarkData) => void;
  onTitleClick?: () => void;
}

export const TopMetricChart = React.memo(({ 
  title, 
  subtitle, 
  data, 
  dataKey, 
  color, 
  unit = '', 
  prefix = '',
  precision,
  transform,
  onModelClick,
  onTitleClick,
}: TopMetricChartProps) => {
  const chartData = data.slice(0, 10).map(item => ({
    ...item,
    displayVal: item[dataKey] as number,
    chartVal: transform ? transform(item[dataKey] as number) : (item[dataKey] as number)
  }));

  const maxVal = Math.max(...chartData.map(d => d.chartVal));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group bg-white border border-border-subtle rounded-2xl p-6 flex flex-col h-full transition-all overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-black/5"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 group/title">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-border-subtle bg-bg-surface group-hover/title:bg-brand-red group-hover/title:text-white transition-all duration-300">
              {title === 'CLAW SCORE' ? (
                <GraduationCap className="w-5 h-5" />
              ) : title === 'COST' ? (
                <CircleDollarSign className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-primary leading-none mb-1.5 group-hover/title:text-brand-red transition-colors">{title}</h3>
              <p className="text-[9px] text-text-muted font-medium tracking-wide">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {chartData.map((item, i) => (
            <div 
              key={i} 
              className="group/item cursor-pointer"
              onClick={() => onModelClick?.(item)}
            >
              <div className="flex justify-between items-center text-[10px] font-bold tracking-tight mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] text-text-muted/40 font-black w-4">{(i + 1).toString().padStart(2, '0')}</span>
                  {item.logo ? (
                    <div className="w-4 h-4 relative flex-shrink-0">
                      <Image 
                        src={item.logo} 
                        alt={`${item.provider} logo`} 
                        fill
                        className="object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-sm flex items-center justify-center bg-bg-deep border border-border-subtle flex-shrink-0">
                      <span className="text-[8px] font-black uppercase" style={{ color: item.color }}>
                        {item.provider[0]}
                      </span>
                    </div>
                  )}
                  <span className="truncate max-w-[140px] text-text-secondary group-hover/item:text-brand-red transition-colors">{item.model.split('/').pop()}</span>
                </div>
                <span className="text-text-primary font-black tabular-nums">{prefix}{precision !== undefined ? item.chartVal.toFixed(precision) : (transform ? transform(item.chartVal) : item.chartVal.toFixed(item.chartVal < 1 ? 2 : 0))}{unit}</span>
              </div>
              <div className="h-1 w-full bg-bg-elevated rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.chartVal / maxVal) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color || color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

TopMetricChart.displayName = 'TopMetricChart';
