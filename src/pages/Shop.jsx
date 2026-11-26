import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ALL_SIZES, CATEGORIES, SNEAKERS, useStore } from '../App';
import Reveal from '../components/Reveal';
import ProductCard from '../components/ProductCard';

const MAX_PRICE_LIMIT = 400;

export default function Shop() {
  const { wishlist, applyPromoCode } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category');
  const validInitialCategory = CATEGORIES.includes(initialCategory)
    ? initialCategory
    : 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(validInitialCategory);
  const [selectedSize, setSelectedSize] = useState(null);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);
  const [onlyWishlist, setOnlyWishlist] = useState(
    searchParams.get('wishlist') === '1'
  );
  const [onlySale, setOnlySale] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [gridMode, setGridMode] = useState('grid3'); // 'grid3' | 'grid2'

  // URL o'zgarganda (Navbar/Footer/Home linklari orqali) filtrlarni yangilash
  useEffect(() => {
    const catParam = searchParams.get('category');
    const wishParam = searchParams.get('wishlist');

    if (catParam && CATEGORIES.includes(catParam)) {
      setSelectedCategory(catParam);
    } else if (!catParam) {
      setSelectedCategory('All');
    }

    setOnlyWishlist(wishParam === '1');
  }, [searchParams]);

  // Har bir kategoriya bo'yicha modellar soni
  const categoryCounts = useMemo(() => {
    const counts = { All: SNEAKERS.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = SNEAKERS.filter((item) => item.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filtrlash va saralash
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = SNEAKERS.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      if (onlyWishlist && !wishlist.includes(product.id)) {
        return false;
      }

      if (onlySale && !product.oldPrice) {
        return false;
      }

      if (selectedSize && !product.sizes.includes(selectedSize)) {
        return false;
      }

      if (product.price > maxPrice) {
        return false;
      }

      if (q) {
        const haystack = `${product.name} ${product.sku} ${product.category} ${product.tagline}`.toLowerCase();
        if (!haystack.includes(q)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...list];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case 'lightest':
        sorted.sort((a, b) => a.weightGrams - b.weightGrams);
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }, [
    searchQuery,
    selectedCategory,
    selectedSize,
    maxPrice,
    onlyWishlist,
    onlySale,
    sortBy,
    wishlist,
  ]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next, { replace: true });
  };

  const handleWishlistToggle = () => {
    const nextVal = !onlyWishlist;
    setOnlyWishlist(nextVal);
    const next = new URLSearchParams(searchParams);
    if (nextVal) {
      next.set('wishlist', '1');
    } else {
      next.delete('wishlist');
    }
    setSearchParams(next, { replace: true });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSize(null);
    setMaxPrice(MAX_PRICE_LIMIT);
    setOnlyWishlist(false);
    setOnlySale(false);
    setSortBy('featured');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedSize !== null ||
    maxPrice < MAX_PRICE_LIMIT ||
    onlyWishlist ||
    onlySale;

  return (
    <div className="shop-page">
      {/* ====================================================================
          1. CATALOG HERO BANNER
         ==================================================================== */}
      <section className="page-hero-banner">
        <div className="container">
          <Reveal>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 24,
              }}
            >
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>VELOX ARCHIVE • 2026</span>
                </div>
                <h1 className="section-title" style={{ marginTop: 14 }}>
                  {onlyWishlist ? (
                    <>
                      Sevimli <span className="text-volt">Modellar</span>
                    </>
                  ) : (
                    <>
                      Krasofkalar <span className="text-volt">Katalogi</span>
                    </>
                  )}
                </h1>
                <p className="section-subtitle">
                  12 ta muhandislik flagmani, 36 ta rang palitrasi va real vaqtda
                  3D ko‘rish imkoniyati. O‘zingizga mos o‘lcham va uslubni tanlang.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => applyPromoCode('VELOX20')}
              >
                ⚡ VELOX20 (-20%) ni faollashtirish
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================================
          2. FILTER SIDEBAR + PRODUCTS GRID
         ==================================================================== */}
      <div className="container">
        <div className="shop-layout">
          {/* CHAP SIDEBAR: BARCHA FILTRLAR */}
          <aside className="filter-sidebar" aria-label="Katalog filtrlari">
            {/* Qidiruv */}
            <div>
              <div className="filter-group-title">
                <span>QIDIRUV</span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ color: 'var(--accent-volt)', fontSize: '0.72rem' }}
                  >
                    Tozalash
                  </button>
                )}
              </div>
              <div className="search-input-wrap">
                <input
                  type="text"
                  className="velox-input"
                  placeholder="Model nomi yoki SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Krasofka qidirish"
                />
              </div>
            </div>

            {/* Kategoriyalar */}
            <div>
              <div className="filter-group-title">
                <span>KATEGORIYA</span>
                <span style={{ color: 'var(--text-primary)' }}>{selectedCategory}</span>
              </div>
              <div className="category-pills">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat === 'All' ? 'Barchasi' : cat} ({categoryCounts[cat]})
                  </button>
                ))}
              </div>
            </div>

            {/* Maksimal narx */}
            <div>
              <div className="filter-group-title">
                <span>MAKSIMAL NARX</span>
                <span style={{ color: 'var(--accent-volt)', fontWeight: 700 }}>
                  ${maxPrice} gacha
                </span>
              </div>
              <input
                type="range"
                min="175"
                max={MAX_PRICE_LIMIT}
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-slider"
                aria-label="Maksimal narx filtri"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginTop: 6,
                }}
              >
                <span>$175</span>
                <span>$290</span>
                <span>${MAX_PRICE_LIMIT}</span>
              </div>
            </div>

            {/* EU O'lcham */}
            <div>
              <div className="filter-group-title">
                <span>EU O‘LCHAM</span>
                {selectedSize && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize(null)}
                    style={{ color: 'var(--accent-volt)', fontSize: '0.72rem' }}
                  >
                    EU {selectedSize} ✕
                  </button>
                )}
              </div>
              <div className="size-grid">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-chip ${selectedSize === size ? 'active' : ''}`}
                    onClick={() =>
                      setSelectedSize((prev) => (prev === size ? null : size))
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tezkor holat filtrlari */}
            <div style={{ display: 'grid', gap: 10 }}>
              <div className="filter-group-title" style={{ marginBottom: 4 }}>
                <span>MAXSUS FILTRLAR</span>
              </div>

              <button
                type="button"
                className={`filter-pill ${onlyWishlist ? 'active' : ''}`}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
                onClick={handleWishlistToggle}
              >
                <span>♥ Faqat sevimlilar</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{wishlist.length}</span>
              </button>

              <button
                type="button"
                className={`filter-pill ${onlySale ? 'active' : ''}`}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
                onClick={() => setOnlySale((prev) => !prev)}
              >
                <span>% Chegirmadagi modellar</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {SNEAKERS.filter((s) => Boolean(s.oldPrice)).length}
                </span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-glass btn-sm btn-full"
                onClick={resetAllFilters}
              >
                Barcha filtrlarni tozalash ✕
              </button>
            )}
          </aside>

          {/* O'NG QISM: TOOLBAR VA 3D KARTOCHKALAR */}
          <div>
            <div className="shop-toolbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.86rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Topildi:{' '}
                  <strong style={{ color: 'var(--accent-volt)' }}>
                    {filteredProducts.length}
                  </strong>{' '}
                  ta model
                </span>

                {selectedCategory !== 'All' && (
                  <span className="drop-badge badge-limited">{selectedCategory}</span>
                )}
                {selectedSize && (
                  <span className="drop-badge">EU {selectedSize}</span>
                )}
                {onlyWishlist && (
                  <span className="drop-badge badge-hot">♥ Sevimlilar</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <select
                  className="velox-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: 'auto', padding: '9px 14px', fontSize: '0.84rem' }}
                  aria-label="Saralash tartibi"
                >
                  <option value="featured">Tavsiya etilgan</option>
                  <option value="price-asc">Arzonidan qimmatiga</option>
                  <option value="price-desc">Qimmatidan arzoniga</option>
                  <option value="rating">Eng yuqori reyting</option>
                  <option value="lightest">Eng yengil vazn (g)</option>
                </select>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`size-chip ${gridMode === 'grid3' ? 'active' : ''}`}
                    style={{ padding: '8px 12px' }}
                    onClick={() => setGridMode('grid3')}
                    title="3 ustunli ko‘rinish"
                  >
                    3×
                  </button>
                  <button
                    type="button"
                    className={`size-chip ${gridMode === 'grid2' ? 'active' : ''}`}
                    style={{ padding: '8px 12px' }}
                    onClick={() => setGridMode('grid2')}
                    title="2 ustunli keng ko‘rinish"
                  >
                    2×
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem' }}>
                  Ushbu filtrlar bo‘yicha krasofka topilmadi
                </h3>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.94rem',
                    maxWidth: 400,
                    margin: '10px auto 22px',
                  }}
                >
                  Qidiruv so‘zini o‘zgartiring yoki narx va o‘lcham cheklovlarini
                  tozalab ko‘ring.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resetAllFilters}
                >
                  Barcha modellarni ko‘rsatish
                </button>
              </div>
            ) : (
              <div
                className={
                  gridMode === 'grid2' ? 'shop-grid-2col' : 'products-grid'
                }
              >
                {filteredProducts.map((product, idx) => (
                  <Reveal key={product.id} delay={(idx % 3) * 60}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}