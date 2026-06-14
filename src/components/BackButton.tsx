'use client';
 
import React, { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
 
export default function BackButton() {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { goBack, currentPage, isScrollingDown } = context;
 
  const showHeader = !['login', 'admin'].includes(currentPage);
  const mobileStickyClass = showHeader 
    ? (isScrollingDown ? 'top-[90px]' : 'top-[118px]') 
    : 'top-0';
 
  return (
    <>
      {/* Mobile Sticky Sub-bar: clean placement, zero content overlap */}
      <div className={`sticky ${mobileStickyClass} z-35 w-full bg-bg-cream/95 backdrop-blur-md border-b border-border-lumi/30 px-4 flex items-center transition-all duration-300 md:hidden ${
        isScrollingDown ? 'py-1.5' : 'py-2.5'
      }`}>
        <button 
          onClick={goBack}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-border-lumi bg-white hover:text-primary rounded-full shadow-[0_2px_8px_rgba(107,83,76,0.06)] active:scale-95 text-[10px] font-bold uppercase tracking-widest text-text-medium transition-all duration-300 cursor-pointer select-none"
          aria-label="Go Back"
        >
          <ArrowLeft size={11} className="stroke-[2.5]" />
          <span>Back</span>
        </button>
      </div>
 
      {/* Desktop Fixed Button: aligned with margins, no overlap with search or navbar */}
      <button 
        onClick={goBack}
        className="hidden md:inline-flex md:fixed md:z-40 md:top-24 md:left-6 lg:left-8 xl:left-[calc((100vw-1280px)/2+24px)] items-center justify-center gap-1.5 px-4 py-2.5 border border-border-lumi bg-white/90 backdrop-blur-md hover:border-primary-light hover:text-primary rounded-full shadow-[0_4px_12px_rgba(107,83,76,0.08)] hover:shadow-[0_6px_20px_rgba(107,83,76,0.15)] text-[10px] font-bold uppercase tracking-widest text-text-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
        aria-label="Go Back"
      >
        <ArrowLeft size={11} className="stroke-[2.5]" />
        <span>Back</span>
      </button>
    </>
  );
}
