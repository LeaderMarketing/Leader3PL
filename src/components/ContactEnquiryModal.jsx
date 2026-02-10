import { useState } from 'react';
import { FiX, FiMail, FiPhone, FiUser, FiSend, FiMessageSquare } from 'react-icons/fi';

const AXEL_EMAIL = 'Axel.Henderson@leadersystems.com.au';
const AXEL_PHONE = '08 8112 6006';

export default function ContactEnquiryModal({ onClose }) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const canSend = message.trim().length > 0;

  const handleOpenEmail = () => {
    if (!canSend) return;

    const subject = `Leader 3PL General Enquiry${companyName ? ` - ${companyName}` : ''}`;
    let body = '';
    if (senderName) body += `From: ${senderName}\n`;
    if (senderEmail) body += `Email: ${senderEmail}\n`;
    if (companyName) body += `Company: ${companyName}\n`;
    body += '\n--- Message ---\n\n';
    body += message;

    const mailto = `mailto:${AXEL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_self');
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
          maxWidth: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header */}
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
              Contact Us
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Send a general enquiry to our operations team
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

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Recipient info */}
          <div
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: 10,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--primary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Your enquiry will be sent to
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              Axel Henderson
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
              National Operations Manager
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <FiMail size={12} />
              {AXEL_EMAIL}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              <FiPhone size={12} />
              <a href={`tel:${AXEL_PHONE.replace(/\s/g, '')}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                {AXEL_PHONE}
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-primary)',
                    fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Your Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }} />
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-primary)',
                    fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name (optional)"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-primary)',
                  fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Message *
              </label>
              <div style={{ position: 'relative' }}>
                <FiMessageSquare size={14} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-faint)' }} />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={5}
                  style={{
                    width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-primary)',
                    fontSize: 13, fontFamily: "'Inter', sans-serif", outline: 'none', resize: 'vertical',
                    lineHeight: 1.5,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <button
            onClick={handleOpenEmail}
            disabled={!canSend}
            style={{
              flex: 1, padding: '13px 20px', borderRadius: 10,
              background: canSend ? 'var(--primary)' : 'var(--gray-200)',
              border: 'none',
              color: canSend ? 'var(--white)' : 'var(--text-faint)',
              fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif",
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <FiSend size={15} />
            Open Email Draft
          </button>
          <a
            href={`tel:${AXEL_PHONE.replace(/\s/g, '')}`}
            style={{
              padding: '13px 20px', borderRadius: 10,
              background: 'var(--gray-50)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600,
              fontFamily: "'Inter', sans-serif", textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            <FiPhone size={15} />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
