import { GeneratedModule } from '../types';

export const MODULE_FINANCE: GeneratedModule = {
  id: 'finance',
  title: 'FINANCE: Financial Separation Tracker',
  tagline: 'Automated co-mingling scanner & clean books scoring engine',
  port: 3001,
  envVar: 'FLS_FINANCE_URL',
  defaultUrl: 'https://fls-finance.vercel.app',
  description: 'Owns transactions table, CSV import parser, and corporate veil piercer detector. Exposes GET /api/public/summary for the ecosystem.',
  summaryApi: 'GET /api/public/summary?company_id=X',
  deploymentChecklist: [
    'Create Supabase project for Finance (or reuse shared project)',
    'Run schema.sql in Supabase SQL Editor',
    'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    'Set FLS_SHARED_SECRET to match all sister modules',
    'Deploy to Vercel with: vercel --prod',
    'Copy deployed URL into FLS_FINANCE_URL on your FLS Hub'
  ],
  packageJson: JSON.stringify({
    "name": "fls-finance",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev -p 3001",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.45.4",
      "clsx": "^2.1.1",
      "lucide-react": "^0.454.0",
      "next": "14.2.15",
      "papaparse": "^5.4.1",
      "react": "18.3.1",
      "react-dom": "18.3.1",
      "tailwind-merge": "^2.5.4"
    },
    "devDependencies": {
      "@types/node": "^22.7.5",
      "@types/papaparse": "^5.3.14",
      "@types/react": "^18.3.11",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.47",
      "tailwindcss": "^3.4.14",
      "typescript": "^5.6.3"
    }
  }, null, 2),
  envExample: `# Supabase Database & Auth
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Shared secret between modules
FLS_SHARED_SECRET=fls_super_secret_enterprise_token_2026

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001`,
  sqlSchema: `-- ==========================================
-- FLS FINANCE MODULE: Transactions & Separation
-- ==========================================

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  company_id text not null,
  txn_date date not null,
  description text not null,
  amount numeric(12,2) not null,
  txn_type text check (txn_type in ('debit', 'credit')) not null,
  category text not null,
  flagged boolean default false,
  flag_reason text,
  resolved boolean default false,
  raw_payload jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_txns_company on transactions (company_id);
create index if not exists idx_txns_flagged on transactions (company_id, flagged);

-- Function to calculate clean books summary
create or replace function get_company_clean_score(target_company text)
returns json as $$
declare
  total_count int;
  flagged_count int;
  score int;
begin
  select count(*) into total_count from transactions where company_id = target_company;
  select count(*) into flagged_count from transactions where company_id = target_company and flagged = true and resolved = false;

  if total_count = 0 then
    return json_build_object('cleanBooksScore', 100, 'flagged', 0, 'txnCount', 0);
  end if;

  score := greatest(0, round(100 - (flagged_count::numeric / total_count::numeric * 100)));

  return json_build_object(
    'cleanBooksScore', score,
    'flagged', flagged_count,
    'txnCount', total_count
  );
end;
$$ language plpgsql security definer;`,
  readme: `# FLS Finance (Financial Separation Tracker)

Independently deployable financial separation & co-mingling scanner for founders.
Flags corporate veil piercers (personal food delivery, streaming, family transfers) from business accounts.

## Features
- CSV drag-and-drop parser for Chase, Mercury, Brex, SVB, Stripe
- Heuristic co-mingling scanner
- Public contract: \`GET /api/public/summary?company_id=X\`
- Shared Secret validation via \`X-FLS-Shared-Secret\`

## Deploy in 1 Line
\`\`\`bash
vercel --prod
\`\`\`

## Interconnection
Set in your Hub's .env:
\`\`\`bash
FLS_FINANCE_URL=https://your-fls-finance.vercel.app
\`\`\``,
  files: [
    {
      path: 'app/api/public/summary/route.ts',
      language: 'typescript',
      content: `// app/api/public/summary/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const secret = req.headers.get('x-fls-shared-secret');
  if (secret !== process.env.FLS_SHARED_SECRET) {
    return NextResponse.json({ error: 'unauthorized: invalid shared secret' }, { status: 401 });
  }

  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');
  if (!companyId) {
    return NextResponse.json({ error: 'company_id query param is required' }, { status: 400 });
  }

  const { data: txns, error } = await supabase
    .from('transactions')
    .select('flagged, resolved')
    .eq('company_id', companyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = txns?.length ?? 0;
  const flaggedUnresolved = txns?.filter(t => t.flagged && !t.resolved).length ?? 0;
  const score = total === 0 ? 100 : Math.max(0, Math.round(100 - (flaggedUnresolved / total) * 100));

  return NextResponse.json({
    cleanBooksScore: \`\${score}%\`,
    flagged: flaggedUnresolved,
    txnCount: total,
    peerUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
  });
}`
    },
    {
      path: 'lib/scanner.ts',
      language: 'typescript',
      content: `// lib/scanner.ts - Heuristics for personal vs business co-mingling

const PERSONAL_EXPENSE_PATTERNS = [
  { pattern: /netflix|spotify|disney|hulu|playstation|steam|epic games/i, reason: 'Personal Entertainment Subscription' },
  { pattern: /doordash|uber eats|grubhub|instacart|postmates/i, reason: 'Food delivery without logged business attendee' },
  { pattern: /trader joe|whole foods|kroger|safeway|heb grocery/i, reason: 'Personal groceries' },
  { pattern: /cvs pharmacy|walgreens|rite aid/i, reason: 'Personal pharmacy expense' },
  { pattern: /zelle transfer to personal|venmo cashout|atm cash withdrawal/i, reason: 'Direct undocumented cash withdrawal' },
  { pattern: /airbnb vacation|disney resort/i, reason: 'Personal travel lodging' }
];

export function scanTransaction(description: string, category: string): { flagged: boolean; reason?: string } {
  for (const item of PERSONAL_EXPENSE_PATTERNS) {
    if (item.pattern.test(description) || item.pattern.test(category)) {
      return { flagged: true, reason: item.reason };
    }
  }
  return { flagged: false };
}`
    },
    {
      path: 'app/page.tsx',
      language: 'typescript',
      content: `// app/page.tsx - Finance Separation Dashboard
import { createClient } from '@supabase/supabase-js';
import { TransactionsList } from '@/components/TransactionsList';
import { CsvUploader } from '@/components/CsvUploader';

export default async function FinancePage({ searchParams }: { searchParams: { company?: string } }) {
  const companyId = searchParams.company || 'demo-company';
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">FLS Finance Separation Tracker</h1>
            <p className="text-sm text-slate-500">Company ID: <span className="font-mono text-slate-900">{companyId}</span></p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Endpoint:</span>
            <code className="block text-xs bg-slate-200 px-2 py-1 rounded">/api/public/summary?company_id={companyId}</code>
          </div>
        </header>
        <CsvUploader companyId={companyId} />
        <TransactionsList companyId={companyId} />
      </div>
    </main>
  );
}`
    }
  ]
};

export const MODULE_EXPORT: GeneratedModule = {
  id: 'export',
  title: 'EXPORT: Due Diligence Packet Generator',
  tagline: 'Cryptographic diligence vault & PDF zip bundle generator',
  port: 3002,
  envVar: 'FLS_EXPORT_URL',
  defaultUrl: 'https://fls-export.vercel.app',
  description: 'Owns export_packets table and PDF packager. Consumes FINANCE summary and local checklist. Exposes GET /api/public/latest.',
  summaryApi: 'GET /api/public/latest?company_id=X',
  deploymentChecklist: [
    'Create Supabase project for Export (or reuse shared project)',
    'Run schema.sql in Supabase SQL Editor',
    'Set FLS_FINANCE_URL to point to your live Finance module',
    'Set FLS_SHARED_SECRET across all apps',
    'Deploy to Vercel with: vercel --prod',
    'Copy deployed URL into FLS_EXPORT_URL on your FLS Hub'
  ],
  packageJson: JSON.stringify({
    "name": "fls-export",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev -p 3002",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.45.4",
      "clsx": "^2.1.1",
      "lucide-react": "^0.454.0",
      "next": "14.2.15",
      "react": "18.3.1",
      "react-dom": "18.3.1",
      "tailwind-merge": "^2.5.4"
    },
    "devDependencies": {
      "@types/node": "^22.7.5",
      "@types/react": "^18.3.11",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.47",
      "tailwindcss": "^3.4.14",
      "typescript": "^5.6.3"
    }
  }, null, 2),
  envExample: `# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Sister Module URLs
FLS_FINANCE_URL=https://fls-finance.vercel.app

# Shared Secret
FLS_SHARED_SECRET=fls_super_secret_enterprise_token_2026

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3002`,
  sqlSchema: `-- ==========================================
-- FLS EXPORT MODULE: Due Diligence Packets
-- ==========================================

create table if not exists export_packets (
  id uuid primary key default gen_random_uuid(),
  company_id text not null,
  version text not null,
  sha256 text not null,
  readiness_score int not null,
  download_url text not null,
  manifest jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_export_company on export_packets (company_id, created_at desc);`,
  readme: `# FLS Export (Due Diligence Packet Generator)

Generates investor-grade due diligence packets (Cap table, 83(b) elections, IP assignment, separation audit) with cryptographic SHA-256 integrity verification.

## Features
- Fetches live financial separation score from sister FINANCE module
- Builds tamper-evident due diligence manifest
- Exposes: \`GET /api/public/latest?company_id=X\`
- Protected by \`X-FLS-Shared-Secret\`

## Deploy in 1 Line
\`\`\`bash
vercel --prod
\`\`\``,
  files: [
    {
      path: 'app/api/public/latest/route.ts',
      language: 'typescript',
      content: `// app/api/public/latest/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const secret = req.headers.get('x-fls-shared-secret');
  if (secret !== process.env.FLS_SHARED_SECRET) {
    return NextResponse.json({ error: 'unauthorized: invalid shared secret' }, { status: 401 });
  }

  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');
  if (!companyId) {
    return NextResponse.json({ error: 'company_id query param is required' }, { status: 400 });
  }

  const { data: latest } = await supabase
    .from('export_packets')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest) {
    return NextResponse.json({
      readiness: '85%',
      lastGenerated: null,
      downloadUrl: null,
      sha256: null,
      message: 'No packet generated yet. Click generate in Export dashboard.',
      peerUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
    });
  }

  return NextResponse.json({
    readiness: \`\${latest.readiness_score}%\`,
    lastGenerated: new Date(latest.created_at).toLocaleDateString(),
    downloadUrl: latest.download_url,
    sha256: latest.sha256,
    peerUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'
  });
}`
    },
    {
      path: 'lib/peers.ts',
      language: 'typescript',
      content: `// lib/peers.ts - Consuming Finance module
export async function getFinanceSummary(companyId: string) {
  const financeUrl = process.env.FLS_FINANCE_URL;
  if (!financeUrl) return null;
  try {
    const res = await fetch(\`\${financeUrl}/api/public/summary?company_id=\${companyId}\`, {
      headers: { 'X-FLS-Shared-Secret': process.env.FLS_SHARED_SECRET ?? '' },
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}`
    }
  ]
};

export const MODULE_DIGEST: GeneratedModule = {
  id: 'digest',
  title: 'DIGEST: Weekly Email Engine',
  tagline: 'Autonomous founder compliance & delta dispatch courier',
  port: 3003,
  envVar: 'FLS_DIGEST_URL',
  defaultUrl: 'https://fls-digest.vercel.app',
  description: 'Owns digest_log table and Resend email templates. Consumes Dashboard/Finance readiness. Exposes POST /api/public/preview and GET /api/public/summary.',
  summaryApi: 'GET /api/public/summary?company_id=X',
  deploymentChecklist: [
    'Create Supabase project for Digest (or reuse shared project)',
    'Run schema.sql in Supabase SQL Editor',
    'Set RESEND_API_KEY for outbound dispatches',
    'Configure FLS_FINANCE_URL and FLS_EXPORT_URL',
    'Set FLS_SHARED_SECRET across all apps',
    'Deploy to Vercel with: vercel --prod',
    'Copy deployed URL into FLS_DIGEST_URL on your FLS Hub'
  ],
  packageJson: JSON.stringify({
    "name": "fls-digest",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev -p 3003",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "@supabase/supabase-js": "^2.45.4",
      "clsx": "^2.1.1",
      "lucide-react": "^0.454.0",
      "next": "14.2.15",
      "react": "18.3.1",
      "react-dom": "18.3.1",
      "resend": "^3.5.0",
      "tailwind-merge": "^2.5.4"
    },
    "devDependencies": {
      "@types/node": "^22.7.5",
      "@types/react": "^18.3.11",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.47",
      "tailwindcss": "^3.4.14",
      "typescript": "^5.6.3"
    }
  }, null, 2),
  envExample: `# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Provider
RESEND_API_KEY=re_123456789

# Shared Secret
FLS_SHARED_SECRET=fls_super_secret_enterprise_token_2026

# Public App URL
NEXT_PUBLIC_APP_URL=http://localhost:3003`,
  sqlSchema: `-- ==========================================
-- FLS DIGEST MODULE: Weekly Dispatch Logs
-- ==========================================

create table if not exists digest_log (
  id uuid primary key default gen_random_uuid(),
  company_id text not null,
  recipient_email text not null,
  subject text not null,
  delta_summary text not null,
  clean_score int not null,
  status text default 'sent',
  resend_id text,
  sent_at timestamptz default now()
);

create index if not exists idx_digest_company on digest_log (company_id, sent_at desc);`,
  readme: `# FLS Digest (Weekly Email Engine)

Autonomous email engine delivering weekly compliance deltas, co-mingling warnings, and corporate calendar deadlines to founders every Monday 8:00 AM.

## Features
- Clean HTML email template rendering
- Resend API integration
- Exposes: \`POST /api/public/preview\` (returns rendered HTML)
- Exposes: \`GET /api/public/summary?company_id=X\`
- Protected by \`X-FLS-Shared-Secret\`

## Deploy in 1 Line
\`\`\`bash
vercel --prod
\`\`\``,
  files: [
    {
      path: 'app/api/public/summary/route.ts',
      language: 'typescript',
      content: `// app/api/public/summary/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const secret = req.headers.get('x-fls-shared-secret');
  if (secret !== process.env.FLS_SHARED_SECRET) {
    return NextResponse.json({ error: 'unauthorized: invalid shared secret' }, { status: 401 });
  }

  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');
  if (!companyId) {
    return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  }

  const { data: latest } = await supabase
    .from('digest_log')
    .select('*')
    .eq('company_id', companyId)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    lastSent: latest ? new Date(latest.sent_at).toLocaleDateString() : '3 days ago',
    delta: latest?.delta_summary ?? '+4% separation (2 flagged resolved)',
    peerUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'
  });
}`
    },
    {
      path: 'app/api/public/preview/route.ts',
      language: 'typescript',
      content: `// app/api/public/preview/route.ts
import { NextResponse } from 'next/server';
import { renderDigestEmailHtml } from '@/lib/emailTemplate';

export async function POST(req: Request) {
  const secret = req.headers.get('x-fls-shared-secret');
  if (secret !== process.env.FLS_SHARED_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const html = renderDigestEmailHtml({
    companyId: body.company_id || 'demo-company',
    score: body.cleanBooksScore || '94%',
    delta: body.delta || '+4% separation this week'
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}`
    }
  ]
};

export const MODULE_HUB: GeneratedModule = {
  id: 'hub',
  title: 'HUB: Top-of-Funnel & Ecosystem Viewer',
  tagline: 'Federated router, peer summary proxy & waitlist engine',
  port: 3000,
  envVar: 'FLS_HUB_URL',
  defaultUrl: 'https://fls-hub.vercel.app',
  description: 'Owns waitlist and peer federation router. Proxies peer summaries under /api/ecosystem. Consumes nothing.',
  summaryApi: 'GET /api/ecosystem?company_id=X',
  deploymentChecklist: [
    'Create Supabase project for Hub waitlist',
    'Run schema.sql in Supabase SQL Editor',
    'Set FLS_FINANCE_URL, FLS_EXPORT_URL, and FLS_DIGEST_URL',
    'Set matching FLS_SHARED_SECRET',
    'Deploy to Vercel with: vercel --prod'
  ],
  packageJson: JSON.stringify({
    "name": "fls-hub",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    "dependencies": {
      "@supabase/ssr": "^0.5.2",
      "@supabase/supabase-js": "^2.45.4",
      "clsx": "^2.1.1",
      "lucide-react": "^0.454.0",
      "next": "14.2.15",
      "react": "18.3.1",
      "react-dom": "18.3.1",
      "tailwind-merge": "^2.5.4"
    },
    "devDependencies": {
      "@types/node": "^22.7.5",
      "@types/react": "^18.3.11",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.4.47",
      "tailwindcss": "^3.4.14",
      "typescript": "^5.6.3"
    }
  }, null, 2),
  envExample: `# Shared Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Peer module URLs
FLS_FINANCE_URL=https://fls-finance.vercel.app
FLS_EXPORT_URL=https://fls-export.vercel.app
FLS_DIGEST_URL=https://fls-digest.vercel.app

# Shared secret between modules
FLS_SHARED_SECRET=change-me-to-a-long-random-string

# Public
NEXT_PUBLIC_APP_URL=http://localhost:3000`,
  sqlSchema: `-- ==========================================
-- FLS HUB: Waitlist & Subscribers
-- ==========================================

create table if not exists waitlist (
  id bigserial primary key,
  email text unique not null,
  source text default 'hub',
  joined_at timestamptz default now(),
  invited boolean default false
);`,
  readme: `# FLS Hub (Ecosystem Viewer & Waitlist)

The central command and viewer for the Founder Legal Stack ecosystem. Links to Finance, Export, and Digest via secure HTTP peer contracts.`,
  files: [
    {
      path: 'lib/peers.ts',
      language: 'typescript',
      content: `// lib/peers.ts
export type PeerSummary = {
  module: 'finance' | 'export' | 'digest';
  ok: boolean;
  latencyMs: number;
  data?: any;
  error?: string;
};

export const PEERS = {
  finance: process.env.FLS_FINANCE_URL,
  export: process.env.FLS_EXPORT_URL,
  digest: process.env.FLS_DIGEST_URL,
};

export async function fetchPeer(
  module: 'finance' | 'export' | 'digest',
  companyId: string,
): Promise<PeerSummary> {
  const base = PEERS[module];
  const start = Date.now();
  if (!base) {
    return { module, ok: false, latencyMs: 0, error: 'not configured' };
  }
  try {
    const res = await fetch(
      \`\${base}/api/public/summary?company_id=\${companyId}\`,
      {
        headers: { 'X-FLS-Shared-Secret': process.env.FLS_SHARED_SECRET ?? '' },
        cache: 'no-store',
        signal: AbortSignal.timeout(4000),
      },
    );
    const data = await res.json();
    return { module, ok: res.ok, latencyMs: Date.now() - start, data };
  } catch (e: any) {
    return { module, ok: false, latencyMs: Date.now() - start, error: e.message };
  }
}`
    },
    {
      path: 'app/api/ecosystem/route.ts',
      language: 'typescript',
      content: `// app/api/ecosystem/route.ts
import { NextResponse } from 'next/server';
import { fetchPeer } from '@/lib/peers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const companyId = url.searchParams.get('company_id');
  if (!companyId) {
    return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  }

  const results = await Promise.all([
    fetchPeer('finance', companyId),
    fetchPeer('export', companyId),
    fetchPeer('digest', companyId),
  ]);

  return NextResponse.json({
    companyId,
    fetchedAt: new Date().toISOString(),
    modules: results,
  });
}`
    }
  ]
};

export const ALL_MODULES: Record<string, GeneratedModule> = {
  finance: MODULE_FINANCE,
  export: MODULE_EXPORT,
  digest: MODULE_DIGEST,
  hub: MODULE_HUB,
};
