import { useState, useEffect, useRef } from "react";

const WAREHOUSES = [
  { state: "SA", city: "Adelaide", address: "165–187 Franklin St, Adelaide SA 5000" },
  { state: "QLD", city: "Brisbane", address: "637 Toohey Road, Salisbury QLD 4107" },
  { state: "NSW", city: "Sydney", address: "Unit 2, 44 Boorea St, Lidcombe 2141" },
  { state: "VIC", city: "Melbourne", address: "37-53 Whiteside Rd, Clayton South VIC 3169" },
  { state: "WA", city: "Perth", address: "39 King Edward Rd, Osborne Park WA 6017" },
];

const SERVICES = {
  popular: {
    label: "Popular Services",
    icon: "⭐",
    items: [
      { code: "3PL-002", name: "20' Container Hand Unpack", rate: 685, unit: "per container" },
      { code: "3PL-003", name: "40' Container Hand Unpack", rate: 835, unit: "per container" },
      { code: "3PL-009", name: "Receiving In — Per Pallet", rate: 5.75, unit: "per pallet" },
      { code: "3PL-005", name: "Receiving In — Per Item/Carton", rate: 1.0, unit: "per item" },
      { code: "3PL-016", name: "Pick Fee — Per Carton/Item", rate: 2.5, unit: "per item" },
      { code: "3PL-006", name: "Pick Fee — Per Pallet", rate: 5.75, unit: "per pallet" },
      { code: "3PL-019", name: "Load Out — Per Pallet", rate: 5.2, unit: "per pallet" },
      { code: "3PL-020", name: "Load Out — Per Carton", rate: 2.5, unit: "per carton" },
      { code: "3PL-018", name: "Shipment Label", rate: 0.25, unit: "per label" },
      { code: "3PL-008", name: "Shrink Wrapping — Per Pallet", rate: 7.0, unit: "per pallet" },
      { code: "3PL-053", name: "Shrink Wrapping — Per Carton", rate: 3.75, unit: "per carton" },
    ],
  },
  storage: {
    label: "Storage",
    icon: "📦",
    items: [
      { code: "3PL-054", name: "Pallet Storage — Standard (under 1.4m)", rate: 8.5, unit: "per pallet/week" },
      { code: "3PL-055", name: "Pallet Storage — Oversized (over 1.4m)", rate: 11.5, unit: "per pallet/week" },
      { code: "3PL-056", name: "Bulk Storage (60+ CBM)", rate: 1.0, unit: "per CBM/week" },
      { code: "3PL-013", name: "Inventory Management System & Weekly Admin", rate: 131, unit: "per week" },
    ],
  },
  handling: {
    label: "Handling & Labour",
    icon: "🔧",
    items: [
      { code: "3PL-021", name: "Hourly Labour", rate: 79, unit: "per hour" },
      { code: "3PL-043", name: "General Labour", rate: 63, unit: "per hour" },
      { code: "3PL-045", name: "Overtime Labour", rate: 95, unit: "per hour" },
      { code: "3PL-022", name: "Urgent Unpack Fee", rate: 205, unit: "per event" },
      { code: "3PL-039", name: "Palletize", rate: 47, unit: "per pallet" },
      { code: "3PL-040", name: "Labelling", rate: 1.05, unit: "per item" },
      { code: "3PL-004", name: "Container Cleaning", rate: 32, unit: "per container" },
      { code: "3PL-051", name: "Lift On/Off", rate: 3.5, unit: "per event" },
    ],
  },
  documentation: {
    label: "Documentation & Admin",
    icon: "📋",
    items: [
      { code: "3PL-001", name: "Inbound Documentation Fee", rate: 19.5, unit: "per document" },
      { code: "3PL-014", name: "Shipment Documentation Fee", rate: 18.5, unit: "per shipment" },
      { code: "3PL-007", name: "Inbound LPN Label", rate: 0.25, unit: "per label" },
      { code: "3PL-010", name: "Put Away LPN", rate: 3.65, unit: "per LPN" },
      { code: "3PL-026", name: "Create a New SKU", rate: 30, unit: "per SKU" },
      { code: "3PL-047", name: "Customer Manual Booking", rate: 5.25, unit: "per booking" },
      { code: "3PL-048", name: "CSG Manual Booking", rate: 10.5, unit: "per booking" },
      { code: "3PL-050", name: "Administration Fee", rate: 52, unit: "per event" },
      { code: "3PL-049", name: "IT Development", rate: 136, unit: "per hour" },
    ],
  },
  returns: {
    label: "Returns & QC",
    icon: "↩️",
    items: [
      { code: "3PL-036", name: "Return Label", rate: 23, unit: "per label" },
      { code: "3PL-037", name: "Return Receipt", rate: 8.5, unit: "per receipt" },
      { code: "3PL-038", name: "Return to Inventory", rate: 12.6, unit: "per item" },
      { code: "3PL-041", name: "Dimension / Weight Check", rate: 8.5, unit: "per item" },
      { code: "3PL-042", name: "Inspection", rate: 8.5, unit: "per item" },
      { code: "3PL-034", name: "Photo Provision", rate: 5.25, unit: "per photo" },
      { code: "3PL-031", name: "Stock Counting", rate: 1.5, unit: "per item" },
      { code: "3PL-032", name: "Long Stock Take", rate: 63, unit: "per event" },
    ],
  },
  special: {
    label: "Special & Urgent",
    icon: "⚡",
    items: [
      { code: "3PL-025", name: "Urgent Shipment", rate: 152, unit: "per shipment" },
      { code: "3PL-024", name: "Shipment Cancellation or Variation", rate: 47, unit: "per event" },
      { code: "3PL-044", name: "Urgent / Cancel / Modify Order", rate: 19, unit: "per order" },
      { code: "3PL-017", name: "Deferred Transfer Fee", rate: 6.25, unit: "per event" },
      { code: "3PL-011", name: "Pallet Storage Type S1", rate: 8, unit: "per pallet/week" },
      { code: "3PL-012", name: "Pallet Hire", rate: 2, unit: "per pallet" },
      { code: "3PL-027", name: "Industrial Waste Disposal", rate: 110, unit: "per event" },
      { code: "3PL-046", name: "Disposal Fee", rate: 2, unit: "per item" },
      { code: "3PL-052", name: "Late Pick-up", rate: 5.25, unit: "per event" },
      { code: "3PL-023", name: "Unload Local Delivery — Pallets", rate: 5.25, unit: "per pallet" },
    ],
  },
};

const formatCurrency = (val) => {
  if (val >= 1000) return `$${val.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${val.toFixed(2)}`;
};

// --- Animated Counter ---
function AnimatedNumber({ value, prefix = "$" }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const end = value;
    const duration = 350;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = end;
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

// --- Warehouse Map ---
function WarehouseMap({ selected, onSelect }) {
  const positions = {
    WA: { x: 108, y: 178 },
    SA: { x: 225, y: 210 },
    QLD: { x: 330, y: 118 },
    NSW: { x: 340, y: 200 },
    VIC: { x: 295, y: 248 },
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 440, margin: "0 auto" }}>
      <svg viewBox="0 0 440 320" style={{ width: "100%", height: "auto" }}>
        {/* Simplified Australia outline */}
        <path
          d="M80,160 Q60,120 100,90 Q130,60 180,55 Q220,50 260,60 Q300,50 340,70 Q370,85 380,110 Q390,130 370,160 Q385,170 380,200 Q370,230 350,250 Q330,270 300,280 Q260,290 220,275 Q180,280 150,260 Q120,240 100,220 Q75,195 80,160 Z"
          fill="#1a1f2e"
          stroke="#2d3548"
          strokeWidth="1.5"
        />
        {/* Tasmania */}
        <path d="M310,290 Q315,285 325,288 Q330,295 325,302 Q315,305 310,298 Z" fill="#1a1f2e" stroke="#2d3548" strokeWidth="1" />
        
        {/* Grid pattern overlay */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff06" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="440" height="320" fill="url(#grid)" />

        {/* Connection lines between warehouses */}
        {selected && Object.entries(positions).map(([state, pos]) => {
          if (state === selected) return null;
          const sel = positions[selected];
          return (
            <line key={state} x1={sel.x} y1={sel.y} x2={pos.x} y2={pos.y}
              stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="4,4" opacity="0.3"
            />
          );
        })}

        {/* Warehouse dots */}
        {Object.entries(positions).map(([state, pos]) => {
          const isSelected = selected === state;
          const wh = WAREHOUSES.find(w => w.state === state);
          return (
            <g key={state} onClick={() => onSelect(state)} style={{ cursor: "pointer" }}>
              {isSelected && (
                <>
                  <circle cx={pos.x} cy={pos.y} r="18" fill="#f59e0b" opacity="0.12">
                    <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={pos.x} cy={pos.y} r="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
                </>
              )}
              <circle cx={pos.x} cy={pos.y} r="5" fill={isSelected ? "#f59e0b" : "#64748b"} stroke={isSelected ? "#fbbf24" : "#94a3b8"} strokeWidth="1.5" />
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fill={isSelected ? "#fbbf24" : "#94a3b8"} fontSize="11" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                {state}
              </text>
              {isSelected && (
                <text x={pos.x} y={pos.y + 24} textAnchor="middle" fill="#cbd5e1" fontSize="8" fontFamily="'DM Sans', sans-serif">
                  {wh.city}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Service Card ---
function ServiceCard({ item, qty, onQtyChange }) {
  const isActive = qty > 0;
  return (
    <div style={{
      background: isActive ? "linear-gradient(135deg, #1e2a3a, #1a2332)" : "#111827",
      border: `1px solid ${isActive ? "#f59e0b44" : "#1e293b"}`,
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      transition: "all 0.25s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {isActive && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
          background: "linear-gradient(180deg, #f59e0b, #d97706)",
          borderRadius: "0 2px 2px 0",
        }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: "#64748b", background: "#0f172a", padding: "2px 6px",
            borderRadius: 4, letterSpacing: "0.05em",
          }}>{item.code}</span>
        </div>
        <div style={{
          fontSize: 13.5, fontWeight: 500, color: isActive ? "#f1f5f9" : "#cbd5e1",
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3, marginBottom: 3,
        }}>{item.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{
            fontSize: 15, fontWeight: 700, color: "#f59e0b",
            fontFamily: "'JetBrains Mono', monospace",
          }}>{formatCurrency(item.rate)}</span>
          <span style={{
            fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif",
          }}>{item.unit}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
        <button onClick={() => onQtyChange(Math.max(0, qty - 1))} style={{
          width: 32, height: 32, borderRadius: "8px 0 0 8px", border: "1px solid #1e293b",
          background: "#0f172a", color: "#94a3b8", fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>−</button>
        <input type="number" value={qty || ""} placeholder="0"
          onChange={e => onQtyChange(Math.max(0, parseInt(e.target.value) || 0))}
          style={{
            width: 52, height: 32, border: "1px solid #1e293b", borderLeft: "none", borderRight: "none",
            background: "#0f172a", color: isActive ? "#f1f5f9" : "#64748b",
            textAlign: "center", fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
            outline: "none", MozAppearance: "textfield", WebkitAppearance: "none",
          }}
        />
        <button onClick={() => onQtyChange(qty + 1)} style={{
          width: 32, height: 32, borderRadius: "0 8px 8px 0", border: "1px solid #1e293b",
          background: "#0f172a", color: "#94a3b8", fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}>+</button>
      </div>
      {isActive && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
          color: "#fbbf24", minWidth: 72, textAlign: "right",
        }}>{formatCurrency(item.rate * qty)}</div>
      )}
    </div>
  );
}

// --- Quote Summary Sidebar ---
function QuoteSummary({ quantities, warehouse, companyName, onClear }) {
  const items = [];
  Object.values(SERVICES).forEach(cat => {
    cat.items.forEach(item => {
      const qty = quantities[item.code] || 0;
      if (qty > 0) items.push({ ...item, qty });
    });
  });
  const subtotal = items.reduce((sum, i) => sum + i.rate * i.qty, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;
  const wh = WAREHOUSES.find(w => w.state === warehouse);

  return (
    <div style={{
      background: "#0a0f1a",
      border: "1px solid #1e293b",
      borderRadius: 14,
      padding: 0,
      overflow: "hidden",
      position: "sticky",
      top: 20,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1507, #1a1200)",
        borderBottom: "1px solid #f59e0b22",
        padding: "20px 22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.15em",
            color: "#f59e0b", textTransform: "uppercase",
          }}>Quote Estimate</span>
          {items.length > 0 && (
            <button onClick={onClear} style={{
              background: "none", border: "none", color: "#64748b", fontSize: 11,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>Clear all</button>
          )}
        </div>
        <div style={{
          fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
          color: "#fbbf24", lineHeight: 1.1, marginTop: 8,
        }}>
          <AnimatedNumber value={total} />
        </div>
        <div style={{ fontSize: 11, color: "#92702a", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
          inc. GST • AUD
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "16px 22px" }}>
        {companyName && (
          <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Prepared for</div>
            <div style={{ fontSize: 14, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{companyName}</div>
          </div>
        )}

        {wh && (
          <div style={{ marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #1e293b" }}>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Warehouse</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif" }}>{wh.city}, {wh.state}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{wh.address}</div>
          </div>
        )}

        {items.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "30px 10px", color: "#475569",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          }}>
            <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.5 }}>📦</div>
            Add services to build your quote
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              {items.length} Service{items.length > 1 ? "s" : ""} Selected
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
              {items.map(item => (
                <div key={item.code} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: "6px 0",
                }}>
                  <div style={{ color: "#94a3b8", flex: 1, lineHeight: 1.35 }}>
                    {item.name}
                    <span style={{ color: "#475569", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, marginLeft: 4 }}>×{item.qty}</span>
                  </div>
                  <div style={{ color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, marginLeft: 12, whiteSpace: "nowrap" }}>
                    {formatCurrency(item.rate * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #1e293b", marginTop: 14, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                <span>Subtotal (ex GST)</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                <span>GST (10%)</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(gst)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#fbbf24", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", paddingTop: 8, borderTop: "1px solid #1e293b" }}>
                <span>Total (inc GST)</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      {items.length > 0 && (
        <div style={{ padding: "0 22px 20px" }}>
          <button
            onClick={() => {
              const lines = items.map(i => `${i.name} (×${i.qty}): ${formatCurrency(i.rate * i.qty)}`).join("\n");
              const quote = `LEADER 3PL Quote Estimate\n${companyName ? `Prepared for: ${companyName}\n` : ""}Warehouse: ${wh ? `${wh.city}, ${wh.state}` : "Not selected"}\n\n${lines}\n\nSubtotal (ex GST): ${formatCurrency(subtotal)}\nGST (10%): ${formatCurrency(gst)}\nTotal (inc GST): ${formatCurrency(total)}\n\nThis is an estimate only. Contact your Leader account manager for a formal quote.`;
              navigator.clipboard.writeText(quote).catch(() => {});
              alert("Quote copied to clipboard!");
            }}
            style={{
              width: "100%", padding: "12px 20px", borderRadius: 10,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none", color: "#0a0f1a", fontSize: 13.5, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              letterSpacing: "0.02em", transition: "all 0.2s",
            }}
          >
            Copy Quote to Clipboard
          </button>
          <div style={{ textAlign: "center", fontSize: 10, color: "#475569", marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>
            Estimate only — contact your Leader account manager for a formal quote
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main App ---
export default function Leader3PLQuoteBuilder() {
  const [activeCategory, setActiveCategory] = useState("popular");
  const [quantities, setQuantities] = useState({});
  const [warehouse, setWarehouse] = useState("SA");
  const [companyName, setCompanyName] = useState("");
  const [showMobileQuote, setShowMobileQuote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const setQty = (code, qty) => {
    setQuantities(prev => {
      const next = { ...prev };
      if (qty <= 0) delete next[code];
      else next[code] = qty;
      return next;
    });
  };

  const clearAll = () => setQuantities({});

  const totalItems = Object.values(quantities).reduce((a, b) => a + (b > 0 ? 1 : 0), 0);
  const grandTotal = Object.entries(quantities).reduce((sum, [code, qty]) => {
    let rate = 0;
    Object.values(SERVICES).forEach(cat => {
      const found = cat.items.find(i => i.code === code);
      if (found) rate = found.rate;
    });
    return sum + rate * qty;
  }, 0);

  const currentCategory = SERVICES[activeCategory];
  const filteredItems = searchQuery
    ? Object.values(SERVICES).flatMap(cat => cat.items).filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentCategory.items;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b14",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        button:hover { opacity: 0.85; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ===== HEADER ===== */}
      <header style={{
        borderBottom: "1px solid #1e293b",
        background: "linear-gradient(180deg, #0c1220 0%, #070b14 100%)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1320, margin: "0 auto", padding: "14px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#0a0f1a", fontFamily: "'JetBrains Mono', monospace",
            }}>L</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.1 }}>
                LEADER <span style={{ color: "#64748b", fontWeight: 400 }}>3PL</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>
                NATIONWIDE LOGISTICS
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              background: "#111827", borderRadius: 8, border: "1px solid #1e293b",
            }}>
              <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>WAREHOUSES</span>
              <span style={{
                background: "#f59e0b", color: "#0a0f1a", fontSize: 11, fontWeight: 700,
                padding: "1px 7px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace",
              }}>5</span>
              <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>STATES</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section style={{
        background: "linear-gradient(180deg, #0c1220 0%, #070b14 100%)",
        padding: "48px 28px 36px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f59e0b12", border: "1px solid #f59e0b33",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
              ONLY DISTRIBUTOR WITH 5-STATE COVERAGE
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            lineHeight: 1.15, marginBottom: 14, letterSpacing: "-0.02em",
          }}>
            Warehousing & Fulfilment<br />
            <span style={{ color: "#f59e0b" }}>Across Australia</span>
          </h1>
          <p style={{
            fontSize: 15, color: "#94a3b8", lineHeight: 1.6, maxWidth: 520, margin: "0 auto",
          }}>
            End-to-end 3PL services from receiving to dispatch. Build a custom quote below to estimate costs for your logistics needs.
          </p>
        </div>

        {/* Warehouse Map */}
        <div style={{ maxWidth: 440, margin: "28px auto 0" }}>
          <WarehouseMap selected={warehouse} onSelect={setWarehouse} />
          <div style={{
            display: "flex", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap",
          }}>
            {WAREHOUSES.map(wh => (
              <button key={wh.state} onClick={() => setWarehouse(wh.state)}
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  background: warehouse === wh.state ? "#f59e0b" : "#111827",
                  color: warehouse === wh.state ? "#0a0f1a" : "#94a3b8",
                  border: `1px solid ${warehouse === wh.state ? "#f59e0b" : "#1e293b"}`,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {wh.state} — {wh.city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{
        maxWidth: 1320, margin: "0 auto", padding: "32px 28px 60px",
        display: "grid", gridTemplateColumns: "1fr 340px", gap: 32,
        alignItems: "start",
      }}>
        {/* Left - Services */}
        <div>
          {/* Company name + Search */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <input
              type="text" placeholder="Company name (optional)"
              value={companyName} onChange={e => setCompanyName(e.target.value)}
              style={{
                flex: "1 1 200px", padding: "10px 14px", borderRadius: 10,
                background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0",
                fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
            <div style={{ flex: "1 1 200px", position: "relative" }}>
              <input
                type="text" placeholder="Search services..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px 10px 36px", borderRadius: 10,
                  background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0",
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
              />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 14 }}>🔍</span>
            </div>
          </div>

          {/* Category tabs */}
          {!searchQuery && (
            <div style={{
              display: "flex", gap: 6, marginBottom: 20, overflowX: "auto",
              paddingBottom: 4,
            }}>
              {Object.entries(SERVICES).map(([key, cat]) => {
                const catCount = cat.items.reduce((c, item) => c + (quantities[item.code] > 0 ? 1 : 0), 0);
                return (
                  <button key={key} onClick={() => setActiveCategory(key)}
                    style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
                      background: activeCategory === key ? "#1e293b" : "transparent",
                      color: activeCategory === key ? "#f1f5f9" : "#64748b",
                      border: `1px solid ${activeCategory === key ? "#334155" : "transparent"}`,
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <span>{cat.icon}</span> {cat.label}
                    {catCount > 0 && (
                      <span style={{
                        background: "#f59e0b", color: "#0a0f1a", fontSize: 10, fontWeight: 700,
                        padding: "1px 6px", borderRadius: 10, fontFamily: "'JetBrains Mono', monospace",
                      }}>{catCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Search results label */}
          {searchQuery && (
            <div style={{
              fontSize: 12, color: "#64748b", marginBottom: 12,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}

          {/* Service cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredItems.map((item, idx) => (
              <div key={item.code} style={{ animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}>
                <ServiceCard
                  item={item}
                  qty={quantities[item.code] || 0}
                  onQtyChange={qty => setQty(item.code, qty)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right - Quote Summary (desktop) */}
        <div style={{ position: "relative" }}>
          <QuoteSummary
            quantities={quantities}
            warehouse={warehouse}
            companyName={companyName}
            onClear={clearAll}
          />
        </div>
      </div>

      {/* ===== MOBILE FLOATING BAR ===== */}
      {totalItems > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(180deg, transparent, #070b14 20%)",
          padding: "20px 20px 16px", zIndex: 200,
          display: "none", // Hidden on desktop; would need media query for mobile
        }}>
          <button
            onClick={() => setShowMobileQuote(!showMobileQuote)}
            style={{
              width: "100%", padding: "14px 20px", borderRadius: 12,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              border: "none", color: "#0a0f1a", fontSize: 14, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <span>View Quote ({totalItems} items)</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(grandTotal * 1.1)}</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1e293b", padding: "24px 28px",
        textAlign: "center", color: "#475569", fontSize: 11,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          © 2026 Leader Computers Pty Ltd. All prices are in AUD, exclusive of GST unless stated. This tool provides estimates only — contact your Leader account manager for formal quotations. Prices effective January 2026.
        </div>
      </footer>
    </div>
  );
}
