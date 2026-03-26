"use client";

import React from 'react';
import { Info } from 'lucide-react';

export const HeaderTooltip = ({ text }: { text: string }) => (
  <div className="relative group/tooltip flex items-center" onClick={(e) => e.stopPropagation()}>
    <Info className="w-3 h-3 text-text-muted hover:text-text-primary transition-colors cursor-pointer" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-brand-black text-white text-xs leading-relaxed rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 font-medium normal-case tracking-normal text-center pointer-events-none shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-black"></div>
    </div>
  </div>
);
