import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SNEAKERS, useStore } from '../App';
import Tilt3D from '../components/Tilt3D';
import Reveal from '../components/Reveal';
import SneakerVisual from '../components/SneakerVisual';
import ProductCard from '../components/ProductCard';

const MARQUEE_ITEMS = [
  'CARBON-AIR™ PROPULSION',
  'VELOX FOOTWEAR STUDIO',
  '3D ENGINEERED MOTION',
  'LIMITED 2026 DROPS',
  'TASHKENT • TOKYO • MILAN',
  '94% ENERGY RETURN',
];

const TECH_MODULES = [
  {
    id: 'carbon',
    icon: '⚡',
    code: 'LAYER 01',
    title: 'T800 Karbon Plastinka',
    desc: 'Aerokosmik darajadagi egiluvchan karbon plastinka har bir qadamda oldinga itaruvchi prujina effektini yaratadi.',
    statLabel: 'Energiya qaytishi',
    statValue: 96,
    metric: '+18% Sprint Tezligi',
  },
  {
    id: 'foam',
    icon: '☁',
    code: 'LAYER 02',
    title: 'Nitrogen CloudFoam™',
    desc: 'Azot bilan to‘yintirilgan ikki zichlikli taglik zarbani yutadi va tizza bo‘g‘imlariga tushadigan yukni 42% kamaytiradi.',
    statLabel: 'Zarba yumshatish',
    statValue: 94,
    metric: '204g Ultra-Yengil',
  },
  {
    id: 'knit',
    icon: '◈',
    code: 'LAYER 03',
    title: '3D FlyWeave Monofilament',
    desc: 'Choksiz lazerli to‘qima oyoq haroratini muvozanatda ushlaydi va 360° havo almashinuvini ta’minlaydi.',
    statLabel: 'Nafas olish darajasi',
    statValue: 98,
    metric: '360° Ventilyatsiya',
  },
];

export default function Home() {
  const { addToCart, setQuickViewProduct, applyPromoCode, setIsCartOpen } = useStore();
  const navigate = useNavigate();

  const heroModels = useMemo(() => SNEAKERS.slice(0, 3), []);
  const featuredProducts = useMemo(
    () => SNEAKERS.filter((item) => item.featured),
    []
  );

  const [heroModelIdx, setHeroModelIdx] = useState(0);
  const [heroColorIdx, setHeroColorIdx] = useState(0);
  const [activeTechId, setActiveTechId] = useState(TECH_MODULES[0].id);

  const currentHero = heroModels[heroModelIdx] || heroModels[0];
  const currentHeroColor =
    currentHero.colorways[heroColorIdx] || currentHero.colorways[0];

  const activeTech =
    TECH_MODULES.find((t) => t.id === activeTechId) || TECH_MODULES[0];

  const handleSelectHeroModel = (idx) => {
    setHeroModelIdx(idx);
    setHeroColorIdx(0);
  };

  const handleHeroQuickBuy = () => {
    addToCart(currentHero, 42, currentHeroColor);
    setIsCartOpen(true);
  };

  const handleCopyVipPromo = () => {
    applyPromoCode('VELOX20');
    navigate('/shop');
  };

  return (
    <div className="home-page">
      {/* ====================================================================
          1. HERO 3D STAGE
         ==================================================================== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Chap ustun: Sarlavha, CTA va Metrikalar */}
            <Reveal direction="left">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>2026 CAPSULE COLLECTION • LIVE NOW</span>
              </div>

              <h1 className="hero-title">
                FUTURE OF <br />
                <span className="stroke-text">3D MOTION</span> <br />
                <span className="text-volt">FOOTWEAR.</span>
              </h1>

              <p className="hero-desc">
                VELOX — karbon plastinka, azotli amortizatsiya va Neo-Streetwear
                dizaynini birlashtirgan yangi avlod krasofkalari. Kursorni 3D
                model ustiga olib boring va ranglarni jonli sinab ko‘ring.
              </p>

              <div className="hero-cta-row">
                <Link to="/shop" className="btn btn-primary">
                  Katalogni ko‘rish →
                </Link>
                <Link to="/shop?category=Limited" className="btn btn-glass">
                  Limited Drops
                </Link>
              </div>

              {/* Hero model almashtirgich pillari */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.12em',
                    marginBottom: 10,
                  }}
                >
                  3D SAHNADAGI FLAGMANNI TANLANG:
                </div>
                <div className="category-pills">
                  {heroModels.map((model, idx) => (
                    <button
                      key={model.id}
                      type="button"
                      className={`filter-pill ${idx === heroModelIdx ? 'active' : ''}`}
                      onClick={() => handleSelectHeroModel(idx)}
                    >
                      0{idx + 1}. {model.name.replace('VELOX ', '')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hero-metrics">
                <div>
                  <div className="metric-value">
                    {currentHero.weightGrams}
                    <span className="text-volt">g</span>
                  </div>
                  <div className="metric-label">Ultra-yengil vazn</div>
                </div>
                <div>
                  <div className="metric-value">
                    {currentHero.specs.energyReturn}
                    <span className="text-volt">%</span>
                  </div>
                  <div className="metric-label">Energiya qaytishi</div>
                </div>
                <div>
                  <div className="metric-value">
                    14K<span className="text-volt">+</span>
                  </div>
                  <div className="metric-label">Mamnun mijozlar</div>
                </div>
              </div>
            </Reveal>

            {/* O'ng ustun: Interaktiv 3D Showcase Kartochkasi */}
            <Reveal direction="right" delay={120}>
              <Tilt3D maxTilt={11} scale={1.015} glareOpacity={0.2}>
                <div className="hero-stage-card">
                  <div className="hero-stage-watermark" aria-hidden="true">
                    VELOX
                  </div>
                  <div className="orbital-ring" aria-hidden="true" />
                  <div className="orbital-ring ring-2" aria-hidden="true" />

                  <div className="hero-stage-top">
                    <span className="stage-chip">{currentHero.sku}</span>
                    <span
                      className="stage-chip"
                      style={{
                        borderColor: 'rgba(200, 255, 0, 0.35)',
                        color: 'var(--accent-volt)',
                      }}
                    >
                      ★ {currentHero.rating.toFixed(1)} • {currentHero.badge}
                    </span>
                  </div>

                  {/* Suzuvchi texnik teglar */}
                  <div className="stage-floating-tag tag-right">
                    <span style={{ color: 'var(--text-secondary)' }}>CARBON-AIR</span>
                    <strong>{currentHero.dropMm}mm Drop</strong>
                  </div>

                  <div className="stage-floating-tag tag-left">
                    <span style={{ color: 'var(--text-secondary)' }}>ACTIVE COLOR</span>
                    <strong>{currentHeroColor.name}</strong>
                  </div>

                  {/* 3D Suzuvchi krasofka */}
                  <div
                    style={{ cursor: 'pointer', padding: '10px 0' }}
                    onClick={() =>
                      setQuickViewProduct({
                        ...currentHero,
                        initialColorId: currentHeroColor.id,
                      })
                    }
                    title="Yaqindan 3D ko‘rish"
                  >
                    <SneakerVisual
                      colorway={currentHeroColor}
                      silhouette={currentHero.silhouette}
                      size="hero"
                      floating
                    />
                  </div>

                  {/* Sahnaning pastki boshqaruv paneli */}
                  <div className="hero-stage-footer">
                    <div>
                      <div className="stage-model-name">{currentHero.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <span className="stage-model-price">${currentHero.price}</span>
                        <div className="colorway-dots">
                          {currentHero.colorways.map((cw, idx) => (
                            <button
                              key={cw.id}
                              type="button"
                              className={`color-dot ${idx === heroColorIdx ? 'active' : ''}`}
                              style={{
                                width: 20,
                                height: 20,
                                background: `linear-gradient(135deg, ${cw.primary} 42%, ${cw.accent} 42%)`,
                              }}
                              onClick={() => setHeroColorIdx(idx)}
                              aria-label={`${cw.name} rangi`}
                              title={cw.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-glass btn-sm"
                        onClick={() =>
                          setQuickViewProduct({
                            ...currentHero,
                            initialColorId: currentHeroColor.id,
                          })
                        }
                      >
                        3D Lab
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleHeroQuickBuy}
                      >
                        Xarid qilish
                      </button>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. INFINITE MARQUEE RIBBON
         ==================================================================== */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, idx) => (
            <span key={idx} className="marquee-item">
              <span className="marquee-star">✦</span>
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ====================================================================
          3. FEATURED 3D DROPS VITRINASI
         ==================================================================== */}
      <section className="page-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>FLAGSHIP SELECTION</span>
                </div>
                <h2 className="section-title">
                  Eng mashhur <span className="text-volt">3D Droplar</span>
                </h2>
                <p className="section-subtitle">
                  Har bir kartochkada ranglarni jonli almashtiring, 3D burchakda
                  aylantirib ko‘ring va bir bosishda savatchaga qo‘shing.
                </p>
              </div>

              <Link to="/shop" className="btn btn-glass">
                Barcha 12 ta model →
              </Link>
            </div>
          </Reveal>

          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 3) * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. CARBON-AIR™ TEXNOLOGIYA LABORATORIYASI
         ==================================================================== */}
      <section className="page-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="tech-grid">
            {/* Chap: Interaktiv 3D texnologiya paneli */}
            <Reveal direction="left">
              <Tilt3D maxTilt={9} scale={1.015}>
                <div className="tech-panel">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <span className="drop-badge badge-limited">{activeTech.code}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--accent-volt)',
                      }}
                    >
                      {activeTech.metric}
                    </span>
                  </div>

                  <SneakerVisual
                    colorway={SNEAKERS[3].colorways[0]}
                    silhouette="aero"
                    size="modal"
                    floating
                  />

                  <div
                    style={{
                      marginTop: 18,
                      padding: 18,
                      borderRadius: 16,
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="spec-row-top">
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {activeTech.statLabel}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-volt)',
                          fontWeight: 700,
                        }}
                      >
                        {activeTech.statValue}%
                      </span>
                    </div>
                    <div className="spec-track">
                      <div
                        className="spec-fill"
                        style={{ width: `${activeTech.statValue}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>

            {/* O'ng: Qatlamlar tahlili */}
            <Reveal direction="right" delay={100}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>VELOX ENGINEERING LAB</span>
              </div>

              <h2 className="section-title">
                Har bir millimetr <span className="text-volt">tezlik uchun</span>
              </h2>

              <p className="section-subtitle">
                VELOX muhandislari 3 qatlamli Carbon-Air™ tizimini 400 soatlik
                biomekanik sinovlar asosida ishlab chiqdi. Qatlamni tanlab
                ko‘rsatkichlarni solishtiring:
              </p>

              <div className="tech-features-list">
                {TECH_MODULES.map((item) => {
                  const isActive = item.id === activeTechId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="tech-feature-item"
                      onClick={() => setActiveTechId(item.id)}
                      style={{
                        textAlign: 'left',
                        width: '100%',
                        borderColor: isActive
                          ? 'rgba(200, 255, 0, 0.55)'
                          : 'var(--border-subtle)',
                        background: isActive
                          ? 'rgba(200, 255, 0, 0.06)'
                          : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <div className="tech-icon-box">{item.icon}</div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--accent-volt)',
                            marginBottom: 2,
                          }}
                        >
                          {item.code}
                        </div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. STREETWEAR LOOKBOOK BENTO GRID & VIP PROMO
         ==================================================================== */}
      <section className="page-section" style={{ paddingTop: 20 }}>
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>DISCOVER BY STYLE</span>
                </div>
                <h2 className="section-title">
                  O‘z uslubingizni <span className="text-volt">tanlang</span>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="bento-grid">
            <Reveal className="bento-span-7">
              <div className="bento-card bento-accent" style={{ height: '100%' }}>
                <div>
                  <span className="drop-badge badge-limited">VIP OFFER • 20% OFF</span>
                  <h3>VELOX20 promo-kodini faollashtiring</h3>
                  <p>
                    Birinchi buyurtmangizda darhol 20% chegirma va $250 dan
                    yuqori xaridlarda Toshkent bo‘ylab bepul Express yetkazib
                    berishga ega bo‘ling.
                  </p>
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCopyVipPromo}
                  >
                    VELOX20 ni qo‘llash va katalogga o‘tish →
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal className="bento-span-5" delay={100}>
              <div className="bento-card" style={{ height: '100%' }}>
                <div>
                  <span className="drop-badge">RUNNING LAB</span>
                  <h3>Marafon va Sprint</h3>
                  <p>
                    192g–224g og‘irlikdagi ultra-yengil karbonli modellar bilan
                    shaxsiy rekordingizni yangilang.
                  </p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Link to="/shop?category=Running" className="btn btn-glass btn-sm">
                    Running kolleksiyasi →
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal className="bento-span-4" delay={120}>
              <div className="bento-card" style={{ height: '100%' }}>
                <div>
                  <span className="drop-badge badge-hot">STREETWEAR</span>
                  <h3>Neo-Tokyo Street</h3>
                  <p>
                    Geometrik qalin tagliklar va 3M reflektiv detallar bilan
                    shahar uslubining markazida bo‘ling.
                  </p>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Link to="/shop?category=Street" className="btn btn-glass btn-sm">
                    Street modellari →
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal className="bento-span-8" delay={160}>
              <div className="bento-card" style={{ height: '100%' }}>
                <div>
                  <span className="drop-badge">TASHKENT FLAGSHIP SHOWROOM</span>
                  <h3>3D Oyoq Skaneri va VIP Fitting</h3>
                  <p>
                    Tashkent City Boulevard’dagi Flagship showroomimizga tashrif
                    buyuring: 3D skaner oyoq anatomiyangizni 30 soniyada o‘lchab,
                    ideal VELOX modelini tavsiya qiladi.
                  </p>
                </div>
                <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to="/contact" className="btn btn-primary btn-sm">
                    Showroomga yozilish →
                  </Link>
                  <Link to="/contact#size-guide" className="btn btn-glass btn-sm">
                    O‘lcham konvertori (EU/US)
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}