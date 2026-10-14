import React from 'react';
import { DollarSign, FileDown, Mail, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PeerSummary } from '../../types';

const META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; baseEnv: string; port: number }> = {
  finance: { label: 'Finance Separation', icon: DollarSign, baseEnv: 'FLS_FINANCE_URL', port: 3001 },
  export: { label: 'Due Diligence Export', icon: FileDown, baseEnv: 'FLS_EXPORT_URL', port: 3002 },
  digest: { label: 'Weekly Digest', icon: Mail, baseEnv: 'FLS_DIGEST_URL', port: 3003 },
};

interface ModuleCardProps {
  peer: PeerSummary;
  companyId: string;
  onOpenDetail?: (module: 'finance' | 'export' | 'digest') => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  peer,
  companyId: _companyId,
  onOpenDetail
}) => {
  const meta = META[peer.module] || {
    label: peer.module.toUpperCase(),
    icon: DollarSign,
    baseEnv: `FLS_${peer.module.toUpperCase()}_URL`,
    port: 3000
  };
  const Icon = meta.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{meta.label}</h3>
              <span className="text-[11px] font-mono text-slate-500">Port :{meta.port}</span>
            </div>
          </div>
          {peer.ok ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Healthy</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unconfigured</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs pt-1">
          {!peer.ok && (
            <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-200/60 space-y-1">
              <div className="font-medium text-amber-900">
                {peer.error === 'not configured' ? 'Module not deployed or connected yet.' : peer.error}
              </div>
              <div className="text-slate-500 font-mono text-[10px] break-all">
                Set <span className="text-slate-900 font-bold">{meta.baseEnv}</span> in environment
              </div>
            </div>
          )}

          {peer.ok && peer.module === 'finance' && peer.data && (
            <div className="divide-y divide-slate-100 space-y-1.5">
              <Row label="Clean Books Score" value={<span className="font-bold text-emerald-600 text-sm">{peer.data.cleanBooksScore ?? '100%'}</span>} />
              <Row label="Flagged Transactions" value={<span className="font-semibold text-rose-600">{peer.data.flagged ?? 0} items</span>} />
              <Row label="Scanned Transactions" value={<span className="font-mono text-slate-700">{peer.data.txnCount ?? 0}</span>} />
            </div>
          )}

          {peer.ok && peer.module === 'export' && peer.data && (
            <div className="divide-y divide-slate-100 space-y-1.5">
              <Row label="Readiness Score" value={<span className="font-bold text-emerald-600 text-sm">{peer.data.readiness ?? '88%'}</span>} />
              <Row label="Last Generated" value={peer.data.lastGenerated ?? 'Today'} />
              <div className="pt-2">
                <button
                  onClick={() => onOpenDetail?.('export')}
                  className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-medium rounded border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Inspect Diligence Packet <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {peer.ok && peer.module === 'digest' && peer.data && (
            <div className="divide-y divide-slate-100 space-y-1.5">
              <Row label="Last Weekly Dispatch" value={peer.data.lastSent ?? 'Monday 8:00 AM'} />
              <Row label="Weekly Delta" value={<span className="font-mono text-slate-700">{peer.data.delta ?? '—'}</span>} />
              <div className="pt-2">
                <button
                  onClick={() => onOpenDetail?.('digest')}
                  className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-medium rounded border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  Preview HTML Email <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <span>Latency:</span>
          <span className="font-semibold text-slate-800">{peer.latencyMs}ms</span>
        </div>
        <button
          onClick={() => onOpenDetail?.(peer.module)}
          className="text-xs font-medium text-slate-900 hover:text-sky-600 inline-flex items-center gap-1 transition-colors"
        >
          Open Module View →
        </button>
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value ?? '—'}</span>
    </div>
  );
}
