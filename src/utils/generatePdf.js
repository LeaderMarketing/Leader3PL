import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatCurrency';
import { LOGO_BASE64 } from './logoBase64';

export function generatePdf(items, subtotal, gst, total, warehouse, companyName) {
  const doc = new jsPDF();

  // -- Logo (maintain original aspect ratio: 2033x205 ≈ 9.92:1) --
  try {
    const logoH = 8;
    const logoW = logoH * (2033 / 205); // ≈ 79.3
    doc.addImage(LOGO_BASE64, 'PNG', 20, 14, logoW, logoH);
  } catch {
    // fallback text if image fails
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.setFont('helvetica', 'bold');
    doc.text('LEADER 3PL', 20, 24);
  }

  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139);
  doc.text('Quote Estimate', 20, 34);

  // -- Line --
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 39, 190, 39);

  // -- Details --
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let y = 50;

  if (companyName) {
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text('Prepared for:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(companyName, 60, y);
    y += 8;
  }

  if (warehouse) {
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'bold');
    doc.text('Warehouse:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${warehouse.city}, ${warehouse.state}`, 60, y);
    y += 6;
    doc.setTextColor(148, 163, 184);
    doc.text(warehouse.address, 60, y);
    y += 8;
  }

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-AU'), 60, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('All prices are in AUD, exclusive of GST unless stated.', 20, y);
  y += 10;

  // -- Services Table --
  doc.autoTable({
    startY: y,
    head: [['Code', 'Service', 'Rate (ex GST)', 'Qty', 'Total (ex GST)']],
    body: items.map((item) => [
      item.code,
      item.name,
      formatCurrency(item.rate),
      String(item.qty),
      formatCurrency(item.rate * item.qty),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 4,
      font: 'helvetica',
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.25,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 24 },
      2: { halign: 'right', cellWidth: 32 },
      3: { halign: 'center', cellWidth: 16 },
      4: { halign: 'right', cellWidth: 34 },
    },
    margin: { left: 20, right: 20 },
  });

  // -- Totals --
  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  doc.text('Subtotal (ex GST):', 120, finalY);
  doc.text(formatCurrency(subtotal), 188, finalY, { align: 'right' });

  doc.setTextColor(100, 116, 139);
  doc.text('GST (10%):', 120, finalY + 7);
  doc.text(formatCurrency(gst), 188, finalY + 7, { align: 'right' });

  doc.setDrawColor(226, 232, 240);
  doc.line(120, finalY + 11, 188, finalY + 11);

  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('Total (inc GST):', 120, finalY + 19);
  doc.text(formatCurrency(total), 188, finalY + 19, { align: 'right' });

  // -- Footer --
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const footerY = finalY + 34;
  doc.text(
    'This is an estimate only. Final pricing may vary based on volume and agreement terms.',
    20,
    footerY
  );
  doc.text(
    'Contact your Leader account manager for a formal quotation.',
    20,
    footerY + 5
  );
  doc.text(
    'Leader Computers Pty Ltd. All prices in AUD. Prices effective January 2026.',
    20,
    footerY + 10
  );

  // -- Save --
  const filename = companyName
    ? `Leader_3PL_Quote_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    : 'Leader_3PL_Quote.pdf';
  doc.save(filename);
}
