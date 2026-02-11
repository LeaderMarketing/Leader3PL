import { formatCurrency } from './formatCurrency';

const SECTION_CONFIG = [
  { key: 'upfront', label: 'UP-FRONT COSTS' },
  { key: 'storage', label: 'ONGOING STORAGE COSTS' },
  { key: 'inventory', label: 'INVENTORY COSTS' },
];

export function generateQuoteText(items, subtotal, gst, total, warehouse, companyName) {
  const warehouseStr = warehouse
    ? `${warehouse.city}, ${warehouse.state} - ${warehouse.address}`
    : 'Not selected';

  let text = 'LEADER 3PL -- Quote Estimate\n';
  text += '================================\n\n';

  if (companyName) {
    text += `Company: ${companyName}\n`;
  }
  text += `Warehouse: ${warehouseStr}\n`;
  text += `Date: ${new Date().toLocaleDateString('en-AU')}\n\n`;

  text += 'All prices ex GST / AUD\n\n';

  // Build sections
  const sections = SECTION_CONFIG.map((cfg) => {
    const sectionItems = items.filter((i) => i.costType === cfg.key);
    return {
      ...cfg,
      items: sectionItems,
      subtotal: sectionItems.reduce((sum, i) => sum + i.rate * i.qty, 0),
    };
  }).filter((s) => s.items.length > 0);

  sections.forEach((section) => {
    text += `${section.label}\n`;
    text += '-----------------------------\n';

    section.items.forEach((item) => {
      text += `${item.name} [${item.code}]\n`;
      text += `  ${item.qty} x ${formatCurrency(item.rate)} ${item.unit} = ${formatCurrency(item.rate * item.qty)}\n`;
    });

    text += `\n  ${section.label} Subtotal: ${formatCurrency(section.subtotal)}\n\n`;
  });

  text += '================================\n';
  text += `Subtotal (ex GST):  ${formatCurrency(subtotal)}\n`;
  text += `GST (10%):          ${formatCurrency(gst)}\n`;
  text += `Total (inc GST):    ${formatCurrency(total)}\n\n`;
  text += 'This is an estimate only. Final pricing may vary based on volume and agreement terms.\n';
  text += 'Contact your Leader account manager for a formal quotation.\n';

  return text;
}

export function generateMailtoLink(toEmail, companyName, quoteText) {
  const subject = encodeURIComponent(
    `Leader 3PL Quote Estimate${companyName ? ` - ${companyName}` : ''}`
  );
  const body = encodeURIComponent(quoteText);
  return `mailto:${toEmail}?subject=${subject}&body=${body}`;
}
