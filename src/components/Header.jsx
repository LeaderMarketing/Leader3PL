import { FiExternalLink, FiMessageCircle, FiPhone } from 'react-icons/fi';

export default function Header({ onContactClick }) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--white)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={`${import.meta.env.BASE_URL}images/leader3pl-logo.png`}
            alt="Leader 3PL"
            style={{
              maxHeight: 20,
              width: 'auto',
              display: 'block',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a
            href="https://web.leadersystems.com.au/become-a-reseller/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-200)',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <FiExternalLink size={13} />
            Become a Reseller
          </a>
          <button
            onClick={onContactClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--white)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <FiMessageCircle size={13} />
            Contact
          </button>
          <a
            href="tel:0881126006"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: 'var(--primary)',
              border: 'none',
              color: 'var(--white)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <FiPhone size={13} />
            08 8112 6006
          </a>
        </div>
      </div>
    </header>
  );
}
