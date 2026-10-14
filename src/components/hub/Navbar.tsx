import React from 'react';
import { LogoFls } from '../common/SvgGraphics';

interface NavbarProps {
  activeTab: 'marketing' | 'dashboard' | 'factory' | 'contracts';
  onSelectTab: (tab: 'marketing' | 'dashboard' | 'factory' | 'contracts') => void;
  onOpenQuickGenerate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickGenerate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => onSelectTab('marketing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
        >
          <LogoFls className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            FLS Modular Factory
          </span>
        </button>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('marketing')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'marketing'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 py-5 -mb-[2px]'
                : 'hover:text-slate-900'
            }`}
          >
            Overview & Waitlist
          </button>
          
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 py-5 -mb-[2px]'
                : 'hover:text-slate-900'
            }`}
          >
            Ecosystem Viewer
          </button>

          <button
            onClick={() => onSelectTab('factory')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'factory'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 py-5 -mb-[2px]'
                : 'hover:text-slate-900'
            }`}
          >
            Module Code Factory
          </button>

          <button
            onClick={() => onSelectTab('contracts')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'contracts'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 py-5 -mb-[2px]'
                : 'hover:text-slate-900'
            }`}
          >
            API Contracts & Peers
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onOpenQuickGenerate) {
                onOpenQuickGenerate();
              } else {
                onSelectTab('factory');
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Generate Modules
          </button>
        </div>

      </div>
    </header>
  );
};
