import React, { useState } from 'react';
import JSZip from 'jszip';
import { ALL_MODULES } from '../../data/modulesCodebase';
import { GeneratedModule, ModuleType } from '../../types';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  FileText,
  Package,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ModuleFactoryViewProps {
  initialModule?: string;
  onNavigateToViewer: () => void;
}

export const ModuleFactoryView: React.FC<ModuleFactoryViewProps> = ({
  initialModule = 'finance',
  onNavigateToViewer
}) => {
  const [selectedModuleKey, setSelectedModuleKey] = useState<ModuleType>(
    (initialModule as ModuleType) in ALL_MODULES ? (initialModule as ModuleType) : 'finance'
  );
  const [activeTab, setActiveTab] = useState<'code' | 'schema' | 'deps' | 'readme' | 'checklist'>('code');
  const [activeFilePath, setActiveFilePath] = useState<string>('app/api/public/summary/route.ts');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const mod: GeneratedModule = ALL_MODULES[selectedModuleKey] || ALL_MODULES.finance;

  // Make sure active file exists in current module
  const currentFile = mod.files.find(f => f.path === activeFilePath) || mod.files[0];

  const handleCopyCurrentFile = () => {
    let text = '';
    if (activeTab === 'code') text = currentFile?.content || '';
    else if (activeTab === 'schema') text = mod.sqlSchema;
    else if (activeTab === 'deps') text = `// package.json\n${mod.packageJson}\n\n// .env.example\n${mod.envExample}`;
    else if (activeTab === 'readme') text = mod.readme;
    else if (activeTab === 'checklist') text = mod.deploymentChecklist.map((c, i) => `${i + 1}. ${c}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAllFiles = () => {
    let fullBundle = `=== MODULE: ${mod.title} ===\n`;
    fullBundle += `PORT: ${mod.port}\n`;
    fullBundle += `ENV VAR: ${mod.envVar}\n\n`;
    fullBundle += `--- package.json ---\n${mod.packageJson}\n\n`;
    fullBundle += `--- .env.example ---\n${mod.envExample}\n\n`;
    fullBundle += `--- README.md ---\n${mod.readme}\n\n`;
    fullBundle += `--- schema.sql ---\n${mod.sqlSchema}\n\n`;

    mod.files.forEach(f => {
      fullBundle += `--- ${f.path} ---\n${f.content}\n\n`;
    });

    navigator.clipboard.writeText(fullBundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `fls-${mod.id}`;
      const root = zip.folder(folderName);

      if (root) {
        root.file('package.json', mod.packageJson);
        root.file('.env.example', mod.envExample);
        root.file('README.md', mod.readme);
        root.file('schema.sql', mod.sqlSchema);

        mod.files.forEach(f => {
          root.file(f.path, f.content);
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${folderName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Studio Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider mb-1">
            Meta-Agent Factory Studio
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Modular Standalone App Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Pick a module below to inspect its complete file tree, copy production-grade Next.js 14 App Router code, or download a full runnable ZIP package.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAllFiles}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'Bundle Copied!' : 'Copy Entire App'}
          </button>
          
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isZipping ? 'Creating ZIP…' : zipSuccess ? 'Downloaded!' : `Download fls-${mod.id}.zip`}
          </button>
        </div>
      </div>

      {/* Module Selector Pill Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(ALL_MODULES) as ModuleType[]).map(key => {
          const item = ALL_MODULES[key];
          const isSelected = selectedModuleKey === key;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedModuleKey(key);
                setActiveFilePath(item.files[0]?.path || '');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="uppercase">{item.id}</span>
              <span className="text-[10px] opacity-75 font-mono">Port :{item.port}</span>
            </button>
          );
        })}
      </div>

      {/* Module Specs Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">{mod.title}</h2>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5 rounded">
              {mod.summaryApi}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div>
            <span className="text-slate-400">Peer Env: </span>
            <span className="text-sky-300 font-bold">{mod.envVar}</span>
          </div>
          <div>
            <span className="text-slate-400">Port: </span>
            <span className="text-emerald-400 font-bold">:{mod.port}</span>
          </div>
        </div>
      </div>

      {/* Main Studio View: Left File Tree & Tabs, Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: File Tree & Aspect Navigation */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Aspect tabs */}
          <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
            <button
              onClick={() => setActiveTab('code')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === 'code' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileCode className="w-4 h-4 text-sky-600" />
              Source Code ({mod.files.length} files)
            </button>

            <button
              onClick={() => setActiveTab('schema')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === 'schema' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              Supabase SQL Schema
            </button>

            <button
              onClick={() => setActiveTab('deps')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === 'deps' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4 text-amber-600" />
              package.json & .env
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === 'readme' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              README & Vercel Guide
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === 'checklist' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-rose-600" />
              Deployment Checklist
            </button>
          </div>

          {/* If code tab is selected, show file tree */}
          {activeTab === 'code' && (
            <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2">
                Files in fls-{mod.id}
              </div>
              <div className="space-y-1">
                {mod.files.map(f => (
                  <button
                    key={f.path}
                    onClick={() => setActiveFilePath(f.path)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono truncate transition-colors ${
                      currentFile?.path === f.path
                        ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    title={f.path}
                  >
                    {f.path}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Deploy One-Liner Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-sky-400 font-mono">
              <Terminal className="w-3.5 h-3.5" />
              Vercel Deploy One-Liner
            </div>
            <code className="block bg-slate-950 p-2.5 rounded font-mono text-xs text-emerald-400 select-all">
              cd fls-{mod.id} && vercel --prod
            </code>
          </div>

        </div>

        {/* Right Column: Code Studio Viewer */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          
          {/* Code Viewer Header */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-800">
                {activeTab === 'code' && currentFile?.path}
                {activeTab === 'schema' && 'schema.sql (Supabase Tables & Indexes)'}
                {activeTab === 'deps' && 'package.json & .env.example'}
                {activeTab === 'readme' && 'README.md'}
                {activeTab === 'checklist' && 'DEPLOYMENT_CHECKLIST.md'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeTab === 'code' ? `${currentFile?.language}` : 'config'}
              </span>
            </div>

            <button
              onClick={handleCopyCurrentFile}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFile ? 'Copied' : 'Copy File'}
            </button>
          </div>

          {/* Code Content Box */}
          <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed max-h-[580px] overflow-y-auto overflow-x-auto">
            {activeTab === 'code' && (
              <pre className="whitespace-pre">{currentFile?.content}</pre>
            )}

            {activeTab === 'schema' && (
              <pre className="whitespace-pre text-emerald-300">{mod.sqlSchema}</pre>
            )}

            {activeTab === 'deps' && (
              <div className="space-y-6">
                <div>
                  <div className="text-sky-400 text-[11px] mb-1 font-bold">// package.json</div>
                  <pre className="whitespace-pre text-slate-200">{mod.packageJson}</pre>
                </div>
                <div>
                  <div className="text-amber-400 text-[11px] mb-1 font-bold">// .env.example</div>
                  <pre className="whitespace-pre text-slate-200">{mod.envExample}</pre>
                </div>
              </div>
            )}

            {activeTab === 'readme' && (
              <pre className="whitespace-pre text-slate-200 font-sans text-xs">{mod.readme}</pre>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-3 font-sans text-xs text-slate-200">
                <div className="font-bold text-sm text-sky-400">Step-by-Step Production Checklist</div>
                <ol className="space-y-2 list-decimal list-inside">
                  {mod.deploymentChecklist.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Code Viewer Footer */}
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>Next step: </span>
              <span className="text-slate-800 font-medium">
                {selectedModuleKey === 'finance' && "Deploy this. Then generate EXPORT when ready."}
                {selectedModuleKey === 'export' && "Deploy this. Then generate DIGEST when ready."}
                {selectedModuleKey === 'digest' && "Deploy this. Then plug URLs into FLS Hub."}
                {selectedModuleKey === 'hub' && "Deploy this. Then view all 3 modules on your dashboard."}
              </span>
            </div>

            <button
              onClick={onNavigateToViewer}
              className="text-slate-900 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Test in Ecosystem Viewer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
