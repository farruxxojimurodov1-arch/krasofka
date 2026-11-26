import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import SneakerVisual from './SneakerVisual';

const FREE_SHIPPING_THRESHOLD = 250;

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotal,
    discountAmount,
    total,
    appliedPromo,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    clearCart,
    applyPromoCode,
    setAppliedPromo,
    pushToast,
  } = useStore();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [orderInfo, setOrderInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    payment: 'card',
  });
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!isCartOpen) {
      if (checkoutStep === 'success') {
        setCheckoutStep('cart');
      }
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen, checkoutStep]);

  if (!isCartOpen) return null;

  const shippingFee = total >= FREE_SHIPPING_THRESHOLD || total === 0 ? 0 : 12;
  const grandTotal = total + shippingFee;
  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoInput('');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!orderInfo.fullName.trim() || !orderInfo.phone.trim() || !orderInfo.address.trim()) {
      pushToast(
        'Ma’lumotlar to‘liq emas',
        'Ism, telefon raqam va yetkazish manzilini kiriting.',
        'error'
      );
      return;
    }

    const orderId = `VLX-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrder({
      id: orderId,
      customer: orderInfo.fullName.trim(),
      phone: orderInfo.phone.trim(),
      address: orderInfo.address.trim(),
      itemsCount: cartCount,
      paidTotal: grandTotal,
    });

    clearCart();
    setCheckoutStep('success');
    pushToast('Buyurtma tasdiqlandi!', `Raqam: #${orderId}`, 'success');
  };

  const handleGoToShop = () => {
    setIsCartOpen(false);
    navigate('/shop');
  };

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Xarid savatchasi"
      onClick={() => setIsCartOpen(false)}
    >
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer sarlavhasi */}
        <div className="drawer-header">
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
              {checkoutStep === 'cart' && `Savatcha (${cartCount})`}
              {checkoutStep === 'checkout' && 'Buyurtmani rasmiylashtirish'}
              {checkoutStep === 'success' && 'Buyurtma qabul qilindi'}
            </h3>
            <span
              style={{
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              VELOX EXPRESS DELIVERY
            </span>
          </div>

          <button
            type="button"
            className="wish-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Savatchani yopish"
          >
            ✕
          </button>
        </div>

        {/* 1-HOLAT: BO'SH SAVATCHA */}
        {checkoutStep === 'cart' && cart.length === 0 && (
          <div
            className="drawer-body"
            style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(200, 255, 0, 0.08)',
                border: '1px solid rgba(200, 255, 0, 0.25)',
                fontSize: '1.8rem',
                marginBottom: 8,
              }}
            >
              👟
            </div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
              Savatchangiz hozircha bo‘sh
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 290 }}>
              Katalogimizdagi 3D karbonli krasofkalardan o‘zingizga mos juftni tanlang.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={handleGoToShop}
            >
              Katalogga o‘tish →
            </button>
          </div>
        )}

        {/* 2-HOLAT: SAVATCHADAGI MAHSULOTLAR */}
        {checkoutStep === 'cart' && cart.length > 0 && (
          <>
            {/* Bepul yetkazib berish indikatori */}
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  marginBottom: 8,
                }}
              >
                {remainingForFreeShip === 0 ? (
                  <span style={{ color: 'var(--accent-volt)', fontWeight: 600 }}>
                    ✓ Bepul Express yetkazib berish ochildi!
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Bepul yetkazishgacha yana{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>
                      ${remainingForFreeShip}
                    </strong>
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {progressPercent}%
                </span>
              </div>
              <div className="spec-track">
                <div className="spec-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="drawer-body">
              {cart.map((item) => (
                <div key={item.key} className="cart-item">
                  <div
                    style={{
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: 4,
                    }}
                  >
                    <SneakerVisual
                      colorway={item.colorway}
                      silhouette={item.silhouette}
                      size="mini"
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <strong
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.96rem',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.name}
                      </strong>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                          padding: '2px 4px',
                        }}
                        aria-label={`${item.name} mahsulotini o‘chirish`}
                        title="O‘chirish"
                      >
                        ✕
                      </button>
                    </div>

                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        marginTop: 4,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      EU {item.size} • {item.colorway.name}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10,
                      }}
                    >
                      <div className="qty-stepper">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.key, -1)}
                          aria-label="Kamaytirish"
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.key, 1)}
                          aria-label="Ko‘paytirish"
                        >
                          +
                        </button>
                      </div>

                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: 'var(--accent-volt)',
                        }}
                      >
                        ${item.price * item.qty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pastki hisob-kitob va promo-kod */}
            <div className="drawer-footer">
              <form className="promo-row" onSubmit={handlePromoSubmit}>
                <input
                  type="text"
                  className="velox-input"
                  placeholder="Promo-kod (masalan: VELOX20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{ padding: '10px 14px', fontSize: '0.86rem' }}
                />
                <button type="submit" className="btn btn-glass btn-sm">
                  Qo‘llash
                </button>
              </form>

              {appliedPromo && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(200, 255, 0, 0.1)',
                    border: '1px solid rgba(200, 255, 0, 0.3)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: 'var(--accent-volt)', fontFamily: 'var(--font-mono)' }}>
                    {appliedPromo.code} — {appliedPromo.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}
                  >
                    Bekor qilish
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gap: 8 }}>
                <div className="summary-line">
                  <span>Mahsulotlar ({cartCount} dona)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-line" style={{ color: 'var(--accent-volt)' }}>
                    <span>Promo chegirma</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>−${discountAmount}</span>
                  </div>
                )}

                <div className="summary-line">
                  <span>Yetkazib berish</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {shippingFee === 0 ? 'Bepul' : `$${shippingFee}`}
                  </span>
                </div>

                <div className="summary-line total">
                  <span>Jami to‘lov</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-volt)' }}>
                    ${grandTotal}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => setCheckoutStep('checkout')}
              >
                Buyurtma berish • ${grandTotal} →
              </button>
            </div>
          </>
        )}

        {/* 3-HOLAT: RASMIYLASHTIRISH FORMASI */}
        {checkoutStep === 'checkout' && (
          <form
            onSubmit={handleCheckoutSubmit}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          >
            <div className="drawer-body">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                style={{
                  alignSelf: 'flex-start',
                  color: 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  marginBottom: 6,
                }}
              >
                ← Savatchaga qaytish
              </button>

              <div>
                <label className="field-label" htmlFor="chk-name">
                  ISM VA FAMILIYA
                </label>
                <input
                  id="chk-name"
                  type="text"
                  className="velox-input"
                  placeholder="Azizbek Karimov"
                  value={orderInfo.fullName}
                  onChange={(e) => setOrderInfo({ ...orderInfo, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="chk-phone">
                  TELEFON RAQAM
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  className="velox-input"
                  placeholder="+998 90 123 45 67"
                  value={orderInfo.phone}
                  onChange={(e) => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="chk-address">
                  YETKAZIB BERISH MANZILI
                </label>
                <textarea
                  id="chk-address"
                  rows={3}
                  className="velox-textarea"
                  placeholder="Toshkent sh., Yunusobod tumani..."
                  value={orderInfo.address}
                  onChange={(e) => setOrderInfo({ ...orderInfo, address: e.target.value })}
                />
              </div>

              <div>
                <span className="field-label">TO‘LOV USULI</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'card', label: 'Uzcard / Humo / Visa' },
                    { id: 'cash', label: 'Kuryerga naqd' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`size-chip ${orderInfo.payment === opt.id ? 'active' : ''}`}
                      style={{ padding: '12px 10px' }}
                      onClick={() => setOrderInfo({ ...orderInfo, payment: opt.id })}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              <div className="summary-line total" style={{ borderTop: 'none', paddingTop: 0 }}>
                <span>To‘lanadigan summa</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-volt)' }}>
                  ${grandTotal}
                </span>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Buyurtmani tasdiqlash ✓
              </button>
            </div>
          </form>
        )}

        {/* 4-HOLAT: TASDIQLASH CHIPTASI */}
        {checkoutStep === 'success' && confirmedOrder && (
          <div
            className="drawer-body"
            style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--accent-volt)',
                color: '#06070a',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: 'var(--shadow-glow)',
                marginBottom: 12,
              }}
            >
              ✓
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
              Rahmat, {confirmedOrder.customer}!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 310 }}>
              Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Operatorimiz 15 daqiqa ichida{' '}
              <strong>{confirmedOrder.phone}</strong> raqamiga bog‘lanadi.
            </p>

            <div
              style={{
                width: '100%',
                marginTop: 18,
                padding: 18,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
                display: 'grid',
                gap: 8,
                fontSize: '0.84rem',
              }}
            >
              <div className="summary-line">
                <span>Buyurtma raqami</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-volt)' }}>
                  #{confirmedOrder.id}
                </strong>
              </div>
              <div className="summary-line">
                <span>Juftlar soni</span>
                <strong>{confirmedOrder.itemsCount} ta</strong>
              </div>
              <div className="summary-line">
                <span>Jami summa</span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>
                  ${confirmedOrder.paidTotal}
                </strong>
              </div>
              <div className="summary-line">
                <span>Manzil</span>
                <span style={{ color: 'var(--text-primary)', textAlign: 'right' }}>
                  {confirmedOrder.address}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-full"
              style={{ marginTop: 18 }}
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(false);
              }}
            >
              Xaridni davom ettirish
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}