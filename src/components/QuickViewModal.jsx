import React, { useEffect, useState } from 'react';
import { useStore } from '../App';
import Tilt3D from './Tilt3D';
import SneakerVisual from './SneakerVisual';

const SPEC_LABELS = [
  { key: 'lightness', label: 'Yengillik indeksi' },
  { key: 'cushion', label: 'Amortizatsiya (Carbon-Air)' },
  { key: 'stability', label: '360° Barqarorlik' },
  { key: 'energyReturn', label: 'Energiya qaytishi' },
];

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setIsCartOpen,
    wishlist,
    toggleWishlist,
  } = useStore();

  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    if (!quickViewProduct) return;

    const initialColor =
      quickViewProduct.colorways.find((c) => c.id === quickViewProduct.initialColorId) ||
      quickViewProduct.colorways[0];

    setSelectedColorId(initialColor.id);
    setSelectedSize(
      quickViewProduct.sizes.includes(42)
        ? 42
        : quickViewProduct.sizes[Math.floor(quickViewProduct.sizes.length / 2)]
    );
    setRotationAngle(0);
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const activeColor =
    quickViewProduct.colorways.find((c) => c.id === selectedColorId) ||
    quickViewProduct.colorways[0];

  const isLiked = wishlist.includes(quickViewProduct.id);

  const badgeClass =
    quickViewProduct.badgeType === 'limited'
      ? 'badge-limited'
      : quickViewProduct.badgeType === 'hot'
      ? 'badge-hot'
      : '';

  const handleAddAndClose = () => {
    addToCart(quickViewProduct, selectedSize, activeColor);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, selectedSize, activeColor);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div
      className="overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      onClick={() => setQuickViewProduct(null)}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Modalni yopish"
        >
          ✕
        </button>

        {/* Chap panel: 3D vizualizator va burchak boshqaruvi */}
        <div className="modal-visual-pane">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span className={`drop-badge ${badgeClass}`}>{quickViewProduct.badge}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
              }}
            >
              SKU: {quickViewProduct.sku}
            </span>
          </div>

          <Tilt3D maxTilt={15} scale={1.03} glareOpacity={0.2}>
            <div
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <SneakerVisual
                colorway={activeColor}
                silhouette={quickViewProduct.silhouette}
                size="modal"
                floating
              />
            </div>
          </Tilt3D>

          {/* 3D burchak slayderi */}
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                marginBottom: 6,
              }}
            >
              <span>3D KO‘RISH BURCHAGI</span>
              <span style={{ color: 'var(--accent-volt)' }}>{rotationAngle}°</span>
            </div>
            <input
              type="range"
              min="-22"
              max="22"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="range-slider"
              aria-label="Krasofkani burish burchagi"
            />
          </div>

          {/* Texnik qisqa ma'lumotlar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              marginTop: 20,
            }}
          >
            <div className="converter-box">
              <span>VAZNI</span>
              <strong style={{ fontSize: '1.1rem' }}>{quickViewProduct.weightGrams}g</strong>
            </div>
            <div className="converter-box">
              <span>DROP</span>
              <strong style={{ fontSize: '1.1rem' }}>{quickViewProduct.dropMm}mm</strong>
            </div>
            <div className="converter-box">
              <span>REYTING</span>
              <strong style={{ fontSize: '1.1rem' }}>★ {quickViewProduct.rating}</strong>
            </div>
          </div>
        </div>

        {/* O'ng panel: ma'lumotlar, rang, o'lcham, shkalalar */}
        <div className="modal-info-pane">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.76rem',
                color: 'var(--accent-volt)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {quickViewProduct.category} Series
            </div>
            <h2
              id="quickview-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                lineHeight: 1.12,
                marginTop: 6,
              }}
            >
              {quickViewProduct.name}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-price-group">
              <span className="price-current" style={{ fontSize: '1.65rem' }}>
                ${quickViewProduct.price}
              </span>
              {quickViewProduct.oldPrice && (
                <span className="price-old" style={{ fontSize: '1rem' }}>
                  ${quickViewProduct.oldPrice}
                </span>
              )}
            </div>

            <button
              type="button"
              className={`wish-btn ${isLiked ? 'is-liked' : ''}`}
              onClick={() => toggleWishlist(quickViewProduct)}
              aria-label="Sevimlilarga saqlash"
            >
              {isLiked ? '♥' : '♡'}
            </button>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {quickViewProduct.description}
          </p>

          {/* Rang tanlash */}
          <div>
            <div className="filter-group-title" style={{ marginBottom: 10 }}>
              <span>RANG PALITRASI</span>
              <span style={{ color: 'var(--text-primary)' }}>{activeColor.name}</span>
            </div>
            <div className="colorway-dots">
              {quickViewProduct.colorways.map((cw) => (
                <button
                  key={cw.id}
                  type="button"
                  className={`color-dot ${cw.id === activeColor.id ? 'active' : ''}`}
                  style={{
                    width: 28,
                    height: 28,
                    background: `linear-gradient(135deg, ${cw.primary} 42%, ${cw.accent} 42%)`,
                  }}
                  onClick={() => setSelectedColorId(cw.id)}
                  title={cw.name}
                  aria-label={cw.name}
                />
              ))}
            </div>
          </div>

          {/* EU O'lcham tanlash */}
          <div>
            <div className="filter-group-title" style={{ marginBottom: 10 }}>
              <span>O‘LCHAM TANLANG (EU)</span>
              <span style={{ color: 'var(--accent-volt)' }}>EU {selectedSize}</span>
            </div>
            <div className="size-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {quickViewProduct.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`size-chip ${selectedSize === sz ? 'active' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Texnik ko'rsatkich shkalalari */}
          <div className="spec-bars">
            {SPEC_LABELS.map((item) => {
              const val = quickViewProduct.specs[item.key] || 85;
              return (
                <div key={item.key}>
                  <div className="spec-row-top">
                    <span>{item.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {val}%
                    </span>
                  </div>
                  <div className="spec-track">
                    <div className="spec-fill" style={{ width: `${val}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tugmalar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
            <button type="button" className="btn btn-primary btn-full" onClick={handleAddAndClose}>
              + Savatchaga qo‘shish
            </button>
            <button type="button" className="btn btn-glass btn-full" onClick={handleBuyNow}>
              Tezkor xarid →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}