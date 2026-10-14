export type ModuleType = 'finance' | 'export' | 'digest' | 'hub';

export interface PeerSummary {
  module: 'finance' | 'export' | 'digest';
  ok: boolean;
  latencyMs: number;
  data?: {
    cleanBooksScore?: string | number;
    flagged?: number;
    txnCount?: number;
    readiness?: string;
    lastGenerated?: string;
    downloadUrl?: string;
    sha256?: string;
    lastSent?: string;
    delta?: string;
    peerUrl?: string;
    [key: string]: unknown;
  };
  error?: string;
}

export interface EcosystemResponse {
  companyId: string;
  fetchedAt: string;
  modules: PeerSummary[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  flaggedCoMingling: boolean;
  reason?: string;
  resolved: boolean;
}

export interface ExportPacket {
  id: string;
  companyId: string;
  version: string;
  createdAt: string;
  sha256: string;
  readinessScore: number;
  items: {
    name: string;
    status: 'verified' | 'pending' | 'warning';
    size: string;
    updatedAt: string;
  }[];
}

export interface DigestPreviewData {
  companyId: string;
  weekNumber: number;
  year: number;
  generatedAt: string;
  cleanBooksScore: number;
  cleanBooksDelta: string;
  resolvedItemsCount: number;
  flaggedItemsCount: number;
  upcomingDeadlines: {
    title: string;
    dueDate: string;
    daysRemaining: number;
    jurisdiction: string;
  }[];
  readinessStatus: string;
}

export interface CodeFile {
  path: string;
  content: string;
  language: 'typescript' | 'json' | 'sql' | 'markdown' | 'bash' | 'css';
}

export interface GeneratedModule {
  id: ModuleType;
  title: string;
  tagline: string;
  port: number;
  envVar: string;
  defaultUrl: string;
  description: string;
  summaryApi: string;
  files: CodeFile[];
  sqlSchema: string;
  readme: string;
  packageJson: string;
  envExample: string;
  deploymentChecklist: string[];
}
