import React, { useState } from 'react';
import { Navbar } from './components/hub/Navbar';
import { MarketingView } from './components/hub/MarketingView';
import { DashboardView } from './components/hub/DashboardView';
import { ModuleFactoryView } from './components/factory/ModuleFactoryView';
import { ApiContractTester } from './components/contracts/ApiContractTester';

export default function App() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'dashboard' | 'factory' | 'contracts'>('dashboard');
  const [factoryModule, setFactoryModule] = useState<string>('finance');

  const handleNavigateToFactory = (mod?: string) => {
    if (mod) {
      setFactoryModule(mod);
    }
    setActiveTab('factory');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 3-Zone Top Bar Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickGenerate={() => handleNavigateToFactory('finance')}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'marketing' && (
          <MarketingView
            onNavigateToViewer={() => setActiveTab('dashboard')}
            onNavigateToFactory={handleNavigateToFactory}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateToFactory={handleNavigateToFactory}
          />
        )}

        {activeTab === 'factory' && (
          <ModuleFactoryView
            initialModule={factoryModule}
            onNavigateToViewer={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'contracts' && (
          <ApiContractTester />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Founder Legal Stack (FLS) · Modular Architecture & Meta-Agent App Factory
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Ecosystem Viewer
            </button>
            <button
              onClick={() => handleNavigateToFactory('finance')}
              className="hover:text-slate-900 transition-colors"
            >
              Finance Module
            </button>
            <button
              onClick={() => handleNavigateToFactory('export')}
              className="hover:text-slate-900 transition-colors"
            >
              Export Module
            </button>
            <button
              onClick={() => handleNavigateToFactory('digest')}
              className="hover:text-slate-900 transition-colors"
            >
              Digest Module
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className="hover:text-slate-900 transition-colors"
            >
              API Contracts
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
