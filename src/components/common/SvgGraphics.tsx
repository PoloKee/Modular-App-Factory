import React from 'react';

export const LogoFls: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="32" height="32" rx="8" fill="#0f172a" />
    <path
      d="M8 9H24M8 16H20M8 23H16"
      stroke="#38bdf8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="23" cy="22" r="3" fill="#10b981" />
    <path d="M21.5 22L22.5 23L24.5 21" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GraphicFinance: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => (
  <svg viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgFinance" x1="0" y1="0" x2="360" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="gradEmerald" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#f87171" />
        <stop offset="1" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <rect width="360" height="180" rx="12" fill="url(#bgFinance)" />
    
    {/* Separation Divider Wall */}
    <line x1="180" y1="20" x2="180" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
    
    {/* Left: Business Account Safe Zone */}
    <rect x="25" y="30" width="135" height="120" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
    <text x="35" y="52" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="600">BUSINESS ACCOUNT</text>
    <rect x="35" y="64" width="115" height="20" rx="4" fill="#0f172a" />
    <text x="42" y="78" fill="#34d399" fontSize="9" fontFamily="monospace">AWS Hosting  +$1,420</text>
    <rect x="35" y="90" width="115" height="20" rx="4" fill="#0f172a" />
    <text x="42" y="104" fill="#34d399" fontSize="9" fontFamily="monospace">Gusto Payroll +$11.2k</text>
    <circle cx="140" cy="50" r="4" fill="#10b981" />

    {/* Right: Personal Co-Mingling Warning Zone */}
    <rect x="200" y="30" width="135" height="120" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
    <text x="210" y="52" fill="#94a3b8" fontSize="10" fontFamily="sans-serif" fontWeight="600">PERSONAL VEIL RISK</text>
    <rect x="210" y="64" width="115" height="20" rx="4" fill="#450a0a" stroke="#dc2626" strokeWidth="0.8" />
    <text x="217" y="78" fill="#fca5a5" fontSize="9" fontFamily="monospace">DoorDash      -$64.20</text>
    <rect x="210" y="90" width="115" height="20" rx="4" fill="#450a0a" stroke="#dc2626" strokeWidth="0.8" />
    <text x="217" y="104" fill="#fca5a5" fontSize="9" fontFamily="monospace">Netflix 4K    -$22.99</text>
    <circle cx="315" cy="50" r="4" fill="#ef4444" />

    {/* Firewall Shield in Center */}
    <g transform="translate(165, 75)">
      <circle cx="15" cy="15" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <path d="M15 7L23 11V16C23 21 19.5 25.5 15 27C10.5 25.5 7 21 7 16V11L15 7Z" fill="url(#gradEmerald)" />
      <path d="M12 16L14 18L18 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <text x="180" y="168" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">Corporate Veil Piercing Shield: Active</text>
  </svg>
);

export const GraphicExport: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => (
  <svg viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgExport" x1="0" y1="0" x2="360" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="360" height="180" rx="12" fill="url(#bgExport)" />
    
    {/* Stamped Diligence Folder Dossier */}
    <rect x="60" y="32" width="240" height="116" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1" />
    <rect x="60" y="24" width="90" height="14" rx="4" fill="#334155" />
    <text x="75" y="34" fill="#cbd5e1" fontSize="9" fontFamily="sans-serif" fontWeight="bold">DILIGENCE PACKET</text>
    
    {/* Items rows */}
    <g transform="translate(80, 52)">
      <rect width="200" height="16" rx="3" fill="#0f172a" />
      <text x="8" y="12" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">83(b) Tax Election Proof of Filing</text>
      <circle cx="190" cy="8" r="3.5" fill="#10b981" />
    </g>
    <g transform="translate(80, 74)">
      <rect width="200" height="16" rx="3" fill="#0f172a" />
      <text x="8" y="12" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">Founder IP Assignment (PIIA)</text>
      <circle cx="190" cy="8" r="3.5" fill="#10b981" />
    </g>
    <g transform="translate(80, 96)">
      <rect width="200" height="16" rx="3" fill="#0f172a" />
      <text x="8" y="12" fill="#e2e8f0" fontSize="9" fontFamily="sans-serif">Clean Financial Separation Audit</text>
      <circle cx="190" cy="8" r="3.5" fill="#10b981" />
    </g>

    {/* Cryptographic SHA-256 seal */}
    <rect x="80" y="122" width="200" height="18" rx="4" fill="#090d16" stroke="#0ea5e9" strokeWidth="0.8" />
    <text x="90" y="134" fill="#38bdf8" fontSize="8" fontFamily="monospace">SHA-256: e3b0c44298fc1c149afbf4c8...</text>
  </svg>
);

export const GraphicDigest: React.FC<{ className?: string }> = ({ className = "w-full h-44" }) => (
  <svg viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bgDigest" x1="0" y1="0" x2="360" y2="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="360" height="180" rx="12" fill="url(#bgDigest)" />
    
    {/* Email Envelope Container */}
    <rect x="50" y="25" width="260" height="130" rx="8" fill="#1e293b" stroke="#334155" />
    <path d="M50 25L180 100L310 25" stroke="#475569" strokeWidth="1.5" />
    
    {/* Email inner card */}
    <rect x="75" y="55" width="210" height="85" rx="6" fill="#0f172a" stroke="#1e293b" />
    <text x="90" y="75" fill="#f8fafc" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Founder Monday Dispatch #42</text>
    <text x="90" y="92" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">Clean Books Score: <tspan fill="#34d399" fontWeight="bold">94% (+4%)</tspan></text>
    <text x="90" y="108" fill="#94a3b8" fontSize="9" fontFamily="sans-serif">Pending Actions: <tspan fill="#f59e0b">1 corporate deadline in 47d</tspan></text>
    
    {/* Resend Courier Pulse Badge */}
    <rect x="90" y="120" width="85" height="14" rx="3" fill="#3b82f6" />
    <text x="96" y="130" fill="#ffffff" fontSize="8" fontFamily="monospace">RESEND DISPATCHED</text>
    <circle cx="265" cy="72" r="10" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />
    <path d="M261 72L264 75L269 69" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GraphicFederationTopology: React.FC<{ className?: string }> = ({ className = "w-full h-72" }) => (
  <svg viewBox="0 0 600 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="hubGlow" x1="300" y1="140" x2="300" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f172a" />
        <stop offset="1" stopColor="#020617" />
      </linearGradient>
    </defs>
    <rect width="600" height="280" rx="16" fill="url(#hubGlow)" stroke="#1e293b" strokeWidth="1" />
    
    {/* Interconnecting Connection Lines */}
    <path d="M300 140 L 130 70" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M300 140 L 470 70" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M300 140 L 300 235" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Center Node: HUB */}
    <g transform="translate(300, 140)">
      <circle cx="0" cy="0" r="42" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
      <circle cx="0" cy="0" r="48" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
      <text x="0" y="-8" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">FLS HUB</text>
      <text x="0" y="8" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">ROUTER & PROXY</text>
      <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">:3000</text>
    </g>

    {/* Top-Left Node: FINANCE */}
    <g transform="translate(130, 70)">
      <rect x="-80" y="-35" width="160" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
      <text x="0" y="-12" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">FINANCE MODULE</text>
      <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8.5">GET /api/public/summary</text>
      <text x="0" y="18" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">cleanBooksScore · flagged</text>
    </g>

    {/* Top-Right Node: EXPORT */}
    <g transform="translate(470, 70)">
      <rect x="-80" y="-35" width="160" height="70" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.2" />
      <text x="0" y="-12" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">EXPORT MODULE</text>
      <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8.5">GET /api/public/latest</text>
      <text x="0" y="18" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">readiness · sha256 · dlUrl</text>
    </g>

    {/* Bottom Node: DIGEST */}
    <g transform="translate(300, 235)">
      <rect x="-80" y="-28" width="160" height="56" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="0" y="-10" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">DIGEST MODULE</text>
      <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8.5">POST /api/public/preview</text>
      <text x="0" y="16" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">weekly delta HTML email</text>
    </g>

    {/* Security Annotation */}
    <text x="300" y="24" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
      Trusted Peer Protocol: X-FLS-Company-Id + X-FLS-Shared-Secret
    </text>
  </svg>
);
