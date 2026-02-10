import { useState } from 'react';
import { FiX, FiMail, FiDownload, FiPhone, FiUser, FiSend } from 'react-icons/fi';
import { generateQuoteText, generateMailtoLink } from '../utils/generateQuoteText';
import { generatePdf } from '../utils/generatePdf';

const AXEL_EMAIL = 'Axel.Henderson@leadersystems.com.au';
const AXEL_PHONE = '08 8112 6006';

export default function SendQuoteModal({
  items,
  subtotal,
  gst,
  total,
  warehouse,
  companyName,
  onClose,
}) {
  const [isPartner, setIsPartner] = useState(true);
  const [amEmail, setAmEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const quoteText = generateQuoteText(items, subtotal, gst, total, warehouse, companyName);

  const buildEmailBody = () => {
    let body = '';
    if (senderName) body += `From: ${senderName}\n`;
    if (senderEmail) body += `Reply-to: ${senderEmail}\n`;
    if (companyName) body += `Company: ${companyName}\n`;
    body += '\n' + quoteText;
    return body;
  };

  const handleOpenEmail = () => {
    const toEmail = isPartner ? amEmail : AXEL_EMAIL;
    if (isPartner && !amEmail) {
      return;
    }
    const subject = isPartner
      ? `Leader 3PL Quote Estimate${companyName ? ` - ${companyName}` : ''}`
      : `New 3PL Enquiry${companyName ? ` - ${companyName}` : ''}`;

    const body = buildEmailBody();
    const mailto = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_self');
  };

  const handleDownloadPdf = () => {
    generatePdf(items, subtotal, gst, total, warehouse, companyName);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          background: 'var(--white)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Send Your Quote
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Choose how you'd like to send this estimate
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--gray-50)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Partner Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            <label
              onClick={() => setIsPartner(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${isPartner ? 'var(--primary)' : 'var(--border)'}`,
                background: isPartner ? 'var(--primary-50)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${isPartner ? 'var(--primary)' : 'var(--gray-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isPartner && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                    }}
                  />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  I'm a Leader Partner / Reseller
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Send this quote to your account manager
                </div>
              </div>
            </label>

            <label
              onClick={() => setIsPartner(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${!isPartner ? 'var(--primary)' : 'var(--border)'}`,
                background: !isPartner ? 'var(--primary-50)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${!isPartner ? 'var(--primary)' : 'var(--gray-300)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {!isPartner && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                    }}
                  />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  I'd like to enquire about Leader 3PL
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Send this as a new 3PL enquiry
                </div>
              </div>
            </label>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: 'var(--border)',
              marginBottom: 20,
            }}
          />

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {isPartner && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  Account Manager's Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail
                    size={14}
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-faint)',
                    }}
                  />
                  <input
                    type="email"
                    value={amEmail}
                    onChange={(e) => setAmEmail(e.target.value)}
                    placeholder="e.g. john.smith@leadersystems.com.au"
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--white)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            )}

            {!isPartner && (
              <div
                style={{
                  background: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--primary)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Your enquiry will be sent to
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  Axel Henderson
                </div>
                <div
                  style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}
                >
                  National Operations Manager
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 6,
                  }}
                >
                  <FiMail size={12} />
                  {AXEL_EMAIL}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginTop: 4,
                  }}
                >
                  <FiPhone size={12} />
                  {AXEL_PHONE}
                </div>
              </div>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-faint)',
                  }}
                />
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                }}
              >
                Your Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-faint)',
                  }}
                />
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--white)',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <button
            onClick={handleOpenEmail}
            disabled={isPartner && !amEmail}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: 10,
              background: isPartner && !amEmail ? 'var(--gray-200)' : 'var(--primary)',
              border: 'none',
              color: isPartner && !amEmail ? 'var(--text-faint)' : 'var(--white)',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: isPartner && !amEmail ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <FiSend size={15} />
            Open Email Draft
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDownloadPdf}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: 10,
                background: 'var(--gray-50)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                fontSize: 13,
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
              <FiDownload size={14} />
              Download PDF
            </button>
            <button
              onClick={handleCopyQuote}
              style={{
                flex: 1,
                padding: '11px 14px',
                borderRadius: 10,
                background: copied ? 'var(--primary-50)' : 'var(--gray-50)',
                border: `1px solid ${copied ? 'var(--primary-200)' : 'var(--border)'}`,
                color: copied ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: 13,
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
              <FiMail size={14} />
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
