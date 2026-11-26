import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../App';

const NAV_ITEMS = [
  { to: '/', label: 'Asosiy', end: true },
  { to: '/shop', label: 'Katalog', end: false },
  { to: '/contact', label: 'Aloqa & Showroom', end: false },
];

export default function Navbar() {
  const { cartCount, wishlist, setIsCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const handleWishlistClick = () => {
    navigate('/shop?wishlist=1');
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Brend logotipi */}
          <Link to="/" className="brand-logo" aria-label="VELOX Bosh sahifa">
            <span className="brand-mark">V</span>
            <span>
              VELOX
              <span className="brand-sub">FOOTWEAR STUDIO</span>
            </span>
          </Link>

          {/* Desktop marshrutlar */}
          <nav className="nav-links" aria-label="Asosiy navigatsiya">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* O'ng tarafdagi harakat tugmalari */}
          <div className="nav-actions">
            <button
              type="button"
              className="icon-pill"
              onClick={handleWishlistClick}
              aria-label="Sevimli krasofkalar"
              title="Sevimli krasofkalar"
            >
              <span>♥</span>
              <span className="pill-badge badge-crimson">{wishlist.length}</span>
            </button>

            <button
              type="button"
              className="icon-pill"
              onClick={() => setIsCartOpen(true)}
              aria-label="Savatchani ochish"
              title="Savatchani ochish"
            >
              <span>Savatcha</span>
              <span className="pill-badge">{cartCount}</span>
            </button>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Menyuni ochish"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobil navigatsiya paneli */}
      <nav
        className={`mobile-nav-panel ${mobileOpen ? 'open' : ''}`}
        aria-label="Mobil navigatsiya"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          className="btn btn-primary btn-full"
          style={{ marginTop: 8 }}
          onClick={() => {
            setMobileOpen(false);
            setIsCartOpen(true);
          }}
        >
          Savatchani ochish ({cartCount})
        </button>
      </nav>
    </>
  );
}