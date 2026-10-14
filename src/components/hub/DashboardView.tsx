import React, { useState, useEffect } from 'react';
import { ModuleCard } from './ModuleCard';
import { ModuleDetailModal } from './ModuleDetailModal';
import { PeerSummary } from '../../types';
import { DEMO_COMPANIES } from '../../data/mockData';
import { RefreshCw, Sliders, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  onNavigateToFactory: (moduleId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToFactory }) => {
  const [companyId, setCompanyId] = useState('demo-company');
  const [customInput, setCustomInput] = useState('demo-company');
  const [activeInspector, setActiveInspector] = useState<'finance' | 'export' | 'digest' | 'hub' | null>(null);
  const [peerMode, setPeerMode] = useState<'simulated' | 'remote'>('simulated');
  const [showConfig, setShowConfig] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Peer configuration
  const [financeUrl, setFinanceUrl] = useState(() => localStorage.getItem('FLS_FINANCE_URL') || '');
  const [exportUrl, setExportUrl] = useState(() => localStorage.getItem('FLS_EXPORT_URL') || '');
  const [digestUrl, setDigestUrl] = useState(() => localStorage.getItem('FLS_DIGEST_URL') || '');
  const [sharedSecret, setSharedSecret] = useState(() => localStorage.getItem('FLS_SHARED_SECRET') || 'fls_super_secret_enterprise_token_2026');

  // Peer summaries state
  const [modules, setModules] = useState<PeerSummary[]>([]);

  const activeCompany = DEMO_COMPANIES[companyId] || {
    id: companyId,
    name: `${companyId.charAt(0).toUpperCase() + companyId.slice(1)} Corp.`,
    incorporationDate: '2025-06-01',
    jurisdiction: 'Delaware C-Corp',
    cleanBooksScore: 91,
    flaggedCount: 2,
    txnCount: 95,
    readinessScore: 84,
    lastExportDate: 'Oct 10, 2026',
    lastDigestSent: 'Monday 08:00 AM',
    deltaSummary: '+3% separation',
    sha256Hash: '4a6b2979e39049a46399e525143a51f68132049d'
  };

  const loadModuleData = React.useCallback(async () => {
    setIsRefreshing(true);

    if (peerMode === 'simulated') {
      // Simulate healthy peer responses with realistic random latency
      await new Promise(r => setTimeout(r, 250));
      const simulatedSummaries: PeerSummary[] = [
        {
          module: 'finance',
          ok: true,
          latencyMs: Math.floor(Math.random() * 25) + 18,
          data: {
            cleanBooksScore: `${activeCompany.cleanBooksScore}%`,
            flagged: activeCompany.flaggedCount,
            txnCount: activeCompany.txnCount,
            peerUrl: financeUrl || 'http://localhost:3001'
          }
        },
        {
          module: 'export',
          ok: true,
          latencyMs: Math.floor(Math.random() * 30) + 24,
          data: {
            readiness: `${activeCompany.readinessScore}%`,
            lastGenerated: activeCompany.lastExportDate,
            downloadUrl: '#download-packet',
            sha256: activeCompany.sha256Hash,
            peerUrl: exportUrl || 'http://localhost:3002'
          }
        },
        {
          module: 'digest',
          ok: true,
          latencyMs: Math.floor(Math.random() * 20) + 15,
          data: {
            lastSent: activeCompany.lastDigestSent,
            delta: activeCompany.deltaSummary,
            peerUrl: digestUrl || 'http://localhost:3003'
          }
        }
      ];
      setModules(simulatedSummaries);
      setIsRefreshing(false);
      setRefreshCountdown(30);
      return;
    }

    // Remote Peer Mode: Query real configured URLs
    const queryPeer = async (mod: 'finance' | 'export' | 'digest', url: string, endpoint: string): Promise<PeerSummary> => {
      if (!url) {
        return { module: mod, ok: false, latencyMs: 0, error: 'not configured' };
      }
      const start = Date.now();
      try {
        const res = await fetch(`${url}${endpoint}?company_id=${companyId}`, {
          headers: { 'X-FLS-Shared-Secret': sharedSecret },
          signal: AbortSignal.timeout(3500)
        });
        const data = await res.json();
        return {
          module: mod,
          ok: res.ok,
          latencyMs: Date.now() - start,
          data: res.ok ? data : undefined,
          error: !res.ok ? data?.error || 'HTTP request failed' : undefined
        };
      } catch (err: unknown) {
        return {
          module: mod,
          ok: false,
          latencyMs: Date.now() - start,
          error: (err as Error)?.message || 'Failed to connect to peer URL'
        };
      }
    };

    const results = await Promise.all([
      queryPeer('finance', financeUrl, '/api/public/summary'),
      queryPeer('export', exportUrl, '/api/public/latest'),
      queryPeer('digest', digestUrl, '/api/public/summary')
    ]);

    setModules(results);
    setIsRefreshing(false);
    setRefreshCountdown(30);
  }, [peerMode, activeCompany, financeUrl, exportUrl, digestUrl, sharedSecret, companyId]);

  // Polling every 30s
  useEffect(() => {
    loadModuleData();
    const interval = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          loadModuleData();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loadModuleData]);

  const handleSaveConfig = () => {
    localStorage.setItem('FLS_FINANCE_URL', financeUrl);
    localStorage.setItem('FLS_EXPORT_URL', exportUrl);
    localStorage.setItem('FLS_DIGEST_URL', digestUrl);
    localStorage.setItem('FLS_SHARED_SECRET', sharedSecret);
    setShowConfig(false);
    loadModuleData();
  };

  const handleSelectPreset = (id: string) => {
    setCompanyId(id);
    setCustomInput(id);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setCompanyId(customInput.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      
      {/* Top Controls: Title, Company Picker, Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              FLS Ecosystem Viewer
            </h1>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              3 Modules Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Federated micro-apps queried via HTTPS public contracts. Auto-refreshes in <span className="font-mono text-slate-800">{refreshCountdown}s</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Peer Mode Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPeerMode('simulated')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                peerMode === 'simulated'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulated Sandbox
            </button>
            <button
              onClick={() => setPeerMode('remote')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                peerMode === 'remote'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Remote Peer URLs
            </button>
          </div>

          <button
            onClick={() => loadModuleData()}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Ping Peers Now"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            Config URLs
          </button>
        </div>
      </div>

      {/* Peer Configuration Drawer */}
      {showConfig && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Module Peer URLs & Shared Secret</h3>
            <span className="text-xs text-slate-500 font-mono">Peer Contract Auth</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">FLS_FINANCE_URL</label>
              <input
                type="text"
                placeholder="https://fls-finance.vercel.app"
                value={financeUrl}
                onChange={e => setFinanceUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">FLS_EXPORT_URL</label>
              <input
                type="text"
                placeholder="https://fls-export.vercel.app"
                value={exportUrl}
                onChange={e => setExportUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">FLS_DIGEST_URL</label>
              <input
                type="text"
                placeholder="https://fls-digest.vercel.app"
                value={digestUrl}
                onChange={e => setDigestUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="w-full sm:w-auto flex-1 max-w-md">
              <label className="block text-xs font-medium text-slate-700 mb-1">FLS_SHARED_SECRET</label>
              <input
                type="password"
                value={sharedSecret}
                onChange={e => setSharedSecret(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-900 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                onClick={() => setShowConfig(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Save & Ping Peers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Selector Strip */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700">Active Company ID:</span>
          {Object.keys(DEMO_COMPANIES).map(key => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                companyId === key
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="custom company_id"
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            className="w-48 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-mono text-xs focus:bg-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
        </form>
      </div>

      {/* Selected Company Profile Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="text-[11px] text-sky-400 font-mono uppercase tracking-wider">Scattered Entities Audit</div>
          <div className="text-base font-bold text-white mt-0.5">{activeCompany.name}</div>
          <div className="text-slate-400 text-xs">
            {activeCompany.jurisdiction} · Formed {activeCompany.incorporationDate}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-slate-400 text-[11px]">Clean Books</div>
            <div className="font-bold text-emerald-400 text-sm">{activeCompany.cleanBooksScore}%</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Diligence Readiness</div>
            <div className="font-bold text-emerald-400 text-sm">{activeCompany.readinessScore}%</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Last Weekly Delta</div>
            <div className="font-mono text-slate-200 text-xs">{activeCompany.deltaSummary}</div>
          </div>
        </div>
      </div>

      {/* The 3 Peer Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map(peer => (
          <ModuleCard
            key={peer.module}
            peer={peer}
            companyId={companyId}
            onOpenDetail={mod => setActiveInspector(mod)}
          />
        ))}
      </div>

      {/* Code Generation Callout */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-mono mb-1">
            <ShieldCheck className="w-4 h-4" />
            Meta-Agent Output
          </div>
          <h3 className="text-lg font-bold">Ready to deploy one of these modules as a standalone app?</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Each app has its own isolated Next.js 14 App Router codebase, Supabase SQL schema, package.json, and Vercel one-liner deploy scripts.
          </p>
        </div>
        <button
          onClick={() => onNavigateToFactory()}
          className="px-5 py-2.5 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
        >
          Open Module Factory <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Detail Inspector Modal */}
      {activeInspector && (
        <ModuleDetailModal
          module={activeInspector}
          companyId={companyId}
          onClose={() => setActiveInspector(null)}
          onGenerateCode={mod => {
            setActiveInspector(null);
            onNavigateToFactory(mod);
          }}
        />
      )}

    </div>
  );
};
