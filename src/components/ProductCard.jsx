import React, { useState } from 'react';
import { useStore } from '../App';
import Tilt3D from './Tilt3D';
import SneakerVisual from './SneakerVisual';

export default function ProductCard({ product }) {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const activeColor = product.colorways[activeColorIdx] || product.colorways[0];
  const isLiked = wishlist.includes(product.id);

  const badgeClass =
    product.badgeType === 'limited'
      ? 'badge-limited'
      : product.badgeType === 'hot'
      ? 'badge-hot'
      : '';

  const handleOpenQuickView = () => {
    setQuickViewProduct({
      ...product,
      initialColorId: activeColor.id,
    });
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const defaultSize = product.sizes.includes(42)
      ? 42
      : product.sizes[Math.floor(product.sizes.length / 2)];

    addToCart(product, defaultSize, activeColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Tilt3D maxTilt={10} scale={1.02} glareOpacity={0.18} style={{ height: '100%' }}>
      <article className="product-card">
        {/* Yuqori qator: Drop belgisi va Sevimli tugmasi */}
        <div className="card-top-bar">
          <span className={`drop-badge ${badgeClass}`}>{product.badge}</span>

          <button
            type="button"
            className={`wish-btn ${isLiked ? 'is-liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={isLiked ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo‘shish'}
            title={isLiked ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo‘shish'}
          >
            {isLiked ? '♥' : '♡'}
          </button>
        </div>

        {/* 3D krasofka sahnasi */}
        <div
          className="card-stage"
          onClick={handleOpenQuickView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenQuickView();
            }
          }}
          aria-label={`${product.name} modelini yaqindan ko‘rish`}
        >
          <SneakerVisual
            colorway={activeColor}
            silhouette={product.silhouette}
            size="card"
          />
        </div>

        {/* Kategoriya, vazn va reyting */}
        <div className="card-meta-row">
          <span className="card-category">
            {product.category} • {product.weightGrams}g
          </span>
          <span className="card-rating">
            ★ {product.rating.toFixed(1)}{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
              ({product.reviews})
            </span>
          </span>
        </div>

        {/* Nomi va qisqacha ta'rifi */}
        <h3 className="card-title" onClick={handleOpenQuickView}>
          {product.name}
        </h3>
        <p className="card-tagline">{product.tagline}</p>

        {/* Rang tanlash nuqtalari va narx */}
        <div className="card-color-row">
          <div className="colorway-dots" role="group" aria-label="Rang variantlari">
            {product.colorways.map((cw, idx) => (
              <button
                key={cw.id}
                type="button"
                className={`color-dot ${idx === activeColorIdx ? 'active' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${cw.primary} 42%, ${cw.accent} 42%)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColorIdx(idx);
                }}
                aria-label={`${cw.name} rangi`}
                title={cw.name}
              />
            ))}
          </div>

          <div className="card-price-group">
            {product.oldPrice && (
              <span className="price-old">${product.oldPrice}</span>
            )}
            <span className="price-current">${product.price}</span>
          </div>
        </div>

        {/* Pastki harakat tugmalari */}
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleQuickAdd}
          >
            {justAdded ? 'Qo‘shildi ✓' : '+ Savatchaga'}
          </button>

          <button
            type="button"
            className="btn btn-glass btn-sm"
            onClick={handleOpenQuickView}
            aria-label="3D ko‘rinish va o‘lcham tanlash"
          >
            3D Ko‘rish
          </button>
        </div>
      </article>
    </Tilt3D>
  );
}