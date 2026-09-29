import fs from 'fs';
import path from 'path';
import { ALL_SEED_PRODUCTS } from '../server/seed/products';

const outputDir = path.resolve(process.cwd(), 'public/images/products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

const THEMES: Record<string, { primary: string; secondary: string; accent: string; body: string }> = {
  hyundai: { primary: '#002C5F', secondary: '#00AAD2', accent: '#00E5FF', body: '#FFFFFF' },
  tcl: { primary: '#E31B23', secondary: '#1A1A1A', accent: '#FFD700', body: '#F8F9FA' },
  midea: { primary: '#0070BA', secondary: '#002B49', accent: '#00D1B2', body: '#F0F4F8' },
  pel: { primary: '#004B87', secondary: '#D9272E', accent: '#FFB81C', body: '#FFFFFF' },
  orient: { primary: '#D32F2F', secondary: '#1E293B', accent: '#F59E0B', body: '#0F172A' },
  hisense: { primary: '#009688', secondary: '#1B5E20', accent: '#80CBC4', body: '#F1F5F9' },
  haier: { primary: '#005BBB', secondary: '#003366', accent: '#00A3E0', body: '#FFFFFF' },
  gree: { primary: '#009944', secondary: '#004D20', accent: '#80E27E', body: '#FFFFFF' },
  samsung: { primary: '#1428A0', secondary: '#000000', accent: '#29B6F6', body: '#0A0A0A' },
  sony: { primary: '#000000', secondary: '#E50914', accent: '#FFFFFF', body: '#111827' },
  dawlance: { primary: '#00529B', secondary: '#C41230', accent: '#FFC72C', body: '#E2E8F0' },
  kenwood: { primary: '#E30613', secondary: '#231F20', accent: '#A6A6A6', body: '#333333' },
  xiaomi: { primary: '#FF6900', secondary: '#191919', accent: '#00C4B4', body: '#262626' },
  apple: { primary: '#1D1D1F', secondary: '#86868B', accent: '#2997FF', body: '#F5F5F7' },
  nasgas: { primary: '#C2410C', secondary: '#7C2D12', accent: '#FDBA74', body: '#1E293B' },
  superasia: { primary: '#1E40AF', secondary: '#1E3A8A', accent: '#60A5FA', body: '#FFFFFF' },
  canon: { primary: '#B91C1C', secondary: '#7F1D1D', accent: '#FCA5A5', body: '#18181B' },
  fischer: { primary: '#0369A1', secondary: '#075985', accent: '#7DD3FC', body: '#F8FAFC' },
  boss: { primary: '#047857', secondary: '#064E3B', accent: '#6EE7B7', body: '#FFFFFF' },
  pakfans: { primary: '#0F766E', secondary: '#115E59', accent: '#5EEAD4', body: '#F1F5F9' },
  philips: { primary: '#0284C7', secondary: '#0369A1', accent: '#38BDF8', body: '#FFFFFF' },
  panasonic: { primary: '#1D4ED8', secondary: '#1E3A8A', accent: '#93C5FD', body: '#1E293B' },
  westpoint: { primary: '#B45309', secondary: '#78350F', accent: '#FCD34D', body: '#FFFFFF' },
  hitachi: { primary: '#DC2626', secondary: '#991B1B', accent: '#F87171', body: '#1F2937' },
  dell: { primary: '#0076CE', secondary: '#004B87', accent: '#60A5FA', body: '#E2E8F0' },
  hp: { primary: '#0096D6', secondary: '#006699', accent: '#38BDF8', body: '#E2E8F0' },
  lenovo: { primary: '#E2231A', secondary: '#000000', accent: '#FFFFFF', body: '#18181B' },
  oppo: { primary: '#008B45', secondary: '#00552B', accent: '#00E676', body: '#0A0A0A' },
  vivo: { primary: '#415FFF', secondary: '#1B35D4', accent: '#8599FF', body: '#0A0A0A' },
  realme: { primary: '#FFC915', secondary: '#1A1A1A', accent: '#FFE066', body: '#0F172A' },
  infinix: { primary: '#10B981', secondary: '#047857', accent: '#34D399', body: '#111827' },
  tecno: { primary: '#0284C7', secondary: '#0369A1', accent: '#38BDF8', body: '#0F172A' },
  powermax: { primary: '#DC2626', secondary: '#111827', accent: '#F87171', body: '#18181B' },
  default: { primary: '#1261A0', secondary: '#071A2B', accent: '#00E5FF', body: '#FFFFFF' }
};

function getTheme(brand: string) {
  const b = (brand || '').toLowerCase().replace(/[^a-z]/g, '');
  return THEMES[b] || THEMES.default;
}

// 1. Air Conditioner
function generateAC(p: any): string {
  const theme = getTheme(p.brand);
  const temp = (p.name.includes('1.0') || p.name.includes('1 Ton')) ? '18°C' : '22°C';
  const ton = (p.name.includes('1.0') || p.name.includes('1 Ton')) ? '1.0 TON' : '1.5 TON';
  const isDark = p.slug.includes('orient-evo') || p.slug.includes('black');
  const chassisBg = isDark ? '#1E293B' : '#FFFFFF';
  const chassisStroke = isDark ? '#334155' : '#CBD5E1';
  const textCol = isDark ? '#F8FAFC' : '#1E293B';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="chassis_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${chassisBg}"/>
      <stop offset="100%" stop-color="${isDark ? '#0F172A' : '#F1F5F9'}"/>
    </linearGradient>
    <filter id="sh_${p.slug}" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.15"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>
  <circle cx="300" cy="280" r="220" fill="#E0F2FE" opacity="0.6"/>
  <path d="M 120 370 Q 300 440 480 370" fill="none" stroke="#BAE6FD" stroke-width="6" opacity="0.7" stroke-dasharray="12 8"/>
  <path d="M 150 400 Q 300 470 450 400" fill="none" stroke="#7DD3FC" stroke-width="4" opacity="0.5" stroke-dasharray="16 10"/>

  <g filter="url(#sh_${p.slug})">
    <rect x="70" y="210" width="460" height="135" rx="16" fill="url(#chassis_${p.slug})" stroke="${chassisStroke}" stroke-width="2"/>
    <g opacity="0.4">
      <line x1="100" y1="225" x2="500" y2="225" stroke="${isDark ? '#475569' : '#94A3B8'}" stroke-width="2"/>
      <line x1="100" y1="233" x2="500" y2="233" stroke="${isDark ? '#475569' : '#94A3B8'}" stroke-width="2"/>
      <line x1="100" y1="241" x2="500" y2="241" stroke="${isDark ? '#475569' : '#94A3B8'}" stroke-width="2"/>
    </g>
    <rect x="85" y="315" width="430" height="18" rx="5" fill="${isDark ? '#0F172A' : '#E2E8F0'}" stroke="${isDark ? '#334155' : '#CBD5E1'}" stroke-width="1.5"/>
    <line x1="90" y1="324" x2="510" y2="324" stroke="#38BDF8" stroke-width="2" opacity="0.8"/>
    <rect x="70" y="295" width="460" height="4" fill="${theme.accent}"/>

    <text x="110" y="278" font-family="'Outfit', sans-serif" font-size="20" font-weight="900" fill="${theme.primary}" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
    <text x="110" y="295" font-family="sans-serif" font-size="10" font-weight="700" fill="${textCol}" opacity="0.6">
      DC INVERTER T3
    </text>

    <rect x="420" y="255" width="75" height="38" rx="8" fill="${isDark ? '#020617' : '#0F172A'}"/>
    <text x="457" y="281" font-family="'Courier New', monospace" font-size="22" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      ${temp}
    </text>
  </g>

  <g transform="translate(180, 480)">
    <rect x="0" y="0" width="110" height="34" rx="17" fill="#0284C7"/>
    <text x="55" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${ton}</text>

    <rect x="130" y="0" width="110" height="34" rx="17" fill="#10B981"/>
    <text x="185" y="22" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">60% SAVING</text>
  </g>
</svg>`;
}

// 2. LED & QLED TVs
function generateTV(p: any): string {
  const theme = getTheme(p.brand);
  let size = '43" 4K UHD';
  if (p.name.includes('32')) size = '32" SMART HD';
  else if (p.name.includes('55')) size = '55" QLED 4K';
  else if (p.name.includes('65')) size = '65" QLED 4K';
  else if (p.name.includes('40')) size = '40" FULL HD';

  const scenes = [
    { from: '#1E1B4B', mid: '#4338CA', to: '#06B6D4' },
    { from: '#0F172A', mid: '#BE185D', to: '#F59E0B' },
    { from: '#064E3B', mid: '#059669', to: '#34D399' },
    { from: '#450A0A', mid: '#B91C1C', to: '#F97316' },
    { from: '#0C4A6E', mid: '#0284C7', to: '#38BDF8' }
  ];
  const sIdx = Math.abs(p.name.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % scenes.length;
  const sc = scenes[sIdx];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="sc_${p.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${sc.from}"/>
      <stop offset="50%" stop-color="${sc.mid}"/>
      <stop offset="100%" stop-color="${sc.to}"/>
    </linearGradient>
    <filter id="tvSh_${p.slug}" x="-5%" y="-5%" width="110%" height="120%">
      <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#tvSh_${p.slug})">
    <polygon points="150,445 130,480 145,480 160,445" fill="#71717A"/>
    <polygon points="450,445 440,445 455,480 470,480" fill="#71717A"/>

    <rect x="65" y="140" width="470" height="305" rx="8" fill="#18181B" stroke="#3F3F46" stroke-width="2"/>
    <rect x="73" y="148" width="454" height="280" rx="4" fill="url(#sc_${p.slug})"/>

    <circle cx="390" cy="240" r="90" fill="#FFFFFF" opacity="0.15"/>
    <path d="M 73 340 Q 200 240 340 310 T 527 280 L 527 428 L 73 428 Z" fill="#000000" opacity="0.3"/>
    <path d="M 73 370 Q 250 280 400 350 T 527 330 L 527 428 L 73 428 Z" fill="#000000" opacity="0.4"/>

    <rect x="425" y="165" width="85" height="26" rx="6" fill="#000000" opacity="0.6"/>
    <text x="467" y="183" font-family="'Outfit', sans-serif" font-size="12" font-weight="900" fill="#FACC15" text-anchor="middle">
      4K HDR
    </text>

    <circle cx="100" cy="178" r="8" fill="#FFFFFF" opacity="0.8"/>
    <text x="115" y="182" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" opacity="0.9">SMART TV</text>

    <rect x="65" y="428" width="470" height="17" fill="#18181B"/>
    <text x="300" y="440" font-family="'Outfit', sans-serif" font-size="10" font-weight="800" fill="#E4E4E7" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
  </g>

  <g transform="translate(230, 510)">
    <rect x="0" y="0" width="140" height="34" rx="17" fill="#1E293B"/>
    <text x="70" y="22" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      ${size}
    </text>
  </g>
</svg>`;
}

// 3. Refrigerators
function generateFridge(p: any): string {
  const theme = getTheme(p.brand);
  const isDark = p.slug.includes('mirror') || p.slug.includes('black') || p.slug.includes('burgundy');
  const bodyColor = isDark ? '#1E293B' : (p.slug.includes('chrome') ? '#94A3B8' : '#F1F5F9');
  const doorStart = isDark ? '#334155' : '#FFFFFF';
  const doorEnd = isDark ? '#0F172A' : '#CBD5E1';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="dr_${p.slug}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${doorStart}"/>
      <stop offset="70%" stop-color="${bodyColor}"/>
      <stop offset="100%" stop-color="${doorEnd}"/>
    </linearGradient>
    <filter id="fSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#fSh_${p.slug})">
    <rect x="200" y="505" width="30" height="15" rx="4" fill="#334155"/>
    <rect x="370" y="505" width="30" height="15" rx="4" fill="#334155"/>

    <rect x="180" y="90" width="240" height="420" rx="14" fill="#0F172A"/>

    <rect x="185" y="95" width="230" height="150" rx="10" fill="url(#dr_${p.slug})" stroke="#64748B" stroke-width="1.5"/>
    <rect x="195" y="210" width="55" height="10" rx="3" fill="#94A3B8"/>

    <text x="300" y="130" font-family="'Outfit', sans-serif" font-size="14" font-weight="900" fill="${theme.primary}" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
    <text x="300" y="145" font-family="sans-serif" font-size="9" font-weight="700" fill="#64748B" text-anchor="middle">
      INVERTER FROST FREE
    </text>

    <rect x="185" y="255" width="230" height="250" rx="10" fill="url(#dr_${p.slug})" stroke="#64748B" stroke-width="1.5"/>
    <rect x="195" y="270" width="55" height="10" rx="3" fill="#94A3B8"/>

    <rect x="255" y="300" width="90" height="100" rx="8" fill="#0F172A" stroke="#475569" stroke-width="2"/>
    <path d="M 285 330 Q 300 350 315 330" fill="none" stroke="#38BDF8" stroke-width="3"/>
    <text x="300" y="380" font-family="sans-serif" font-size="9" font-weight="bold" fill="#38BDF8" text-anchor="middle">DISPENSER</text>
  </g>

  <g transform="translate(235, 530)">
    <rect x="0" y="0" width="130" height="34" rx="17" fill="#0F172A"/>
    <text x="65" y="22" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" fill="#10B981" text-anchor="middle">
      ECO INVERTER
    </text>
  </g>
</svg>`;
}

// 4. Water Dispensers
function generateWaterDispenser(p: any): string {
  const theme = getTheme(p.brand);
  const isGold = p.slug.includes('champagne');
  const isRed = p.slug.includes('red');
  const accentCol = isGold ? '#D97706' : (isRed ? '#DC2626' : theme.primary);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="disp_${p.slug}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="dSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#dSh_${p.slug})">
    <!-- Top Water Bottle (Inverted) -->
    <path d="M 270 70 L 330 70 L 340 100 L 360 110 L 360 170 L 240 170 L 240 110 L 260 100 Z" fill="#38BDF8" opacity="0.6" stroke="#0284C7" stroke-width="2"/>
    <line x1="250" y1="130" x2="350" y2="130" stroke="#FFFFFF" stroke-width="2" opacity="0.5"/>

    <!-- Dispenser Tower Body -->
    <rect x="220" y="170" width="160" height="340" rx="12" fill="url(#disp_${p.slug})" stroke="#94A3B8" stroke-width="2"/>

    <!-- Brand Header -->
    <text x="300" y="200" font-family="'Outfit', sans-serif" font-size="14" font-weight="900" fill="${theme.primary}" text-anchor="middle" letter-spacing="1">
      ${escapeXml(p.brand.toUpperCase())}
    </text>

    <!-- Tap Niche -->
    <rect x="240" y="220" width="120" height="85" rx="8" fill="#1E293B"/>

    <!-- 3 Taps: Hot (Red), Normal (Green), Cold (Blue) -->
    <circle cx="260" cy="245" r="10" fill="#EF4444"/>
    <rect x="257" y="255" width="6" height="15" rx="2" fill="#DC2626"/>

    <circle cx="300" cy="245" r="10" fill="#10B981"/>
    <rect x="297" y="255" width="6" height="15" rx="2" fill="#059669"/>

    <circle cx="340" cy="245" r="10" fill="#0284C7"/>
    <rect x="337" y="255" width="6" height="15" rx="2" fill="#0369A1"/>

    <!-- Drip Tray Grill -->
    <rect x="245" y="290" width="110" height="8" rx="2" fill="#475569"/>

    <!-- Lower Refrigerator / Storage Cabinet Glass Door -->
    <rect x="235" y="325" width="130" height="165" rx="8" fill="${accentCol}" opacity="0.85" stroke="#475569" stroke-width="2"/>
    <rect x="350" y="380" width="8" height="45" rx="3" fill="#E2E8F0"/>
    <text x="300" y="415" font-family="'Outfit', sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      MINI FRIDGE
    </text>
  </g>

  <g transform="translate(230, 530)">
    <rect x="0" y="0" width="140" height="34" rx="17" fill="#0284C7"/>
    <text x="70" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      3-TAP SYSTEM
    </text>
  </g>
</svg>`;
}

// 5. Kitchen Appliances (Hoods, Ranges, Hobs, Air Fryers, Built-in Ovens)
function generateKitchen(p: any): string {
  const theme = getTheme(p.brand);
  const isHood = p.slug.includes('hood');
  const isRange = p.slug.includes('range');
  const isAirFryer = p.slug.includes('fryer');
  const isHob = p.slug.includes('hob') || p.slug.includes('cooker') || p.slug.includes('plate');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="kSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#kSh_${p.slug})">
    ${isHood ? `
      <!-- Chimney Duct -->
      <rect x="250" y="110" width="100" height="150" fill="#334155" stroke="#475569" stroke-width="2"/>
      <!-- Angled Glass Canopy -->
      <polygon points="120,340 480,340 430,260 170,260" fill="#0F172A" stroke="#334155" stroke-width="3"/>
      <!-- LED Bar & Touch Controls -->
      <rect x="180" y="320" width="240" height="14" rx="4" fill="#38BDF8" opacity="0.8"/>
      <text x="300" y="295" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        ${escapeXml(p.brand.toUpperCase())}
      </text>
      <!-- Baffle Filter Grate -->
      <line x1="200" y1="350" x2="400" y2="350" stroke="#94A3B8" stroke-width="4"/>
    ` : isRange ? `
      <!-- 5-Burner Cooking Range -->
      <rect x="160" y="150" width="280" height="340" rx="14" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
      <!-- Top Cooktop with Cast Iron Grates -->
      <rect x="160" y="150" width="280" height="60" rx="8" fill="#1E293B"/>
      <circle cx="210" cy="180" r="16" fill="#334155" stroke="#E2E8F0" stroke-width="2"/>
      <circle cx="300" cy="180" r="22" fill="#334155" stroke="#F59E0B" stroke-width="3"/>
      <circle cx="390" cy="180" r="16" fill="#334155" stroke="#E2E8F0" stroke-width="2"/>
      <!-- Control Knobs -->
      <rect x="160" y="215" width="280" height="40" fill="#334155"/>
      <circle cx="200" cy="235" r="9" fill="#94A3B8"/>
      <circle cx="250" cy="235" r="9" fill="#94A3B8"/>
      <circle cx="300" cy="235" r="11" fill="#F59E0B"/>
      <circle cx="350" cy="235" r="9" fill="#94A3B8"/>
      <circle cx="400" cy="235" r="9" fill="#94A3B8"/>
      <!-- Double Glass Oven Window -->
      <rect x="180" y="275" width="240" height="190" rx="10" fill="#0F172A" stroke="#475569" stroke-width="3"/>
      <rect x="205" y="300" width="190" height="140" rx="6" fill="#334155" opacity="0.6"/>
      <text x="300" y="380" font-family="'Outfit', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        ${escapeXml(p.brand.toUpperCase())}
      </text>
    ` : isAirFryer ? `
      <!-- Modern Touch Air Fryer -->
      <rect x="190" y="140" width="220" height="340" rx="35" fill="#18181B" stroke="#27272A" stroke-width="3"/>
      <!-- Digital Touch Display Window -->
      <rect x="220" y="175" width="160" height="80" rx="14" fill="#09090B" stroke="#F59E0B" stroke-width="2"/>
      <text x="300" y="215" font-family="'Courier New', monospace" font-size="28" font-weight="bold" fill="#F59E0B" text-anchor="middle">
        200°C
      </text>
      <text x="300" y="240" font-family="sans-serif" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">
        18 MIN | AIR FRY
      </text>
      <!-- Pull-out Basket with Rose Gold Handle -->
      <rect x="210" y="280" width="180" height="170" rx="18" fill="#27272A" stroke="#3F3F46" stroke-width="2"/>
      <rect x="285" y="315" width="30" height="85" rx="8" fill="#D97706"/>
      <text x="300" y="470" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#A1A1AA" text-anchor="middle">
        ${escapeXml(p.brand.toUpperCase())} 5L
      </text>
    ` : `
      <!-- Built-in Hob / Hot Plate -->
      <rect x="130" y="190" width="340" height="230" rx="18" fill="#0F172A" stroke="#334155" stroke-width="4"/>
      <circle cx="210" cy="305" r="55" fill="#1E293B" stroke="#EF4444" stroke-width="3"/>
      <circle cx="210" cy="305" r="30" fill="#EF4444" opacity="0.6"/>
      <circle cx="370" cy="305" r="65" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
      <circle cx="370" cy="305" r="40" fill="#38BDF8" opacity="0.6"/>
      <text x="300" y="240" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        ${escapeXml(p.brand.toUpperCase())}
      </text>
    `}
  </g>

  <g transform="translate(210, 525)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#1E293B"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#F59E0B" text-anchor="middle">
      PREMIUM KITCHEN
    </text>
  </g>
</svg>`;
}

// 6. Microwaves
function generateMicrowave(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="mwChassis_${p.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <filter id="mwSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#mwSh_${p.slug})">
    <rect x="170" y="445" width="25" height="15" rx="3" fill="#1E293B"/>
    <rect x="405" y="445" width="25" height="15" rx="3" fill="#1E293B"/>

    <rect x="110" y="170" width="380" height="280" rx="16" fill="url(#mwChassis_${p.slug})" stroke="#475569" stroke-width="3"/>

    <!-- Left Glass Window Door -->
    <rect x="130" y="195" width="230" height="230" rx="10" fill="#020617" stroke="#334155" stroke-width="2"/>
    <rect x="150" y="215" width="190" height="190" rx="6" fill="#1E293B" opacity="0.6"/>
    <circle cx="245" cy="310" r="60" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="10 6"/>

    <!-- Right Control Panel -->
    <rect x="380" y="195" width="90" height="230" rx="8" fill="#1E293B"/>
    <rect x="390" y="210" width="70" height="35" rx="6" fill="#020617"/>
    <text x="425" y="234" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#10B981" text-anchor="middle">
      12:30
    </text>

    <!-- Rotary Dial Knob -->
    <circle cx="425" cy="285" r="22" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
    <circle cx="425" cy="285" r="8" fill="#F59E0B"/>

    <!-- Buttons Grid -->
    <circle cx="405" cy="340" r="7" fill="#64748B"/>
    <circle cx="445" cy="340" r="7" fill="#64748B"/>
    <circle cx="405" cy="370" r="7" fill="#64748B"/>
    <circle cx="445" cy="370" r="7" fill="#64748B"/>
    <circle cx="405" cy="400" r="7" fill="#EF4444"/>
    <circle cx="445" cy="400" r="7" fill="#10B981"/>

    <!-- Brand Typography Header -->
    <text x="245" y="160" font-family="'Outfit', sans-serif" font-size="18" font-weight="900" fill="${theme.primary}" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
  </g>

  <g transform="translate(220, 505)">
    <rect x="0" y="0" width="160" height="34" rx="17" fill="#0F172A"/>
    <text x="80" y="22" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" fill="#F59E0B" text-anchor="middle">
      GRILL &amp; BAKE
    </text>
  </g>
</svg>`;
}

// 7. Washing Machines
function generateWasher(p: any): string {
  const theme = getTheme(p.brand);
  const isFrontLoad = p.name.toLowerCase().includes('front load');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="wMetal_${p.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <filter id="wSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="18" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#wSh_${p.slug})">
    <rect x="180" y="495" width="30" height="15" rx="4" fill="#334155"/>
    <rect x="390" y="495" width="30" height="15" rx="4" fill="#334155"/>

    <rect x="160" y="110" width="280" height="390" rx="18" fill="url(#wMetal_${p.slug})" stroke="#94A3B8" stroke-width="2"/>

    <!-- Top Control Console -->
    <rect x="160" y="110" width="280" height="75" rx="18" fill="#1E293B"/>
    <text x="215" y="152" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" letter-spacing="1">
      ${escapeXml(p.brand.toUpperCase())}
    </text>

    <!-- Dial Knob -->
    <circle cx="340" cy="148" r="18" fill="#38BDF8" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="390" cy="148" r="10" fill="#10B981"/>

    ${isFrontLoad ? `
      <!-- Front Loader Circular Glass Porthole -->
      <circle cx="300" cy="330" r="105" fill="#334155" stroke="#94A3B8" stroke-width="8"/>
      <circle cx="300" cy="330" r="85" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
      <circle cx="300" cy="330" r="55" fill="none" stroke="#64748B" stroke-width="3" stroke-dasharray="8 6"/>
      <path d="M 270 310 Q 300 280 330 310 Q 300 360 270 310" fill="#38BDF8" opacity="0.4"/>
    ` : `
      <!-- Top Loader Glass Door Facade -->
      <rect x="185" y="205" width="230" height="260" rx="12" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="205" y="225" width="190" height="120" rx="8" fill="#38BDF8" opacity="0.15" stroke="#38BDF8" stroke-width="2"/>
      <circle cx="300" cy="285" r="45" fill="#0284C7" opacity="0.7"/>
      <line x1="220" y1="380" x2="380" y2="380" stroke="#94A3B8" stroke-width="2"/>
      <text x="300" y="415" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0369A1" text-anchor="middle">
        FUZZY LOGIC CONTROL
      </text>
    `}
  </g>

  <g transform="translate(230, 525)">
    <rect x="0" y="0" width="140" height="34" rx="17" fill="#0284C7"/>
    <text x="70" y="22" font-family="'Outfit', sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      AUTOMATIC
    </text>
  </g>
</svg>`;
}

// 8. Geysers
function generateGeyser(p: any): string {
  const theme = getTheme(p.brand);
  const isStorage = p.slug.includes('storage') || p.slug.includes('gallon');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="gySh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#gySh_${p.slug})">
    ${isStorage ? `
      <!-- Cylindrical Storage Geyser -->
      <rect x="210" y="100" width="180" height="380" rx="35" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
      <circle cx="300" cy="200" r="35" fill="#FFFFFF" stroke="#EF4444" stroke-width="3"/>
      <text x="300" y="206" font-family="'Courier New', monospace" font-size="16" font-weight="bold" fill="#EF4444" text-anchor="middle">
        65°C
      </text>
      <!-- Pipes on bottom -->
      <rect x="250" y="480" width="20" height="30" fill="#0284C7"/>
      <rect x="330" y="480" width="20" height="30" fill="#EF4444"/>
    ` : `
      <!-- Instant Gas Water Heater -->
      <rect x="180" y="120" width="240" height="360" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
      <!-- Copper Flame Viewing Window -->
      <circle cx="300" cy="240" r="35" fill="#0F172A" stroke="#EA580C" stroke-width="3"/>
      <path d="M 300 220 Q 315 240 300 255 Q 285 240 300 220 Z" fill="#F97316"/>
      <!-- Digital Temp Display -->
      <rect x="255" y="300" width="90" height="38" rx="8" fill="#020617"/>
      <text x="300" y="326" font-family="'Courier New', monospace" font-size="22" font-weight="bold" fill="#38BDF8" text-anchor="middle">
        42°C
      </text>
      <!-- Dual Knobs (Water & Gas) -->
      <circle cx="250" cy="385" r="18" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
      <circle cx="350" cy="385" r="18" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
    `}

    <text x="300" y="165" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="${theme.primary}" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
  </g>

  <g transform="translate(210, 520)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#EA580C"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      INSTANT HOT WATER
    </text>
  </g>
</svg>`;
}

// 9. Air Coolers
function generateAirCooler(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="acSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#acSh_${p.slug})">
    <!-- Caster Wheels -->
    <circle cx="210" cy="515" r="14" fill="#334155"/>
    <circle cx="390" cy="515" r="14" fill="#334155"/>

    <!-- Cooler Body -->
    <rect x="180" y="110" width="240" height="395" rx="18" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>

    <!-- Top Ice Chamber / Control Lid -->
    <rect x="180" y="110" width="240" height="65" rx="18" fill="${theme.primary}"/>
    <text x="300" y="145" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
    <circle cx="220" cy="140" r="6" fill="#38BDF8"/>
    <circle cx="380" cy="140" r="6" fill="#38BDF8"/>

    <!-- Oscillating Louvers / Grille -->
    <rect x="205" y="195" width="190" height="190" rx="12" fill="#1E293B"/>
    <g stroke="#38BDF8" stroke-width="3" opacity="0.8">
      <line x1="225" y1="220" x2="375" y2="220"/>
      <line x1="225" y1="245" x2="375" y2="245"/>
      <line x1="225" y1="270" x2="375" y2="270"/>
      <line x1="225" y1="295" x2="375" y2="295"/>
      <line x1="225" y1="320" x2="375" y2="320"/>
      <line x1="225" y1="345" x2="375" y2="345"/>
      <line x1="225" y1="370" x2="375" y2="370"/>
    </g>

    <!-- Water Tank Level Indicator -->
    <rect x="205" y="415" width="190" height="60" rx="8" fill="#E2E8F0"/>
    <rect x="285" y="425" width="30" height="40" rx="4" fill="#0284C7" opacity="0.6"/>
  </g>

  <g transform="translate(210, 540)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#0284C7"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      TURBO AIR COOLER
    </text>
  </g>
</svg>`;
}

// 10. Air Purifiers
function generateAirPurifier(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="apSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#apSh_${p.slug})">
    <!-- Cylindrical Tower Body -->
    <rect x="210" y="110" width="180" height="380" rx="28" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

    <!-- Circular OLED Display with AQI Ring -->
    <circle cx="300" cy="190" r="38" fill="#020617" stroke="#10B981" stroke-width="4"/>
    <text x="300" y="196" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="#10B981" text-anchor="middle">
      012
    </text>
    <text x="300" y="212" font-family="sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      PM 2.5
    </text>

    <!-- 360 Degree Micro Air Ingestion Mesh -->
    <g fill="#94A3B8" opacity="0.6">
      ${Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) =>
          `<circle cx="${240 + c * 17}" cy="${270 + r * 22}" r="3"/>`
        ).join('')
      ).join('')}
    </g>

    <!-- Brand Typography Header -->
    <text x="300" y="445" font-family="'Outfit', sans-serif" font-size="14" font-weight="900" fill="${theme.primary}" text-anchor="middle" letter-spacing="1">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
  </g>

  <g transform="translate(210, 520)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#10B981"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      TRUE HEPA FILTER
    </text>
  </g>
</svg>`;
}

// 11. Vacuum Cleaners
function generateVacuum(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="vcSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#vcSh_${p.slug})">
    <!-- Heavy Duty Drum Vacuum -->
    <circle cx="230" cy="455" r="25" fill="#334155" stroke="#94A3B8" stroke-width="3"/>
    <circle cx="370" cy="455" r="25" fill="#334155" stroke="#94A3B8" stroke-width="3"/>

    <!-- Drum Body -->
    <rect x="200" y="210" width="200" height="240" rx="20" fill="#E2E8F0" stroke="#64748B" stroke-width="3"/>
    <rect x="200" y="210" width="200" height="70" rx="16" fill="${theme.primary}"/>

    <text x="300" y="250" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
    <text x="300" y="340" font-family="'Outfit', sans-serif" font-size="24" font-weight="900" fill="#0F172A" text-anchor="middle">
      2000W
    </text>
    <text x="300" y="370" font-family="sans-serif" font-size="11" font-weight="bold" fill="#64748B" text-anchor="middle">
      CYCLONIC SUCTION
    </text>

    <!-- Telescopic Hose Connector -->
    <path d="M 220 280 C 130 250, 130 140, 240 120 L 400 120" fill="none" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
  </g>

  <g transform="translate(210, 520)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#0F172A"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      HEAVY DUTY DRUM
    </text>
  </g>
</svg>`;
}

// 12. Laptops
function generateLaptop(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="lpScreen_${p.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="50%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="lpSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#lpSh_${p.slug})">
    <!-- Laptop Lid / Screen -->
    <rect x="120" y="130" width="360" height="230" rx="10" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <rect x="130" y="140" width="340" height="210" rx="4" fill="url(#lpScreen_${p.slug})"/>

    <circle cx="300" cy="245" r="45" fill="#FFFFFF" opacity="0.2"/>
    <text x="300" y="250" font-family="'Outfit', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
      ${escapeXml(p.brand.toUpperCase())}
    </text>

    <!-- Laptop Base / Keyboard Deck -->
    <polygon points="80,410 520,410 470,360 130,360" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
    <!-- Keyboard Area -->
    <polygon points="120,395 480,395 450,368 150,368" fill="#1E293B"/>
    <!-- Trackpad -->
    <rect x="260" y="398" width="80" height="10" rx="2" fill="#CBD5E1"/>
  </g>

  <g transform="translate(200, 480)">
    <rect x="0" y="0" width="200" height="34" rx="17" fill="#0F172A"/>
    <text x="100" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      INTEL CORE I5 / I7
    </text>
  </g>
</svg>`;
}

// 13. Mobiles
function generateMobile(p: any): string {
  const theme = getTheme(p.brand);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="mbScreen_${p.slug}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.primary}"/>
      <stop offset="50%" stop-color="${theme.secondary}"/>
      <stop offset="100%" stop-color="${theme.accent}"/>
    </linearGradient>
    <filter id="mbSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#mbSh_${p.slug})">
    <!-- Phone Chassis -->
    <rect x="200" y="90" width="200" height="410" rx="34" fill="#0F172A" stroke="#334155" stroke-width="3"/>
    <!-- Active Display -->
    <rect x="206" y="96" width="188" height="398" rx="28" fill="url(#mbScreen_${p.slug})"/>

    <!-- Punch-hole Camera -->
    <circle cx="300" cy="120" r="5" fill="#000000"/>

    <!-- Screen Content / Clock -->
    <text x="300" y="220" font-family="'Outfit', sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" text-anchor="middle">
      10:24
    </text>
    <text x="300" y="245" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF" opacity="0.8" text-anchor="middle">
      ${escapeXml(p.brand.toUpperCase())} 5G
    </text>

    <!-- Triple Rear Camera Module on Corner -->
    <rect x="215" y="105" width="45" height="110" rx="14" fill="#000000" opacity="0.4"/>
    <circle cx="237" cy="130" r="12" fill="#000000" stroke="#38BDF8" stroke-width="2"/>
    <circle cx="237" cy="160" r="12" fill="#000000" stroke="#38BDF8" stroke-width="2"/>
    <circle cx="237" cy="190" r="9" fill="#000000" stroke="#F59E0B" stroke-width="2"/>
  </g>

  <g transform="translate(210, 525)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#0F172A"/>
    <text x="90" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      8GB / 256GB 5G
    </text>
  </g>
</svg>`;
}

// 14. Smart Watches
function generateWatch(p: any): string {
  const theme = getTheme(p.brand);
  const isApple = p.slug.includes('apple');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="wtSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#wtSh_${p.slug})">
    <!-- Top & Bottom Watch Straps -->
    <rect x="260" y="70" width="80" height="150" rx="8" fill="#334155"/>
    <rect x="260" y="380" width="80" height="150" rx="8" fill="#334155"/>

    ${isApple ? `
      <!-- Apple Watch Curved Square -->
      <rect x="220" y="190" width="160" height="190" rx="35" fill="#18181B" stroke="#475569" stroke-width="4"/>
      <rect x="230" y="200" width="140" height="170" rx="28" fill="#020617"/>
      <!-- Digital Crown -->
      <rect x="380" y="225" width="8" height="35" rx="3" fill="#64748B"/>
    ` : `
      <!-- Circular Classic Smart Watch -->
      <circle cx="300" cy="285" r="95" fill="#18181B" stroke="#64748B" stroke-width="5"/>
      <circle cx="300" cy="285" r="82" fill="#020617"/>
      <!-- Rotating Bezel Notches -->
      <circle cx="300" cy="285" r="88" fill="none" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 8"/>
    `}

    <!-- Display Face -->
    <text x="300" y="275" font-family="'Outfit', sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">
      10:09
    </text>
    <text x="300" y="300" font-family="sans-serif" font-size="10" font-weight="bold" fill="#10B981" text-anchor="middle">
      ♥ 78 BPM | 8,420 STEPS
    </text>
    <text x="300" y="325" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="${theme.accent}" text-anchor="middle">
      ${escapeXml(p.brand.toUpperCase())}
    </text>
  </g>

  <g transform="translate(220, 520)">
    <rect x="0" y="0" width="160" height="34" rx="17" fill="#0F172A"/>
    <text x="80" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#38BDF8" text-anchor="middle">
      AMOLED DISPLAY
    </text>
  </g>
</svg>`;
}

// 15. Fitness Machines
function generateFitness(p: any): string {
  const isTreadmill = p.slug.includes('treadmill');
  const isBike = p.slug.includes('bike');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bg_${p.slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="ftSh_${p.slug}" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="16" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="600" height="600" fill="url(#bg_${p.slug})"/>

  <g filter="url(#ftSh_${p.slug})">
    ${isTreadmill ? `
      <!-- Heavy Duty Motorized Treadmill -->
      <!-- Running Deck Base -->
      <polygon points="90,440 480,410 490,445 100,475" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
      <!-- Running Belt -->
      <polygon points="120,445 460,420 465,438 125,463" fill="#020617"/>
      <!-- Motor Hood Housing -->
      <rect x="420" y="380" width="90" height="55" rx="8" fill="#DC2626"/>
      <!-- Upright Handrails -->
      <line x1="430" y1="400" x2="380" y2="200" stroke="#334155" stroke-width="12" stroke-linecap="round"/>
      <line x1="380" y1="200" x2="270" y2="220" stroke="#334155" stroke-width="10" stroke-linecap="round"/>
      <!-- Digital LCD Console -->
      <rect x="330" y="160" width="110" height="60" rx="8" fill="#0F172A" stroke="#DC2626" stroke-width="2"/>
      <text x="385" y="195" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#10B981" text-anchor="middle">
        12.5 KM/H
      </text>
    ` : isBike ? `
      <!-- Magnetic Exercise Spin Bike -->
      <circle cx="390" cy="380" r="75" fill="#334155" stroke="#DC2626" stroke-width="8"/>
      <circle cx="390" cy="380" r="25" fill="#DC2626"/>
      <!-- Frame -->
      <line x1="210" y1="460" x2="430" y2="460" stroke="#0F172A" stroke-width="14" stroke-linecap="round"/>
      <line x1="390" y1="380" x2="270" y2="250" stroke="#DC2626" stroke-width="12" stroke-linecap="round"/>
      <!-- Racing Saddle -->
      <polygon points="230,240 290,240 270,260 240,260" fill="#0F172A"/>
      <!-- Handlebars & Monitor -->
      <line x1="390" y1="380" x2="360" y2="210" stroke="#334155" stroke-width="10"/>
      <rect x="340" y="180" width="60" height="40" rx="6" fill="#0F172A"/>
    ` : `
      <!-- Elliptical Cross Trainer -->
      <circle cx="380" cy="380" r="65" fill="#334155" stroke="#0284C7" stroke-width="6"/>
      <line x1="180" y1="460" x2="450" y2="460" stroke="#0F172A" stroke-width="14" stroke-linecap="round"/>
      <line x1="240" y1="430" x2="350" y2="220" stroke="#334155" stroke-width="10"/>
      <line x1="350" y1="220" x2="320" y2="140" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
    `}
  </g>

  <g transform="translate(200, 520)">
    <rect x="0" y="0" width="200" height="34" rx="17" fill="#0F172A"/>
    <text x="100" y="22" font-family="'Outfit', sans-serif" font-size="12" font-weight="bold" fill="#DC2626" text-anchor="middle">
      HEAVY DUTY FITNESS
    </text>
  </g>
</svg>`;
}

// Master dispatcher
console.log('Generating distinct SVG images for all', ALL_SEED_PRODUCTS.length, 'products...');
let count = 0;

for (const p of ALL_SEED_PRODUCTS) {
  let svg = '';
  switch (p.category) {
    case 'DC Inverter AC': svg = generateAC(p); break;
    case 'LED & QLED TVs': svg = generateTV(p); break;
    case 'Refrigerators': svg = generateFridge(p); break;
    case 'Water Dispensers': svg = generateWaterDispenser(p); break;
    case 'Kitchen Appliances': svg = generateKitchen(p); break;
    case 'Microwaves': svg = generateMicrowave(p); break;
    case 'Washing Machines': svg = generateWasher(p); break;
    case 'Geysers': svg = generateGeyser(p); break;
    case 'Air Coolers': svg = generateAirCooler(p); break;
    case 'Air Purifiers': svg = generateAirPurifier(p); break;
    case 'Vacuum Cleaners': svg = generateVacuum(p); break;
    case 'Laptops': svg = generateLaptop(p); break;
    case 'Mobiles': svg = generateMobile(p); break;
    case 'Smart Watches': svg = generateWatch(p); break;
    case 'Fitness Machines': svg = generateFitness(p); break;
    default: svg = generateAC(p); break;
  }

  const filePath = path.join(outputDir, `${p.slug}.svg`);
  fs.writeFileSync(filePath, svg, 'utf-8');
  count++;
}

console.log(`Generated ${count} distinct product SVG images in public/images/products!`);
