import React, { useState } from 'react';
import { GraphicFinance, GraphicExport, GraphicDigest, GraphicFederationTopology } from '../common/SvgGraphics';
import { ArrowRight, Check, ShieldCheck, Cpu, Database, Network } from 'lucide-react';

interface MarketingViewProps {
  onNavigateToViewer: () => void;
  onNavigateToFactory: (moduleId?: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  onNavigateToViewer,
  onNavigateToFactory
}) => {
  const [email, setEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'busy' | 'done'>('idle');
  const [joinedCount, setJoinedCount] = useState(() => {
    return parseInt(localStorage.getItem('fls_waitlist_count') || '348', 10);
  });

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setWaitlistStatus('busy');
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('fls_subscribers') || '[]');
      if (!existing.includes(email)) {
        existing.push({ email, date: new Date().toISOString() });
        localStorage.setItem('fls_subscribers', JSON.stringify(existing));
        const newCount = joinedCount + 1;
        setJoinedCount(newCount);
        localStorage.setItem('fls_waitlist_count', newCount.toString());
      }
      setWaitlistStatus('done');
    }, 600);
  };

  return (
    <div className="space-y-24 py-12">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span>The Meta-Agent Ecosystem</span>
          <span aria-hidden="true">·</span>
          <span>Next.js 14 App Router</span>
          <span aria-hidden="true">·</span>
          <span>Zero Monolith Risk</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Modular legal infrastructure <br className="hidden sm:block" />
          for indie founders & startups.
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
          Finance separation, compliance diligence exports, and weekly delta digests — engineered as four decoupled, independently deployable micro-apps that speak via a zero-trust HTTP peer protocol.
        </p>

        {/* Waitlist Form & Direct Viewer Link */}
        <div className="max-w-md mx-auto pt-4 space-y-4">
          {waitlistStatus === 'done' ? (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-left">
                <p className="font-semibold">You're on the founder early-access list.</p>
                <p className="text-xs text-emerald-700">We will notify {email} as each standalone module drops.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="founder@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={waitlistStatus === 'busy'}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
              >
                {waitlistStatus === 'busy' ? 'Joining…' : 'Join waitlist'}
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-1">
            <span>{joinedCount.toLocaleString()} founders on list</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onNavigateToViewer}
              className="font-medium text-slate-900 hover:underline inline-flex items-center gap-1"
            >
              Open live ecosystem viewer <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Network Federation Diagram Section */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="text-xs text-sky-400 font-mono uppercase tracking-wider mb-1">Architecture Blueprint</div>
              <h2 className="text-xl font-bold tracking-tight">The 4-Module Decentralized Topology</h2>
              <p className="text-sm text-slate-400 mt-1">
                Every module boots standalone on its own port or Vercel URL. No module crashes if a peer is down.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToViewer}
                className="px-4 py-2 text-xs font-semibold bg-sky-500 text-slate-950 rounded-lg hover:bg-sky-400 transition-colors whitespace-nowrap"
              >
                Test Live Federation
              </button>
              <button
                onClick={() => onNavigateToFactory()}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                View Module Source Code
              </button>
            </div>
          </div>

          <GraphicFederationTopology />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Zero-Trust Peer Contract</span>
                <p className="text-slate-400 mt-0.5">Authenticated via <code className="text-sky-300">X-FLS-Shared-Secret</code> and company scoped via <code className="text-sky-300">X-FLS-Company-Id</code>.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Database className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Isolated Schemas</span>
                <p className="text-slate-400 mt-0.5">Zero cross-database foreign keys. Each module owns its specific data tables with clean local indexes.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Network className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Divisible Acquisition Value</span>
                <p className="text-slate-400 mt-0.5">Modular licensing lets you sell just the compliance module to one customer, or the entire stack together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Modules Grid */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">The Four Independent Deployable Modules</h2>
          <p className="text-sm text-slate-600">
            Click on any module to test its live sandbox or generate its complete Next.js 14 code bundle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: Finance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-700 font-semibold">01 · Port 3001</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">Standalone App</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Finance Separation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transactions ledger, CSV import parser, and corporate veil piercer detector. Scans personal DoorDash, Netflix, and family transfers.
              </p>
              <GraphicFinance />
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
                GET /api/public/summary?company_id=X
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <button
                onClick={() => onNavigateToFactory('finance')}
                className="text-xs font-semibold text-slate-900 hover:text-sky-600 flex items-center gap-1"
              >
                Generate Code <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNavigateToViewer}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Inspect Live →
              </button>
            </div>
          </div>

          {/* Module 2: Export */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-700 font-semibold">02 · Port 3002</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">Standalone App</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Due Diligence Export</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assembles Cap Table, stamped 83(b) tax elections, PIIA IP assignments, and financial separation audit into a cryptographic SHA-256 vault.
              </p>
              <GraphicExport />
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
                GET /api/public/latest?company_id=X
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <button
                onClick={() => onNavigateToFactory('export')}
                className="text-xs font-semibold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
              >
                Generate Code <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNavigateToViewer}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Inspect Live →
              </button>
            </div>
          </div>

          {/* Module 3: Digest */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-700 font-semibold">03 · Port 3003</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">Standalone App</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Weekly Email Digest</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous Monday morning dispatch courier. Calculates separation deltas, highlights upcoming franchise tax deadlines, and renders clean HTML.
              </p>
              <GraphicDigest />
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
                POST /api/public/preview → HTML
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
              <button
                onClick={() => onNavigateToFactory('digest')}
                className="text-xs font-semibold text-slate-900 hover:text-amber-600 flex items-center gap-1"
              >
                Generate Code <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onNavigateToViewer}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Inspect Live →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Why This Architecture Wins */}
      <section className="max-w-4xl mx-auto px-6 border-t border-slate-200 pt-16">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 text-center">
          Why The Modular Factory Architecture Wins
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" /> For You as Engineer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ship one module at a time. Ship Finance this week, Export next week. No monolith build failures, no huge PRs, and fast independent deployments.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" /> For FLS as a Business
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sell just the compliance module to one customer, or the export engine to a legal accelerator. Modular pricing, modular upsells.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-700" /> For Eventual Acquirers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buyers can acquire any single component cleanly because database schemas and repositories are 100% self-contained.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
