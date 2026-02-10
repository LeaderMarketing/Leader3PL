import { FiMinus, FiPlus, FiInfo } from 'react-icons/fi';
import { formatCurrency } from '../utils/formatCurrency';

export default function ServiceCard({ item, qty, onQtyChange }) {
  const isActive = qty > 0;
  const isPoa = item.poa === true;

  return (
    <div
      className="service-card"
      style={{
        background: isActive ? 'var(--primary-50)' : 'var(--white)',
        border: `1px solid ${isActive ? 'var(--primary-200)' : 'var(--border)'}`,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isActive && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: 'var(--primary)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: 'var(--text-faint)',
              background: 'var(--gray-100)',
              padding: '2px 7px',
              borderRadius: 4,
              letterSpacing: '0.05em',
              fontWeight: 500,
            }}
          >
            {item.code}
          </span>
          {isPoa && (
            <span
              style={{
                fontSize: 9,
                color: 'var(--primary)',
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                padding: '2px 7px',
                borderRadius: 4,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              POA
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {item.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          {isPoa ? (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              <FiInfo size={12} />
              {item.poaNote}
            </span>
          ) : (
            <>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>
                {formatCurrency(item.rate)}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                {item.unit}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: 'var(--text-faint)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                ex GST
              </span>
            </>
          )}
        </div>
      </div>

      {!isPoa && (
        <div className="service-card-controls">
          <button
            onClick={() => onQtyChange(Math.max(0, qty - 1))}
            style={{
              width: 34, height: 34, borderRadius: '8px 0 0 8px',
              border: '1px solid var(--border)', background: 'var(--gray-50)',
              color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <FiMinus size={14} />
          </button>
          <input
            type="number"
            value={qty || ''}
            placeholder="0"
            onChange={(e) => onQtyChange(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: 52, height: 34,
              border: '1px solid var(--border)', borderLeft: 'none', borderRight: 'none',
              background: 'var(--white)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-faint)',
              textAlign: 'center', fontSize: 13, fontWeight: 600,
              fontFamily: "'Inter', sans-serif", outline: 'none',
            }}
          />
          <button
            onClick={() => onQtyChange(qty + 1)}
            style={{
              width: 34, height: 34, borderRadius: '0 8px 8px 0',
              border: '1px solid var(--border)', background: 'var(--gray-50)',
              color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <FiPlus size={14} />
          </button>
        </div>
      )}

      {isActive && !isPoa && (
        <div className="service-card-total">
          {formatCurrency(item.rate * qty)}
        </div>
      )}
    </div>
  );
}
