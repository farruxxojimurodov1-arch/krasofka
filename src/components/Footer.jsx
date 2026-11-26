import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../App';

export default function Footer() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleaned = email.trim();

    if (!cleaned || !cleaned.includes('@') || !cleaned.includes('.')) {
      pushToast(
        'Email manzili noto‘g‘ri',
        'Iltimos, to‘g‘ri elektron pochta kiriting.',
        'error'
      );
      return;
    }

    setSubscribed(true);
    setEmail('');
    pushToast(
      'VELOX VIP klubiga xush kelibsiz!',
      'Yopiq droplar va VELOX20 (-20%) promo-kodi faollashdi.',
      'success'
    );
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* 1-ustun: Brend manifesti */}
          <div>
            <Link to="/" className="brand-logo" aria-label="VELOX Bosh sahifa">
              <span className="brand-mark">V</span>
              <span>
                VELOX
                <span className="brand-sub">FOOTWEAR STUDIO</span>
              </span>
            </Link>

            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                marginTop: 16,
                maxWidth: 320,
              }}
            >
              Karbon-aerodinamika va Neo-Streetwear uyg‘unligida yaratilgan
              zamonaviy krasofkalar laboratoriyasi. Har bir qadamda maksimal
              tezlik va yengillik.
            </p>

            <div
              style={{
                marginTop: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 12,
                background: 'rgba(200, 255, 0, 0.08)',
                border: '1px solid rgba(200, 255, 0, 0.25)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--accent-volt)',
              }}
            >
              <span>PROMO:</span>
              <strong>VELOX20 (-20%)</strong>
            </div>
          </div>

          {/* 2-ustun: Sahifalar */}
          <div>
            <h4 className="footer-heading">Navigatsiya</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Asosiy sahifa</Link>
              </li>
              <li>
                <Link to="/shop">To‘liq katalog</Link>
              </li>
              <li>
                <Link to="/shop?category=Limited">Limited Drops</Link>
              </li>
              <li>
                <Link to="/shop?wishlist=1">Sevimli modellar</Link>
              </li>
              <li>
                <Link to="/contact">Showroomlar & Aloqa</Link>
              </li>
            </ul>
          </div>

          {/* 3-ustun: Kolleksiyalar */}
          <div>
            <h4 className="footer-heading">Kolleksiyalar</h4>
            <ul className="footer-links">
              <li>
                <Link to="/shop?category=Running">Running — Carbon Pro</Link>
              </li>
              <li>
                <Link to="/shop?category=Street">Street — Neo Tokyo</Link>
              </li>
              <li>
                <Link to="/shop?category=Basketball">Basketball — Gravity</Link>
              </li>
              <li>
                <Link to="/contact#size-guide">O‘lcham konvertori (EU/US)</Link>
              </li>
              <li>
                <Link to="/contact#faq">Yetkazib berish va kafolat</Link>
              </li>
            </ul>
          </div>

          {/* 4-ustun: VIP Drop obunasi */}
          <div>
            <h4 className="footer-heading">Yopiq Drop bildirishnomalari</h4>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                marginBottom: 14,
              }}
            >
              Cheklangan seriyalar sotuvga chiqishidan 24 soat oldin xabar oling.
            </p>

            <form
              onSubmit={handleSubscribe}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <input
                type="email"
                className="velox-input"
                placeholder="email@velox.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email manzilingiz"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                {subscribed ? 'Obuna faollashdi ✓' : 'VIP klubga qo‘shilish →'}
              </button>
            </form>

            <div
              style={{
                marginTop: 16,
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Tashkent Flagship • +998 (71) 200-88-90
            </div>
          </div>
        </div>

        {/* Pastki chiziq */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} VELOX Footwear Studio. Barcha huquqlar
            himoyalangan.
          </span>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span>100% Original Kafolat</span>
            <span>•</span>
            <span>14 kunlik bepul almashtirish</span>
            <span>•</span>
            <span>Express Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}