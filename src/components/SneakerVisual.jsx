import React, { useId } from 'react';

const DEFAULT_COLORWAY = {
  primary: '#151923',
  secondary: '#262d3f',
  accent: '#c8ff00',
  sole: '#e9edf5',
  glow: '#c8ff00',
};

export default function SneakerVisual({
  colorway = DEFAULT_COLORWAY,
  silhouette = 'aero',
  size = 'card',
  floating = false,
  className = '',
}) {
  const uid = useId().replace(/:/g, '');
  const c = { ...DEFAULT_COLORWAY, ...colorway };

  const upperGradId = `upper-${uid}`;
  const panelGradId = `panel-${uid}`;
  const soleGradId = `sole-${uid}`;
  const accentGradId = `accent-${uid}`;
  const shineGradId = `shine-${uid}`;

  return (
    <div
      className={`sneaker-visual size-${size} ${floating ? 'floating' : ''} ${className}`}
      aria-label={`VELOX ${silhouette} sneaker`}
    >
      {/* Orqa 3D neon aura */}
      <div
        className="sneaker-aura"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 72%)`,
        }}
      />

      {/* 3D qatlamli SVG siluet */}
      <div className="sneaker-svg-wrap">
        <svg
          viewBox="0 0 520 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={upperGradId} x1="60" y1="40" x2="440" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c.secondary} />
              <stop offset="55%" stopColor={c.primary} />
              <stop offset="100%" stopColor="#090b10" />
            </linearGradient>

            <linearGradient id={panelGradId} x1="120" y1="60" x2="360" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="45%" stopColor={c.secondary} stopOpacity="0.92" />
              <stop offset="100%" stopColor={c.primary} />
            </linearGradient>

            <linearGradient id={soleGradId} x1="40" y1="185" x2="485" y2="245" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c.sole} />
              <stop offset="60%" stopColor={c.sole} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#9aa3b8" />
            </linearGradient>

            <linearGradient id={accentGradId} x1="80" y1="110" x2="430" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={c.accent} />
              <stop offset="100%" stopColor={c.glow} stopOpacity="0.72" />
            </linearGradient>

            <linearGradient id={shineGradId} x1="140" y1="50" x2="290" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ===================== 1. AERO (MARATHON CARBON) ===================== */}
          {silhouette === 'aero' && (
            <g>
              {/* Orqa tortgich (heel pull tab) */}
              <path
                d="M84 96 L64 78 C60 74 63 66 70 68 L98 84 Z"
                fill={`url(#${accentGradId})`}
              />

              {/* Asosiy ustki korpus */}
              <path
                d="M82 94 C105 112 138 118 168 92 C196 68 228 58 258 76 C292 98 336 126 392 140 C432 149 468 158 474 176 C478 190 458 202 426 204 L92 204 C66 204 54 182 58 152 C62 126 70 105 82 94 Z"
                fill={`url(#${upperGradId})`}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1.5"
              />

              {/* Yon aerodinamik panel */}
              <path
                d="M124 186 C168 140 226 118 296 124 C346 128 386 146 426 164 L394 188 L124 186 Z"
                fill={`url(#${panelGradId})`}
              />

              {/* Yaltiroq 3D yorug'lik qatlami */}
              <path
                d="M174 96 C204 72 232 66 258 82 C288 100 326 122 374 138 C320 132 268 116 218 112 C194 110 180 106 174 96 Z"
                fill={`url(#${shineGradId})`}
              />

              {/* Bog'ichlar (Laces) */}
              <g stroke={c.accent} strokeWidth="4.5" strokeLinecap="round">
                <line x1="252" y1="84" x2="274" y2="75" />
                <line x1="274" y1="98" x2="298" y2="89" />
                <line x1="298" y1="112" x2="322" y2="103" />
                <line x1="322" y1="126" x2="344" y2="117" />
              </g>

              {/* VELOX tezlik qanoti */}
              <path
                d="M136 164 L276 128 L334 146 L184 176 Z"
                fill={`url(#${accentGradId})`}
              />
              <path
                d="M172 178 L348 152 L374 162 L198 184 Z"
                fill="#ffffff"
                fillOpacity="0.22"
              />

              {/* T800 Karbon plastinka ko'rinishi */}
              <path
                d="M170 202 C238 190 318 190 398 202 L386 216 C312 206 242 206 176 216 Z"
                fill="#0b0d14"
                stroke={c.accent}
                strokeWidth="1.6"
              />

              {/* Asosiy aerodinamik taglik */}
              <path
                d="M44 196 C54 184 74 186 112 190 C196 198 310 194 426 184 C458 181 482 184 486 198 C490 214 468 228 424 232 C310 242 186 242 86 232 C54 228 36 212 44 196 Z"
                fill={`url(#${soleGradId})`}
              />

              {/* Taglik ichki havo kanali va accent chizig'i */}
              <path
                d="M78 214 C180 226 322 224 448 206"
                stroke={`url(#${accentGradId})`}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M84 232 C192 243 324 242 442 228"
                stroke="#0a0c12"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ===================== 2. CHUNKY (NEO-STREETWEAR) ===================== */}
          {silhouette === 'chunky' && (
            <g>
              {/* Qalin orqa qism */}
              <path
                d="M74 84 C98 106 132 112 162 84 C190 58 228 54 260 76 C294 100 338 122 396 132 C440 140 472 154 474 176 L460 198 L72 198 C54 190 50 156 58 122 C62 104 68 92 74 84 Z"
                fill={`url(#${upperGradId})`}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1.6"
              />

              {/* Geometrik qatlamli panellar */}
              <polygon
                points="94,184 148,124 236,118 204,186"
                fill={`url(#${panelGradId})`}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
              />
              <polygon
                points="224,186 268,122 368,136 332,188"
                fill={`url(#${panelGradId})`}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
              />

              {/* Reflektiv 3M neon chiziqlar */}
              <path
                d="M126 154 L182 142 L242 156 L326 144 L394 162"
                stroke={`url(#${accentGradId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Bog'ichlar */}
              <g stroke="#ffffff" strokeOpacity="0.82" strokeWidth="4" strokeLinecap="round">
                <line x1="242" y1="80" x2="266" y2="72" />
                <line x1="266" y1="94" x2="290" y2="86" />
                <line x1="290" y1="108" x2="314" y2="100" />
                <line x1="316" y1="120" x2="338" y2="113" />
              </g>

              {/* Qalin brutalist taglik */}
              <path
                d="M42 194 C54 176 92 178 140 184 C204 192 276 184 342 180 C406 176 462 176 482 194 C494 206 484 232 444 238 C392 246 334 240 278 242 C210 244 134 248 76 238 C42 232 32 210 42 194 Z"
                fill={`url(#${soleGradId})`}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.4"
              />

              {/* Taglikdagi 3D o'yiq bloklar */}
              <rect x="86" y="202" width="54" height="20" rx="10" fill={c.primary} stroke={c.accent} strokeWidth="2" />
              <rect x="166" y="204" width="76" height="18" rx="9" fill={`url(#${accentGradId})`} />
              <rect x="272" y="202" width="64" height="18" rx="9" fill={c.primary} />
              <path
                d="M72 242 L112 248 L156 242 L206 248 L258 242 L316 248 L374 240 L438 242"
                stroke="#07080c"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* ===================== 3. HIGHTOP (BASKETBALL PRO) ===================== */}
          {silhouette === 'hightop' && (
            <g>
              {/* Baland to'piq himoya yoqasi */}
              <path
                d="M88 46 C118 42 152 44 178 52 C202 60 226 78 258 92 C300 112 350 130 404 140 C444 148 472 162 472 184 L452 204 L76 204 C60 192 58 148 66 106 C72 74 76 50 88 46 Z"
                fill={`url(#${upperGradId})`}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1.6"
              />

              {/* To'piq fiksatsiya kamari */}
              <path
                d="M76 74 L196 86 L186 112 L70 98 Z"
                fill={`url(#${accentGradId})`}
              />

              {/* Yon kevlar qanotcha */}
              <path
                d="M112 192 C146 132 214 114 316 128 C362 134 406 150 442 174 L414 196 L112 192 Z"
                fill={`url(#${panelGradId})`}
              />

              {/* Yaltiroq yuza */}
              <path
                d="M104 56 C136 52 162 56 184 66 L176 80 L96 70 Z"
                fill={`url(#${shineGradId})`}
              />

              {/* Bog'ichlar */}
              <g stroke={c.accent} strokeWidth="4.2" strokeLinecap="round">
                <line x1="194" y1="68" x2="218" y2="62" />
                <line x1="216" y1="84" x2="240" y2="78" />
                <line x1="242" y1="100" x2="266" y2="94" />
                <line x1="270" y1="115" x2="294" y2="108" />
                <line x1="300" y1="129" x2="324" y2="122" />
              </g>

              {/* Markaziy dinamik chiziq */}
              <path
                d="M138 176 L246 132 L286 138 L178 184 Z"
                fill={`url(#${accentGradId})`}
              />

              {/* Basketbol tagligi */}
              <path
                d="M52 198 C64 188 102 190 162 192 C264 194 374 188 456 186 C476 186 486 196 484 210 C482 226 458 234 422 236 L94 236 C62 236 44 218 52 198 Z"
                fill={`url(#${soleGradId})`}
              />

              {/* Ikki zonali Air-Pod kapsulalar */}
              <rect
                x="84"
                y="206"
                width="82"
                height="18"
                rx="9"
                fill="#0b0e16"
                stroke={c.accent}
                strokeWidth="2.4"
              />
              <line x1="106" y1="208" x2="106" y2="222" stroke={c.accent} strokeWidth="2" />
              <line x1="138" y1="208" x2="138" y2="222" stroke={c.accent} strokeWidth="2" />

              <rect
                x="336"
                y="206"
                width="68"
                height="15"
                rx="7.5"
                fill="#0b0e16"
                stroke={c.accent}
                strokeWidth="2"
              />
            </g>
          )}

          {/* ===================== 4. RUNNER (FLYWEAVE KNIT) ===================== */}
          {silhouette === 'runner' && (
            <g>
              {/* Orqa halqa */}
              <path
                d="M84 98 C72 82 78 68 92 78 L108 92 Z"
                fill={`url(#${accentGradId})`}
              />

              {/* Nafas oluvchi knit ustki qism */}
              <path
                d="M82 96 C108 118 144 118 176 90 C206 64 238 62 268 82 C302 104 344 128 398 140 C438 148 470 160 472 178 C474 192 456 202 426 204 L88 204 C62 204 52 178 58 148 C64 120 72 106 82 96 Z"
                fill={`url(#${upperGradId})`}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1.5"
              />

              {/* Yon qo'llab-quvvatlovchi qovurg'alar (cages) */}
              <g stroke={`url(#${accentGradId})`} strokeWidth="5.5" strokeLinecap="round">
                <line x1="212" y1="112" x2="184" y2="184" />
                <line x1="242" y1="118" x2="216" y2="186" />
                <line x1="272" y1="126" x2="248" y2="186" />
              </g>

              {/* Knit nafas olish nuqtalari */}
              <g fill="#ffffff" fillOpacity="0.22">
                <circle cx="318" cy="148" r="3" />
                <circle cx="334" cy="152" r="3" />
                <circle cx="350" cy="156" r="3" />
                <circle cx="366" cy="160" r="3" />
                <circle cx="326" cy="164" r="3" />
                <circle cx="342" cy="168" r="3" />
                <circle cx="358" cy="172" r="3" />
              </g>

              {/* Bog'ichlar */}
              <g stroke="#ffffff" strokeOpacity="0.8" strokeWidth="3.8" strokeLinecap="round">
                <line x1="244" y1="82" x2="266" y2="75" />
                <line x1="268" y1="96" x2="290" y2="89" />
                <line x1="292" y1="110" x2="314" y2="103" />
              </g>

              {/* To'lqinli CloudFoam taglik */}
              <path
                d="M46 196 C62 180 104 186 164 190 C248 196 346 190 434 182 C464 180 484 188 486 204 C488 220 462 232 420 234 C312 240 184 242 86 234 C54 230 36 212 46 196 Z"
                fill={`url(#${soleGradId})`}
              />

              {/* To'lqin aksenti */}
              <path
                d="M66 210 C138 198 192 226 274 214 C348 202 406 220 464 204"
                stroke={`url(#${accentGradId})`}
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Umumiy micro-branding belgisi */}
          <text
            x="92"
            y="188"
            fill="#ffffff"
            fillOpacity="0.34"
            fontSize="11"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            letterSpacing="3"
          >
            VELOX
          </text>
        </svg>
      </div>

      {/* Yerdagi yumshoq soya */}
      {size !== 'mini' && <div className="sneaker-floor-shadow" aria-hidden="true" />}
    </div>
  );
}