import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, XCircle, Copy, Check, Shield } from 'lucide-react';

export const ApiContractTester: React.FC = () => {
  const [targetEndpoint, setTargetEndpoint] = useState<'finance_summary' | 'export_latest' | 'digest_preview' | 'hub_ecosystem'>('finance_summary');
  const [companyId, setCompanyId] = useState('demo-company');
  const [secretHeader, setSecretHeader] = useState('fls_super_secret_enterprise_token_2026');
  const [includeValidSecret, setIncludeValidSecret] = useState(true);
  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [responseBody, setResponseBody] = useState<string>(JSON.stringify({
    cleanBooksScore: "94%",
    flagged: 3,
    txnCount: 142,
    peerUrl: "https://fls-finance.vercel.app"
  }, null, 2));
  const [copiedCurl, setCopiedCurl] = useState(false);

  const executeSimulatedRequest = () => {
    if (!includeValidSecret || secretHeader !== 'fls_super_secret_enterprise_token_2026') {
      setResponseStatus(401);
      setResponseBody(JSON.stringify({
        error: "unauthorized: invalid or missing X-FLS-Shared-Secret header"
      }, null, 2));
      return;
    }

    setResponseStatus(200);
    if (targetEndpoint === 'finance_summary') {
      setResponseBody(JSON.stringify({
        cleanBooksScore: "94%",
        flagged: 3,
        txnCount: 142,
        peerUrl: "https://fls-finance.vercel.app"
      }, null, 2));
    } else if (targetEndpoint === 'export_latest') {
      setResponseBody(JSON.stringify({
        readiness: "88%",
        lastGenerated: "Oct 11, 2026",
        downloadUrl: "https://fls-export.vercel.app/vault/diligence_bundle_oct26.zip",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        peerUrl: "https://fls-export.vercel.app"
      }, null, 2));
    } else if (targetEndpoint === 'digest_preview') {
      setResponseBody(`<!DOCTYPE html>
<html>
  <head><title>Founder Monday Dispatch #42</title></head>
  <body style="font-family: sans-serif; background: #0f172a; color: white; padding: 24px;">
    <h2>Monday Compliance Dispatch</h2>
    <p>Clean Books Score: <strong>94% (+4%)</strong></p>
    <p>Upcoming: Delaware Franchise Tax filing in 138 days.</p>
  </body>
</html>`);
    } else if (targetEndpoint === 'hub_ecosystem') {
      setResponseBody(JSON.stringify({
        companyId: companyId,
        fetchedAt: new Date().toISOString(),
        modules: [
          { module: "finance", ok: true, latencyMs: 24, data: { cleanBooksScore: "94%", flagged: 3, txnCount: 142 } },
          { module: "export", ok: true, latencyMs: 38, data: { readiness: "88%", sha256: "e3b0c4..." } },
          { module: "digest", ok: true, latencyMs: 19, data: { lastSent: "Yesterday", delta: "+4%" } }
        ]
      }, null, 2));
    }
  };

  const getCurlSnippet = () => {
    let url = 'https://fls-finance.vercel.app/api/public/summary?company_id=' + companyId;
    if (targetEndpoint === 'export_latest') url = 'https://fls-export.vercel.app/api/public/latest?company_id=' + companyId;
    if (targetEndpoint === 'digest_preview') url = 'https://fls-digest.vercel.app/api/public/preview';
    if (targetEndpoint === 'hub_ecosystem') url = 'https://fls-hub.vercel.app/api/ecosystem?company_id=' + companyId;

    return `curl -X ${targetEndpoint === 'digest_preview' ? 'POST' : 'GET'} \\
  "${url}" \\
  -H "X-FLS-Company-Id: ${companyId}" \\
  -H "X-FLS-Shared-Secret: ${includeValidSecret ? secretHeader : 'bad-token'}"`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-mono font-semibold text-sky-600 uppercase tracking-wider mb-1">
          Shared Protocol Specification
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Peer Contract Sandbox & Inspector
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">
          Every standalone module in the ecosystem exposes authenticated endpoints under <code className="font-mono text-slate-800">/api/public/*</code> protected by <code className="font-mono text-slate-800">X-FLS-Shared-Secret</code> and company scoped by <code className="font-mono text-slate-800">X-FLS-Company-Id</code>.
        </p>
      </div>

      {/* Contract Rules Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Shield className="w-4 h-4 text-sky-600" />
            Rule 1: Shared Secret Header
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Requests without matching <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">X-FLS-Shared-Secret</code> return HTTP 401 Unauthorized immediately.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Rule 2: Scoped Isolation
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All endpoints require <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">company_id</code> query parameter or <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">X-FLS-Company-Id</code> header.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Rule 3: Non-Blocking Graceful Degradation
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            No peer crash ever crashes another peer. The Hub handles missing, sleeping, or cold-starting peers safely.
          </p>
        </div>
      </div>

      {/* Interactive Request Builder */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-slate-900">Interactive Request Simulator</h2>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Test Auth:</span>
            <button
              onClick={() => {
                setIncludeValidSecret(!includeValidSecret);
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                includeValidSecret
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {includeValidSecret ? 'Valid Secret (200 OK)' : 'Bad Secret (401 Unauthorized)'}
            </button>
          </div>
        </div>

        {/* Endpoint Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'finance_summary', label: 'FINANCE /api/public/summary', method: 'GET' },
            { id: 'export_latest', label: 'EXPORT /api/public/latest', method: 'GET' },
            { id: 'digest_preview', label: 'DIGEST /api/public/preview', method: 'POST' },
            { id: 'hub_ecosystem', label: 'HUB /api/ecosystem', method: 'GET' },
          ].map(ep => (
            <button
              key={ep.id}
              onClick={() => {
                setTargetEndpoint(ep.id as unknown as typeof targetEndpoint);
              }}
              className={`p-3 text-left rounded-lg border text-xs transition-all ${
                targetEndpoint === ep.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-[10px] font-mono opacity-80">{ep.method}</span>
              <div className="font-semibold mt-0.5 truncate">{ep.label}</div>
            </button>
          ))}
        </div>

        {/* Parameters input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Company ID Scope</label>
            <input
              type="text"
              value={companyId}
              onChange={e => setCompanyId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Shared Secret Value</label>
            <input
              type="text"
              value={secretHeader}
              onChange={e => setSecretHeader(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono text-xs"
            />
          </div>
        </div>

        <button
          onClick={executeSimulatedRequest}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors"
        >
          <Send className="w-3.5 h-3.5" /> Execute Test Request
        </button>

        {/* Curl command snippet box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">cURL equivalent:</span>
            <button
              onClick={handleCopyCurl}
              className="text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCurl ? 'Copied cURL' : 'Copy cURL'}
            </button>
          </div>
          <pre className="bg-slate-900 text-sky-300 p-3 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
            {getCurlSnippet()}
          </pre>
        </div>

        {/* Response preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Response Output:</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {responseStatus === 200 ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 200 OK
                </span>
              ) : (
                <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-rose-600" /> 401 Unauthorized
                </span>
              )}
            </div>
          </div>
          <pre className={`p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre ${
            responseStatus === 200 ? 'bg-slate-950 text-emerald-400' : 'bg-rose-950 text-rose-300'
          }`}>
            {responseBody}
          </pre>
        </div>

      </div>

    </div>
  );
};
