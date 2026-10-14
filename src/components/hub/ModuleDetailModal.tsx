import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Download, RefreshCw, FileText, Send, Sparkles } from 'lucide-react';
import { Transaction, ExportPacket, DigestPreviewData } from '../../types';
import { INITIAL_TRANSACTIONS, SAMPLE_PACKET, SAMPLE_DIGEST } from '../../data/mockData';

interface ModuleDetailModalProps {
  module: 'finance' | 'export' | 'digest' | 'hub';
  companyId: string;
  onClose: () => void;
  onGenerateCode: (mod: string) => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  companyId,
  onClose,
  onGenerateCode
}) => {
  // State for Finance Simulator
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Meals & Entertainment');

  // State for Export Simulator
  const [packet, setPacket] = useState<ExportPacket>(SAMPLE_PACKET);
  const [isRegeneratingPacket, setIsRegeneratingPacket] = useState(false);

  // State for Digest Simulator
  const [digest, _setDigest] = useState<DigestPreviewData>(SAMPLE_DIGEST);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Co-mingling check
  const handleResolveTxn = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, resolved: true, flaggedCoMingling: false } : t))
    );
  };

  const handleAddCustomTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;

    const isPersonal = /netflix|spotify|doordash|uber eats|grocery|personal|zelle|vacation|steam/i.test(newDesc);
    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: newDesc,
      amount: parseFloat(newAmount),
      type: 'debit',
      category: newCategory,
      flaggedCoMingling: isPersonal,
      reason: isPersonal ? 'Automated scanner identified residential or personal entertainment footprint.' : undefined,
      resolved: false
    };

    setTransactions([newTxn, ...transactions]);
    setNewDesc('');
    setNewAmount('');
  };

  const totalTxns = transactions.length;
  const flaggedCount = transactions.filter(t => t.flaggedCoMingling && !t.resolved).length;
  const cleanScore = totalTxns === 0 ? 100 : Math.max(0, Math.round(100 - (flaggedCount / totalTxns) * 100));

  const handleRegeneratePacket = () => {
    setIsRegeneratingPacket(true);
    setTimeout(() => {
      setPacket(prev => ({
        ...prev,
        createdAt: new Date().toISOString(),
        readinessScore: Math.min(100, prev.readinessScore + 2),
        sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      }));
      setIsRegeneratingPacket(false);
    }, 700);
  };

  const handleSendTestEmail = () => {
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-slate-500">Module Inspector</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                Company: {companyId}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {module === 'finance' && 'Finance: Financial Separation Tracker & Co-Mingling Scanner'}
              {module === 'export' && 'Export: Due Diligence Packet Generator & Cryptographic Seal'}
              {module === 'digest' && 'Digest: Autonomous Weekly Founder Dispatch Engine'}
              {module === 'hub' && 'Hub: Federated Proxy & Top-of-Funnel Router'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onGenerateCode(module)}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Export Standalone Code
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ===================== FINANCE INSPECTOR ===================== */}
          {module === 'finance' && (
            <div className="space-y-6">
              {/* Score strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-medium">Clean Books Score</div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">{cleanScore}%</div>
                  <div className="text-[11px] text-emerald-600 mt-0.5">Corporate Veil Protection Intact</div>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <div className="text-xs text-rose-800 font-medium">Flagged Co-Mingling</div>
                  <div className="text-3xl font-extrabold text-rose-700 mt-1">{flaggedCount}</div>
                  <div className="text-[11px] text-rose-600 mt-0.5">Unresolved personal items</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-700 font-medium">Scanned Ledger Items</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalTxns}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Mercury / Chase / Stripe feeds</div>
                </div>
              </div>

              {/* Add transaction sandbox */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Live Co-Mingling Heuristic Test
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Try adding "Uber Eats", "Netflix", or "AWS Hosting"
                  </span>
                </div>
                <form onSubmit={handleAddCustomTxn} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. DoorDash dinner"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount ($)"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
                  >
                    Scan & Add
                  </button>
                </form>
              </div>

              {/* Transactions list */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Transactions Feed</span>
                  <span>Scanned Heuristics</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {transactions.map(txn => (
                    <div key={txn.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/80">
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{txn.description}</span>
                          {txn.flaggedCoMingling && !txn.resolved && (
                            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              Co-mingling flag
                            </span>
                          )}
                          {txn.resolved && (
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Reimbursed / Resolved
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {txn.date} · {txn.category} {txn.reason && `· ${txn.reason}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-mono font-medium ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        {txn.flaggedCoMingling && !txn.resolved && (
                          <button
                            onClick={() => handleResolveTxn(txn.id)}
                            className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                          >
                            Mark Reimbursed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== EXPORT INSPECTOR ===================== */}
          {module === 'export' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-xl">
                <div>
                  <div className="text-xs text-sky-400 font-mono">DUE DILIGENCE PACKET · v{packet.version}</div>
                  <h3 className="text-lg font-bold mt-0.5">Venture Investment Dossier</h3>
                  <div className="text-xs text-slate-400 font-mono mt-1 break-all">
                    SHA-256: {packet.sha256}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleRegeneratePacket}
                    disabled={isRegeneratingPacket}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingPacket ? 'animate-spin' : ''}`} />
                    Rebuild Packet
                  </button>
                  <a
                    href={`#download-${packet.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloaded Due Diligence Packet bundle for ${companyId} (SHA-256: ${packet.sha256.substring(0, 16)}...)`);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download ZIP
                  </a>
                </div>
              </div>

              {/* Items checklist */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 flex justify-between">
                  <span>Diligence Document Manifest</span>
                  <span>Verification Status</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {packet.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500">Updated: {item.updatedAt} · Size: {item.size}</div>
                        </div>
                      </div>
                      <div>
                        {item.status === 'verified' ? (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stamped & Verified
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Pending Filing
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p>
                  This packet automatically pulls clean books separation metrics from <code className="font-mono text-sky-800">FINANCE /api/public/summary</code> and attaches a cryptographic proof signature that investors can independently verify during Series Seed or Series A due diligence.
                </p>
              </div>
            </div>
          )}

          {/* ===================== DIGEST INSPECTOR ===================== */}
          {module === 'digest' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Founder Weekly Dispatch Engine</h3>
                  <p className="text-xs text-slate-500">Autonomous email dispatches triggered every Monday at 08:00 AM UTC via Resend.</p>
                </div>
                <button
                  onClick={handleSendTestEmail}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendSuccess ? 'Test Sent to Founder!' : 'Send Test Dispatch'}
                </button>
              </div>

              {/* Rendered HTML Email Container */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs bg-slate-100 p-6 flex justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden text-xs">
                  
                  {/* Email Header */}
                  <div className="bg-slate-900 text-white p-5 text-center">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400">Founder Legal Stack</span>
                    <h4 className="text-base font-bold mt-1">Monday Compliance Dispatch #42</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{digest.generatedAt}</p>
                  </div>

                  {/* Email Body */}
                  <div className="p-5 space-y-4">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase text-emerald-800 font-semibold">Clean Books Score</div>
                        <div className="text-xl font-bold text-emerald-700">{digest.cleanBooksScore}%</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                          {digest.cleanBooksDelta} this week
                        </span>
                        <div className="text-[10px] text-emerald-700 mt-1">2 co-mingling flags resolved</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-semibold text-slate-900 text-xs">Upcoming Corporate Deadlines</div>
                      <div className="space-y-1.5">
                        {digest.upcomingDeadlines.map((dl, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800">{dl.title}</div>
                              <div className="text-[10px] text-slate-500">{dl.jurisdiction} · Due {dl.dueDate}</div>
                            </div>
                            <span className="font-mono text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              {dl.daysRemaining}d
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full py-2 bg-slate-900 text-white font-semibold text-center rounded-lg">
                        View Updated Diligence Vault →
                      </div>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
                    Dispatched automatically by FLS Digest Engine. Single-click unsubscribe or manage frequency.
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ===================== HUB INSPECTOR ===================== */}
          {module === 'hub' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <h3 className="text-sm font-bold">FLS Hub Router & Reverse Proxy</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Hub is the thin coordination layer. It listens on port 3000, provides the marketing waitlist, and queries sister modules under <code className="text-sky-300 font-mono">/api/ecosystem?company_id=X</code>.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="text-xs font-semibold text-slate-900">Federation Routes Exposed by Hub</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>GET /api/ecosystem?company_id=X</span>
                    <span className="text-emerald-600">Proxies 3 modules concurrently</span>
                  </div>
                  <div className="p-2.5 bg-white rounded border border-slate-200 flex justify-between">
                    <span>POST /api/waitlist</span>
                    <span className="text-emerald-600">Saves subscriber to Supabase</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Standalone deployable on Vercel with zero cross-module lock-in.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
