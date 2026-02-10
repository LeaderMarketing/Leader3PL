import { useState } from 'react';
import { FiExternalLink, FiMessageCircle, FiPhone, FiMenu, FiX } from 'react-icons/fi';

export default function Header({ onContactClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    textDecoration: 'none',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  };

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="header-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <div className="header-logo">
          <img
            src={`${import.meta.env.BASE_URL}images/leader3pl-logo.png`}
            alt="Leader 3PL"
            style={{ maxHeight: 20, width: 'auto', display: 'block' }}
          />
        </div>

        <div className="header-nav">
          <a
            href="https://web.leadersystems.com.au/become-a-reseller/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...linkStyle,
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              color: 'var(--primary)',
            }}
          >
            <FiExternalLink size={13} />
            Become a Reseller
          </a>
          <button
            onClick={onContactClick}
            style={{
              ...linkStyle,
              background: 'var(--white)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <FiMessageCircle size={13} />
            Contact
          </button>
          <a
            href="tel:0881126006"
            style={{
              ...linkStyle,
              padding: '8px 14px',
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--white)',
            }}
          >
            <FiPhone size={13} />
            08 8112 6006
          </a>
        </div>

        <div className="header-burger-spacer" />
      </div>

      {menuOpen && (
        <div className="header-mobile-menu">
          <a
            href="https://web.leadersystems.com.au/become-a-reseller/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...linkStyle,
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              color: 'var(--primary)',
              justifyContent: 'center',
            }}
          >
            <FiExternalLink size={13} />
            Become a Reseller
          </a>
          <button
            onClick={() => {
              onContactClick();
              setMenuOpen(false);
            }}
            style={{
              ...linkStyle,
              background: 'var(--white)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              justifyContent: 'center',
            }}
          >
            <FiMessageCircle size={13} />
            Contact
          </button>
          <a
            href="tel:0881126006"
            style={{
              ...linkStyle,
              padding: '8px 14px',
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--white)',
              justifyContent: 'center',
            }}
          >
            <FiPhone size={13} />
            08 8112 6006
          </a>
        </div>
      )}
    </header>
  );
}
