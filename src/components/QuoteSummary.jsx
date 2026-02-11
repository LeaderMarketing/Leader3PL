import { useState } from 'react';
import { FiTrash2, FiSend, FiDownload, FiCopy, FiPackage, FiChevronDown, FiChevronUp, FiMinus, FiPlus } from 'react-icons/fi';
import AnimatedNumber from './AnimatedNumber';
import { formatCurrency } from '../utils/formatCurrency';
import { generateQuoteText } from '../utils/generateQuoteText';
import { generatePdf } from '../utils/generatePdf';
import { COST_TYPE_COLORS } from '../data/services';

const SECTION_CONFIG = [
  { key: 'upfront', label: 'Up-Front Costs' },
  { key: 'storage', label: 'Ongoing Storage Costs' },
  { key: 'inventory', label: 'Inventory Costs' },
];

export default function QuoteSummary({
  items,
  subtotal,
  gst,
  total,
  warehouse,
  warehouses,
  onWarehouseChange,
  companyName,
  onClear,
  onSendQuote,
  onRemoveItem,
  onQtyChange,
}) {
  const [expandedSections, setExpandedSections] = useState({
    upfront: true,
    storage: true,
    inventory: true,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = SECTION_CONFIG.map((cfg) => {
    const sectionItems = items.filter((i) => i.costType === cfg.key);
    return {
      ...cfg,
      items: sectionItems,
      subtotal: sectionItems.reduce((sum, i) => sum + i.rate * i.qty, 0),
    };
  }).filter((s) => s.items.length > 0);

  const handleCopyToClipboard = () => {
    const text = generateQuoteText(items, subtotal, gst, total, warehouse, companyName);
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleDownloadPdf = () => {
    generatePdf(items, subtotal, gst, total, warehouse, companyName);
  };

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        position: 'sticky',
        top: 76,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--primary-50)',
          borderBottom: '1px solid var(--primary-100)',
          padding: '20px 22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'var(--primary)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Quote Estimate
          </span>
          {items.length > 0 && (
            <button
              onClick={onClear}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-faint)',
                fontSize: 11,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <FiTrash2 size={11} />
              Clear all
            </button>
          )}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: 'var(--primary)',
            lineHeight: 1.1,
            marginTop: 8,
          }}
        >
          <AnimatedNumber value={subtotal} />
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text-faint)',
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          ex GST / AUD
        </div>
        {subtotal > 0 && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 6,
              fontWeight: 600,
            }}
          >
            <AnimatedNumber value={total} /> <span style={{ fontWeight: 400, fontSize: 11 }}>inc GST</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '16px 22px' }}>
        {companyName && (
          <div
            style={{
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Prepared for
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            >
              {companyName}
            </div>
          </div>
        )}

        {warehouse && (
          <div
            style={{
              marginBottom: 14,
              paddingBottom: 12,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--text-faint)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Warehouse
            </div>
            {warehouses && onWarehouseChange ? (
              <select
                className="warehouse-select"
                value={warehouse.state}
                onChange={(e) => onWarehouseChange(e.target.value)}
              >
                {warehouses.map((wh) => (
                  <option key={wh.state} value={wh.state}>
                    {wh.city}, {wh.state}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                {warehouse.city}, {warehouse.state}
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>
              {warehouse.address}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '30px 10px',
              color: 'var(--text-faint)',
              fontSize: 13,
            }}
          >
            <FiPackage
              size={32}
              style={{ display: 'block', margin: '0 auto 10px', opacity: 0.4 }}
            />
            Add services to build your quote
          </div>
        ) : (
          <>
            {sections.map((section) => (
              <div key={section.key} style={{ marginBottom: 14 }}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 0 6px',
                    marginBottom: expandedSections[section.key] ? 4 : 0,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 10,
                      color: COST_TYPE_COLORS[section.key] || 'var(--text-faint)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: COST_TYPE_COLORS[section.key] || 'var(--text-faint)',
                        flexShrink: 0,
                      }}
                    />
                    {section.label} ({section.items.length})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {formatCurrency(section.subtotal)}
                    </span>
                    {expandedSections[section.key] ? (
                      <FiChevronUp size={12} style={{ color: 'var(--text-faint)' }} />
                    ) : (
                      <FiChevronDown size={12} style={{ color: 'var(--text-faint)' }} />
                    )}
                  </span>
                </button>

                {/* Section Items */}
                {expandedSections[section.key] && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      maxHeight: 200,
                      overflowY: 'auto',
                      paddingLeft: 13,
                      borderLeft: `2px solid ${COST_TYPE_COLORS[section.key] || 'var(--border)'}`,
                      marginLeft: 3,
                    }}
                  >
                    {section.items.map((item) => (
                      <div
                        key={item.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 12,
                          padding: '5px 0',
                          gap: 6,
                        }}
                      >
                        <button
                          onClick={() => onRemoveItem && onRemoveItem(item.code)}
                          title="Remove service"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-faint)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            padding: 0,
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-faint)')}
                        >
                          <FiTrash2 size={11} />
                        </button>
                        <div style={{ color: 'var(--text-secondary)', flex: 1, lineHeight: 1.35, minWidth: 0, wordBreak: 'break-word' }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0,
                            flexShrink: 0,
                          }}
                        >
                          <button
                            onClick={() => onQtyChange && onQtyChange(item.code, item.qty - 1)}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '4px 0 0 4px',
                              border: '1px solid var(--border)',
                              background: 'var(--gray-50)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                              fontSize: 11,
                            }}
                          >
                            <FiMinus size={10} />
                          </button>
                          <div
                            style={{
                              width: 26,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              borderTop: '1px solid var(--border)',
                              borderBottom: '1px solid var(--border)',
                              background: 'var(--white)',
                            }}
                          >
                            {item.qty}
                          </div>
                          <button
                            onClick={() => onQtyChange && onQtyChange(item.code, item.qty + 1)}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '0 4px 4px 0',
                              border: '1px solid var(--border)',
                              background: 'var(--gray-50)',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0,
                              fontSize: 11,
                            }}
                          >
                            <FiPlus size={10} />
                          </button>
                        </div>
                        <div
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: 11,
                            fontWeight: 600,
                            marginLeft: 4,
                            whiteSpace: 'nowrap',
                            minWidth: 52,
                            textAlign: 'right',
                          }}
                        >
                          {formatCurrency(item.rate * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Totals Breakdown */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 12 }}>
              {sections.map((section) => (
                <div
                  key={section.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    marginBottom: 5,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: COST_TYPE_COLORS[section.key],
                        flexShrink: 0,
                      }}
                    />
                    {section.label}
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(section.subtotal)}</span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: '1px solid var(--border)',
                  marginBottom: 6,
                }}
              >
                <span>Subtotal (ex GST)</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: 'var(--text-faint)',
                  marginBottom: 6,
                }}
              >
                <span>GST (10%)</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(gst)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 15,
                  color: 'var(--primary)',
                  fontWeight: 700,
                  paddingTop: 8,
                  borderTop: '1px solid var(--border)',
                }}
              >
                <span>Total (inc GST)</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {items.length > 0 && (
        <div style={{ padding: '0 22px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onSendQuote}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: 10,
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--white)',
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <FiSend size={14} />
            Send Quote
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownloadPdf}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--gray-50)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <FiDownload size={13} />
              PDF
            </button>
            <button
              onClick={handleCopyToClipboard}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'var(--gray-50)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <FiCopy size={13} />
              Copy
            </button>
          </div>

          <div
            style={{
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--text-faint)',
              marginTop: 2,
            }}
          >
            Estimate only -- contact your Leader account manager for a formal quote
          </div>
        </div>
      )}
    </div>
  );
}
