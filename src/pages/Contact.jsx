import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FAQS, SHOWROOMS, SIZE_CHART, SNEAKERS, useStore } from '../App';
import Tilt3D from '../components/Tilt3D';
import Reveal from '../components/Reveal';

const TOPICS = [
  'VIP Fitting (3D Oyoq Skaneri)',
  'Limited Drop Oldindan Buyurtma',
  'Ulgurji / Hamkorlik taklifi',
  'Buyurtma va yetkazib berish bo‘yicha',
];

export default function Contact() {
  const { pushToast } = useStore();
  const location = useLocation();
  const formRef = useRef(null);

  // VIP Forma holati
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    showroom: SHOWROOMS[0].city,
    topic: TOPICS[0],
    model: SNEAKERS[0].name,
    message: '',
  });
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Interaktiv O'lcham Konvertori holati
  const [selectedEu, setSelectedEu] = useState(42);
  const [footCm, setFootCm] = useState(26.5);

  // FAQ akkordeon holati
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // #size-guide yoki #faq orqali o'tilganda o'sha bo'limga silliq tushish
  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [location.hash]);

  const activeSizeObj =
    SIZE_CHART.find((row) => row.eu === selectedEu) || SIZE_CHART[4];

  const handleSelectEu = (eu) => {
    setSelectedEu(eu);
    const matched = SIZE_CHART.find((row) => row.eu === eu);
    if (matched) {
      setFootCm(matched.cm);
    }
  };

  const handleCmSlider = (cmValue) => {
    const num = Number(cmValue);
    setFootCm(num);
    const closest = SIZE_CHART.reduce((best, curr) =>
      Math.abs(curr.cm - num) < Math.abs(best.cm - num) ? curr : best
    );
    setSelectedEu(closest.eu);
  };

  const handleSelectShowroomForBooking = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      showroom: cityName,
      topic: TOPICS[0],
    }));
    setSubmittedTicket(null);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    pushToast('Showroom tanlandi', `${cityName} uchun VIP bron formasi tayyor.`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      pushToast(
        'Maydonlarni to‘ldiring',
        'Ismingiz va telefon raqamingizni kiritish majburiy.',
        'error'
      );
      return;
    }

    const ticketCode = `VLX-VIP-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket({
      code: ticketCode,
      ...formData,
      createdAt: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    pushToast(
      'VIP so‘rovingiz qabul qilindi!',
      `Chipta raqami: ${ticketCode}`,
      'success'
    );
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      phone: '',
      message: '',
    }));
  };

  return (
    <div className="contact-page">
      {/* ====================================================================
          1. HERO BANNER
         ==================================================================== */}
      <section className="page-hero-banner">
        <div className="container">
          <Reveal>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>GLOBAL FLAGSHIP STUDIOS</span>
            </div>
            <h1 className="section-title" style={{ marginTop: 14 }}>
              Showroomlar & <span className="text-volt">VIP Aloqa</span>
            </h1>
            <p className="section-subtitle">
              Toshkent, Tokio va Milandagi VELOX laboratoriyalariga tashrif
              buyuring, 3D oyoq skaneridan o‘ting yoki aniq EU/US o‘lchamingizni
              quyida hisoblab oling.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 96 }}>
        {/* ====================================================================
            2. 3 TA FLAGSHIP SHOWROOM 3D KARTOCHKALARI
           ==================================================================== */}
        <div className="showrooms-grid">
          {SHOWROOMS.map((room, idx) => (
            <Reveal key={room.city} delay={idx * 90}>
              <Tilt3D maxTilt={10} scale={1.02} style={{ height: '100%' }}>
                <article className="showroom-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span className="drop-badge badge-limited">{room.tag}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--accent-volt)',
                      }}
                    >
                      ● OPEN
                    </span>
                  </div>

                  <h2 className="showroom-city">{room.city}</h2>

                  <p className="showroom-meta">📍 {room.address}</p>
                  <p className="showroom-meta">🕒 {room.hours}</p>
                  <p
                    className="showroom-meta"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
                  >
                    ☎ {room.phone}
                  </p>

                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 14,
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'grid',
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      ✦ {room.feature}
                    </div>

                    <button
                      type="button"
                      className="btn btn-glass btn-sm btn-full"
                      onClick={() => handleSelectShowroomForBooking(room.city)}
                    >
                      VIP Fittingga yozilish →
                    </button>
                  </div>
                </article>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        {/* ====================================================================
            3. VIP FORMA + INTERAKTIV O'LCHAM KONVERTORI
           ==================================================================== */}
        <div className="contact-split">
          {/* CHAP: VIP BRON VA ALOQA FORMASI */}
          <Reveal direction="left">
            <div ref={formRef} className="glass-panel" style={{ height: '100%' }}>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>CONCIERGE SERVICE</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.85rem',
                  marginTop: 14,
                }}
              >
                VIP Fitting & <span className="text-volt">Murojaat</span>
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginTop: 6,
                }}
              >
                Showroomga tashrif buyurish, cheklangan dropni band qilish yoki
                konsultatsiya olish uchun formani to‘ldiring.
              </p>

              {submittedTicket ? (
                <div
                  style={{
                    marginTop: 26,
                    padding: 26,
                    borderRadius: 20,
                    background:
                      'linear-gradient(145deg, rgba(200, 255, 0, 0.12), rgba(14, 18, 28, 0.94))',
                    border: '1px solid rgba(200, 255, 0, 0.35)',
                    display: 'grid',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}
                  >
                    <span className="drop-badge badge-limited">VIP PASS CONFIRMED</span>
                    <strong
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.1rem',
                        color: 'var(--accent-volt)',
                      }}
                    >
                      #{submittedTicket.code}
                    </strong>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem' }}>
                    Murojaatingiz qabul qilindi, {submittedTicket.fullName}!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    VELOX menejeri 15 daqiqa ichida{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {submittedTicket.phone}
                    </strong>{' '}
                    raqamiga qo‘ng‘iroq qilib vaqtni tasdiqlaydi.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: 8,
                      padding: 16,
                      borderRadius: 14,
                      background: 'rgba(6, 7, 10, 0.55)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.86rem',
                    }}
                  >
                    <div className="summary-line">
                      <span>Showroom</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {submittedTicket.showroom}
                      </strong>
                    </div>
                    <div className="summary-line">
                      <span>Mavzu</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {submittedTicket.topic}
                      </strong>
                    </div>
                    <div className="summary-line">
                      <span>Tanlangan model</span>
                      <strong style={{ color: 'var(--accent-volt)' }}>
                        {submittedTicket.model}
                      </strong>
                    </div>
                    <div className="summary-line">
                      <span>Yuborilgan vaqt</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        {submittedTicket.createdAt}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleResetForm}
                  >
                    Yangi so‘rov yuborish
                  </button>
                </div>
              ) : (
                <form className="form-grid" onSubmit={handleFormSubmit}>
                  <div className="form-row-2">
                    <div>
                      <label className="field-label" htmlFor="vip-name">
                        ISMINGIZ *
                      </label>
                      <input
                        id="vip-name"
                        type="text"
                        className="velox-input"
                        placeholder="Jasur Alimov"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="field-label" htmlFor="vip-phone">
                        TELEFON RAQAM *
                      </label>
                      <input
                        id="vip-phone"
                        type="tel"
                        className="velox-input"
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div>
                      <label className="field-label" htmlFor="vip-showroom">
                        SHOWROOM MANZILI
                      </label>
                      <select
                        id="vip-showroom"
                        className="velox-select"
                        value={formData.showroom}
                        onChange={(e) =>
                          setFormData({ ...formData, showroom: e.target.value })
                        }
                      >
                        {SHOWROOMS.map((room) => (
                          <option key={room.city} value={room.city}>
                            {room.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="vip-topic">
                        MUROJAAT TURI
                      </label>
                      <select
                        id="vip-topic"
                        className="velox-select"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                      >
                        {TOPICS.map((topic) => (
                          <option key={topic} value={topic}>
                            {topic}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="vip-model">
                      QIZIQAYOTGAN MODEL
                    </label>
                    <select
                      id="vip-model"
                      className="velox-select"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                    >
                      {SNEAKERS.map((sneaker) => (
                        <option key={sneaker.id} value={sneaker.name}>
                          {sneaker.name} — ${sneaker.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label" htmlFor="vip-msg">
                      QO‘SHIMCHA IZOH
                    </label>
                    <textarea
                      id="vip-msg"
                      rows={4}
                      className="velox-textarea"
                      placeholder="Qaysi kun va soatda kelishingiz qulay yoki o‘lcham bo‘yicha savolingizni yozing..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-full">
                    VIP Chipta olish va yuborish →
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* O'NG: INTERAKTIV O'LCHAM KONVERTORI */}
          <Reveal direction="right" delay={100}>
            <div
              id="size-guide"
              className="glass-panel"
              style={{ height: '100%', scrollMarginTop: 110 }}
            >
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <span>PRECISION FIT LAB</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.85rem',
                  marginTop: 14,
                }}
              >
                O‘lcham <span className="text-volt">Konvertori</span>
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                  marginTop: 6,
                }}
              >
                Oyoq uzunligini (sm) slayderda belgilang yoki EU o‘lchamini
                tanlang — aniq US, UK va CM mosligini darhol ko‘ring.
              </p>

              {/* Oyoq uzunligi slayderi */}
              <div
                style={{
                  marginTop: 24,
                  padding: 18,
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div className="filter-group-title" style={{ marginBottom: 8 }}>
                  <span>OYOQ UZUNLIGI (SM)</span>
                  <span style={{ color: 'var(--accent-volt)', fontWeight: 700 }}>
                    {footCm.toFixed(1)} sm
                  </span>
                </div>

                <input
                  type="range"
                  min="24.0"
                  max="30.0"
                  step="0.5"
                  value={footCm}
                  onChange={(e) => handleCmSlider(e.target.value)}
                  className="range-slider"
                  aria-label="Oyoq uzunligi santimetrda"
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    marginTop: 6,
                  }}
                >
                  <span>24.0 sm</span>
                  <span>27.0 sm</span>
                  <span>30.0 sm</span>
                </div>
              </div>

              {/* 4 ta natija bloki */}
              <div className="converter-result-grid">
                <div className="converter-box">
                  <span>EU</span>
                  <strong>{activeSizeObj.eu}</strong>
                </div>
                <div className="converter-box">
                  <span>US</span>
                  <strong>{activeSizeObj.us}</strong>
                </div>
                <div className="converter-box">
                  <span>UK</span>
                  <strong>{activeSizeObj.uk}</strong>
                </div>
                <div className="converter-box">
                  <span>CM</span>
                  <strong>{activeSizeObj.cm.toFixed(1)}</strong>
                </div>
              </div>

              {/* EU tezkor tanlash tugmalari */}
              <div>
                <div className="filter-group-title">
                  <span>YOKI EU O‘LCHAMINI TANLANG</span>
                </div>
                <div className="size-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {SIZE_CHART.map((row) => (
                    <button
                      key={row.eu}
                      type="button"
                      className={`size-chip ${selectedEu === row.eu ? 'active' : ''}`}
                      onClick={() => handleSelectEu(row.eu)}
                    >
                      EU {row.eu}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit tavsiyasi */}
              <div
                style={{
                  marginTop: 22,
                  padding: 16,
                  borderRadius: 14,
                  background: 'rgba(0, 229, 255, 0.06)',
                  border: '1px solid rgba(0, 229, 255, 0.24)',
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: 4 }}>
                  PRO TAVSIYA:
                </strong>
                Kechki payt oyoq biroz kengaygani uchun o‘lchovni kechqurun oling.
                Agar oyoq uzunligingiz ikki o‘lcham o‘rtasida bo‘lsa, Running
                modellari uchun <strong>EU {Math.min(46, activeSizeObj.eu + 1)}</strong> ni
                tanlash qulayroq.
              </div>

              <div style={{ marginTop: 22 }}>
                <Link to="/shop" className="btn btn-glass btn-full">
                  EU {activeSizeObj.eu} mavjud modellarni ko‘rish →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ====================================================================
            4. KO'P SO'RALADIGAN SAVOLLAR (FAQ)
           ==================================================================== */}
        <section id="faq" style={{ scrollMarginTop: 110 }}>
          <Reveal>
            <div className="section-header" style={{ marginBottom: 28 }}>
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  <span>SUPPORT & WARRANTY</span>
                </div>
                <h2 className="section-title">
                  Ko‘p so‘raladigan <span className="text-volt">savollar</span>
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="faq-list">
            {FAQS.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <Reveal key={item.q} delay={idx * 60}>
                  <div
                    className="faq-item"
                    style={{
                      borderColor: isOpen
                        ? 'rgba(200, 255, 0, 0.4)'
                        : 'var(--border-subtle)',
                    }}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.25rem',
                          color: isOpen ? 'var(--accent-volt)' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && <div className="faq-answer">{item.a}</div>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}