import { Transaction, ExportPacket, DigestPreviewData } from '../types';

export interface CompanyProfile {
  id: string;
  name: string;
  incorporationDate: string;
  jurisdiction: string;
  cleanBooksScore: number;
  flaggedCount: number;
  txnCount: number;
  readinessScore: number;
  lastExportDate: string;
  lastDigestSent: string;
  deltaSummary: string;
  sha256Hash: string;
}

export const DEMO_COMPANIES: Record<string, CompanyProfile> = {
  'demo-company': {
    id: 'demo-company',
    name: 'VentureStack Technologies, Inc.',
    incorporationDate: '2025-04-12',
    jurisdiction: 'Delaware C-Corp',
    cleanBooksScore: 94,
    flaggedCount: 3,
    txnCount: 142,
    readinessScore: 88,
    lastExportDate: 'Oct 11, 2026',
    lastDigestSent: 'Yesterday 08:00 AM',
    deltaSummary: '+4% separation (2 personal flags remediated)',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  'atlas-robotics': {
    id: 'atlas-robotics',
    name: 'Atlas Autonomous Robotics Co.',
    incorporationDate: '2024-11-03',
    jurisdiction: 'Delaware C-Corp',
    cleanBooksScore: 98,
    flaggedCount: 1,
    txnCount: 312,
    readinessScore: 95,
    lastExportDate: 'Oct 09, 2026',
    lastDigestSent: 'Monday 08:00 AM',
    deltaSummary: '+2% separation (Audit clean)',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  'hyperion-ai': {
    id: 'hyperion-ai',
    name: 'Hyperion Synthetics LLC',
    incorporationDate: '2026-01-15',
    jurisdiction: 'Delaware LLC',
    cleanBooksScore: 78,
    flaggedCount: 8,
    txnCount: 89,
    readinessScore: 72,
    lastExportDate: 'Oct 02, 2026',
    lastDigestSent: 'Last week',
    deltaSummary: '-6% drop (personal subscriptions detected on Mercury debit)',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  }
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-101',
    date: '2026-10-12',
    description: 'Amazon Web Services - Cloud Hosting',
    amount: 1420.50,
    type: 'debit',
    category: 'Cloud Infrastructure',
    flaggedCoMingling: false,
    resolved: false
  },
  {
    id: 'txn-102',
    date: '2026-10-11',
    description: 'DoorDash - Dinner (Personal Residence)',
    amount: 64.20,
    type: 'debit',
    category: 'Meals & Entertainment',
    flaggedCoMingling: true,
    reason: 'Food delivery to residential address without logged client or team attendee.',
    resolved: false
  },
  {
    id: 'txn-103',
    date: '2026-10-10',
    description: 'GitHub Enterprise Subscription',
    amount: 210.00,
    type: 'debit',
    category: 'Software & Tools',
    flaggedCoMingling: false,
    resolved: false
  },
  {
    id: 'txn-104',
    date: '2026-10-09',
    description: 'Netflix 4K Premium Plan',
    amount: 22.99,
    type: 'debit',
    category: 'Subscriptions',
    flaggedCoMingling: true,
    reason: 'Personal streaming entertainment subscription billed on corporate card.',
    resolved: false
  },
  {
    id: 'txn-105',
    date: '2026-10-08',
    description: 'Stripe Merchant Payout (MRR)',
    amount: 18500.00,
    type: 'credit',
    category: 'Operating Revenue',
    flaggedCoMingling: false,
    resolved: false
  },
  {
    id: 'txn-106',
    date: '2026-10-07',
    description: 'Founder Zelle Transfer to Personal Chase',
    amount: 2500.00,
    type: 'debit',
    category: 'Transfers',
    flaggedCoMingling: true,
    reason: 'Undocumented direct transfer to personal account without payroll memo or formal loan resolution.',
    resolved: false
  },
  {
    id: 'txn-107',
    date: '2026-10-06',
    description: 'Google Workspace Enterprise',
    amount: 72.00,
    type: 'debit',
    category: 'Software & Tools',
    flaggedCoMingling: false,
    resolved: false
  },
  {
    id: 'txn-108',
    date: '2026-10-05',
    description: 'Gusto Payroll Taxes & Salaries',
    amount: 11200.00,
    type: 'debit',
    category: 'Payroll',
    flaggedCoMingling: false,
    resolved: false
  }
];

export const SAMPLE_PACKET: ExportPacket = {
  id: 'pkt_9921_oct26',
  companyId: 'demo-company',
  version: '2026.10.4',
  createdAt: '2026-10-11T14:30:00Z',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  readinessScore: 88,
  items: [
    { name: 'Delaware Certificate of Incorporation & Stamped Articles', status: 'verified', size: '2.4 MB', updatedAt: '2025-04-14' },
    { name: 'Executed 83(b) Tax Election Proof of Mailing & Receipt', status: 'verified', size: '1.1 MB', updatedAt: '2025-04-20' },
    { name: 'Founder Proprietary Information & Inventions Agreement (PIIA)', status: 'verified', size: '890 KB', updatedAt: '2025-04-15' },
    { name: 'Post-Money Safe Investment Agreements (Series Angel)', status: 'verified', size: '3.6 MB', updatedAt: '2025-09-01' },
    { name: 'Clean Financial Separation Audit Report (Co-mingling index: 94%)', status: 'verified', size: '1.4 MB', updatedAt: '2026-10-11' },
    { name: 'Delaware Annual Franchise Tax Filing Confirmation', status: 'pending', size: '—', updatedAt: 'Due March 1, 2027' }
  ]
};

export const SAMPLE_DIGEST: DigestPreviewData = {
  companyId: 'demo-company',
  weekNumber: 42,
  year: 2026,
  generatedAt: 'Monday, Oct 12, 2026, 8:00 AM UTC',
  cleanBooksScore: 94,
  cleanBooksDelta: '+4%',
  resolvedItemsCount: 2,
  flaggedItemsCount: 3,
  readinessStatus: 'Venture Ready (88%)',
  upcomingDeadlines: [
    { title: 'Delaware Annual Franchise Tax & Report', dueDate: 'March 1, 2027', daysRemaining: 138, jurisdiction: 'Delaware Division of Corporations' },
    { title: 'Quarterly Federal Estimated Tax (Form 1120-W)', dueDate: 'Dec 15, 2026', daysRemaining: 62, jurisdiction: 'IRS' },
    { title: 'Registered Agent Annual Representation Renewal', dueDate: 'Nov 30, 2026', daysRemaining: 47, jurisdiction: 'Harvard Business Services' }
  ]
};
