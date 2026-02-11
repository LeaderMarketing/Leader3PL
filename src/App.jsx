import { useState, useRef, useEffect } from 'react';
import {
  FiSearch,
  FiTruck,
  FiArchive,
  FiPackage,
  FiMapPin,
  FiSend,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import Header from './components/Header';
import WarehouseMap from './components/WarehouseMap';
import ServiceCard from './components/ServiceCard';
import QuoteSummary from './components/QuoteSummary';
import SendQuoteModal from './components/SendQuoteModal';
import ContactEnquiryModal from './components/ContactEnquiryModal';
import ContactJCModal from './components/ContactJCModal';
import { WAREHOUSES } from './data/warehouses';
import { SERVICES } from './data/services';
import { formatCurrency } from './utils/formatCurrency';

const CATEGORY_ICONS = {
  truck: FiTruck,
  archive: FiArchive,
  package: FiPackage,
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState('upfront');
  const [quantities, setQuantities] = useState({});
  const [warehouse, setWarehouse] = useState('SA');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showJCModal, setShowJCModal] = useState(false);
  const [showMobileQuote, setShowMobileQuote] = useState(false);
  const mapRef = useRef(null);
  const tabsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkTabsArrows = () => {
    const el = tabsRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const timer = setTimeout(checkTabsArrows, 100);
    window.addEventListener('resize', checkTabsArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTabsArrows);
    };
  }, [searchQuery]);

  const scrollTabs = (dir) => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 150, behavior: 'smooth' });
  };

  const handleWarehouseSelect = (state) => {
    setWarehouse(state);
    // The MapController inside WarehouseMap will fly + open popup via useEffect
  };

  const setQty = (code, qty) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[code];
      else next[code] = qty;
      return next;
    });
  };

  const removeItem = (code) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[code];
      return next;
    });
  };

  const clearAll = () => setQuantities({});

  // Gather selected items (only priced items, not POA) — tagged with costType
  const quoteItems = [];
  Object.entries(SERVICES).forEach(([key, cat]) => {
    cat.items.forEach((item) => {
      const qty = quantities[item.code] || 0;
      if (qty > 0 && !item.poa) quoteItems.push({ ...item, qty, costType: key });
    });
  });

  const subtotal = quoteItems.reduce((sum, i) => sum + i.rate * i.qty, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;
  const totalItemCount = quoteItems.length;
  const selectedWarehouse = WAREHOUSES.find((w) => w.state === warehouse);

  const currentCategory = SERVICES[activeCategory];
  const filteredItems = searchQuery
    ? Object.values(SERVICES)
        .flatMap((cat) => cat.items)
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : currentCategory.items;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      <Header onContactClick={() => setShowContactModal(true)} />

      {/* ===== HERO SECTION — Map Background ===== */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: 720,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Map sits absolutely behind everything */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <WarehouseMap
            ref={mapRef}
            selected={warehouse}
            onSelect={handleWarehouseSelect}
            style={{ height: '100%' }}
          />
        </div>

        {/* Semi-transparent overlay — top portion only for text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '55%',
            zIndex: 1,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content overlay — sits at top */}
        <div
          className="hero-overlay-content"
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '40px 28px 24px',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(37,99,235,0.10)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: 100,
                padding: '6px 16px',
                marginBottom: 20,
              }}
            >
              <FiMapPin size={12} color="var(--primary)" />
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--primary)',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                }}
              >
                ONLY DISTRIBUTOR WITH 5-STATE COVERAGE
              </span>
            </div>
            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: 14,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Warehousing & Fulfilment
              <br />
              <span style={{ color: 'var(--primary)' }}>Across Australia</span>
            </h1>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: 540,
                margin: '0 auto 28px',
              }}
            >
              End-to-end 3PL services from receiving to dispatch. Build a custom
              quote below to estimate costs for your logistics needs.
            </p>
          </div>

          {/* Warehouse buttons */}
          <div
            className="warehouse-buttons"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              pointerEvents: 'auto',
            }}
          >
            {WAREHOUSES.map((wh) => (
              <button
                key={wh.state}
                onClick={() => handleWarehouseSelect(wh.state)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  background:
                    warehouse === wh.state
                      ? 'var(--primary)'
                      : 'rgba(255,255,255,0.85)',
                  color:
                    warehouse === wh.state
                      ? 'var(--white)'
                      : 'var(--text-muted)',
                  border: `1px solid ${
                    warehouse === wh.state
                      ? 'var(--primary)'
                      : 'rgba(226,232,240,0.8)'
                  }`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(6px)',
                  boxShadow:
                    warehouse === wh.state
                      ? '0 2px 8px rgba(37,99,235,0.25)'
                      : '0 1px 4px rgba(0,0,0,0.08)',
                }}
              >
                {wh.state} &mdash; {wh.city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-grid">
        {/* Left Column - Services */}
        <div style={{ minWidth: 0 }}>
          {/* Search */}
          <div className="search-wrapper">
            <FiSearch size={15} className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div className="tabs-scroll-wrapper">
              {showLeftArrow && (
                <button
                  className="tabs-arrow tabs-arrow-left"
                  onClick={() => scrollTabs(-1)}
                  aria-label="Scroll tabs left"
                >
                  <FiChevronLeft size={16} />
                </button>
              )}
              <div
                className="tabs-scroll-inner"
                ref={tabsRef}
                onScroll={checkTabsArrows}
              >
                {Object.entries(SERVICES).map(([key, cat]) => {
                  const IconComponent = CATEGORY_ICONS[cat.iconKey];
                  const catCount = cat.items.reduce(
                    (c, item) => c + (quantities[item.code] > 0 ? 1 : 0),
                    0
                  );
                  const isActive = activeCategory === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: 'nowrap',
                        background: isActive ? 'var(--primary)' : 'var(--white)',
                        color: isActive ? 'var(--white)' : 'var(--text-muted)',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: isActive
                          ? '0 2px 8px rgba(37,99,235,0.2)'
                          : 'var(--shadow-sm)',
                      }}
                    >
                      {IconComponent && <IconComponent size={13} />}
                      {cat.label}
                      {catCount > 0 && (
                        <span
                          style={{
                            background: isActive
                              ? 'rgba(255,255,255,0.3)'
                              : 'var(--primary)',
                            color: isActive ? 'var(--white)' : 'var(--white)',
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: 10,
                          }}
                        >
                          {catCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {showRightArrow && (
                <button
                  className="tabs-arrow tabs-arrow-right"
                  onClick={() => scrollTabs(1)}
                  aria-label="Scroll tabs right"
                >
                  <FiChevronRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* Search results label */}
          {searchQuery && (
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 14,
                fontWeight: 500,
              }}
            >
              {filteredItems.length} result
              {filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}

          {/* Section description */}
          {!searchQuery && SERVICES[activeCategory]?.description && (
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 12,
                fontWeight: 500,
                fontStyle: 'italic',
              }}
            >
              {SERVICES[activeCategory].description}
            </div>
          )}

          {/* Pricing note */}
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-faint)',
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            All prices shown are in AUD, exclusive of GST.
          </div>

          {/* Service cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredItems.map((item, idx) => (
              <div
                key={item.code}
                style={{ animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}
              >
                <ServiceCard
                  item={item}
                  qty={quantities[item.code] || 0}
                  onQtyChange={(qty) => setQty(item.code, qty)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Quote Summary (desktop) */}
        <div className="quote-sidebar">
          <QuoteSummary
            items={quoteItems}
            subtotal={subtotal}
            gst={gst}
            total={total}
            warehouse={selectedWarehouse}
            warehouses={WAREHOUSES}
            onWarehouseChange={handleWarehouseSelect}
            onClear={clearAll}
            onSendQuote={() => setShowSendModal(true)}
            onRemoveItem={removeItem}
            onQtyChange={setQty}
          />
        </div>
      </div>

      {/* ===== MOBILE FLOATING BAR ===== */}
      {totalItemCount > 0 && (
        <div className="mobile-quote-bar">
          <button
            onClick={() => setShowMobileQuote(!showMobileQuote)}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 12,
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--white)',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiSend size={15} />
              View Quote ({totalItemCount} item{totalItemCount > 1 ? 's' : ''})
            </span>
            <span>{formatCurrency(subtotal)} ex GST</span>
          </button>
        </div>
      )}

      {/* Mobile Quote Panel */}
      {showMobileQuote && (
        <div className="mobile-quote-panel">
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div
              onClick={() => setShowMobileQuote(false)}
              style={{
                flex: 1,
                background: 'rgba(15,23,42,0.4)',
              }}
            />
            <div
              style={{
                background: 'var(--white)',
                borderRadius: '16px 16px 0 0',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <QuoteSummary
                items={quoteItems}
                subtotal={subtotal}
                gst={gst}
                total={total}
                warehouse={selectedWarehouse}
                warehouses={WAREHOUSES}
                onWarehouseChange={handleWarehouseSelect}
                onClear={clearAll}
                onSendQuote={() => {
                  setShowMobileQuote(false);
                  setShowSendModal(true);
                }}
                onRemoveItem={removeItem}
                onQtyChange={setQty}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '24px 28px',
          textAlign: 'center',
          color: 'var(--text-faint)',
          fontSize: 11,
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto', lineHeight: 1.7 }}>
          2026 Leader Computers Pty Ltd. This tool provides estimates only
          &mdash; Contact your Leader account manager for formal quotations.
          All prices are in AUD, exclusive of GST unless stated. Got feedback
          and suggestions for this tool?{' '}
          <button
            onClick={() => setShowJCModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: "'Inter', sans-serif",
              padding: 0,
            }}
          >
            Contact JC
          </button>
        </div>
      </footer>

      {/* ===== SEND QUOTE MODAL ===== */}
      {showSendModal && (
        <SendQuoteModal
          items={quoteItems}
          subtotal={subtotal}
          gst={gst}
          total={total}
          warehouse={selectedWarehouse}
          companyName=""
          onClose={() => setShowSendModal(false)}
        />
      )}

      {showContactModal && (
        <ContactEnquiryModal
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showJCModal && (
        <ContactJCModal
          onClose={() => setShowJCModal(false)}
        />
      )}
    </div>
  );
}
