# Leader 3PL Quote Builder

An interactive web-based quote estimation tool for **Leader Computers' 3PL (Third-Party Logistics)** services across Australia.

🔗 **Live Demo:** [https://leadermarketing.github.io/Leader3PL/](https://leadermarketing.github.io/Leader3PL/)

---

## What It Does

The Leader 3PL Quote Builder allows resellers, partners, and account managers to:

- **Build custom logistics quotes** by selecting from 57+ warehousing and fulfilment services across 6 categories
- **Select a warehouse** from 5 nationwide branch locations (SA, QLD, NSW, WA, VIC) with an interactive map
- **Adjust quantities** for each service and see real-time pricing calculations (ex-GST and inc-GST)
- **Export quotes as PDF** with the Leader 3PL branding, or copy to clipboard
- **Send quotes via email** to either a partner account manager or as a new enquiry
- **View POA (Price on Application)** items for services that require custom pricing

## Key Features

- **Interactive Map** — Full-width Leaflet/OpenStreetMap with 5 warehouse locations, rich popup cards with branch details and contact info
- **Real-time Quote Sidebar** — Collapsible service list with inline quantity controls (+/−), trash-to-remove, and live subtotal/GST/total calculation
- **PDF Export** — Professionally branded PDF quote generation with logo, service table, and pricing summary
- **Email Integration** — Pre-filled mailto links for partner enquiries (routed to the appropriate account manager) and general enquiries
- **Responsive Design** — Mobile-friendly with a floating quote bar and slide-up panel for smaller screens
- **Search** — Quickly find any service by name or code across all categories

## How to Use

1. **Choose a warehouse** — Click a state button (e.g. "NSW — Lidcombe") or click a marker on the map
2. **Browse services** — Use the category tabs or search bar to find services
3. **Add to quote** — Use the +/− buttons on any service card to add quantities
4. **Review your quote** — The sidebar shows all selected services with totals; adjust quantities or remove items directly
5. **Export or send** — Click "Send Quote" to email, "PDF" to download, or "Copy" to clipboard

## Tech Stack

- **React 18** + **Vite 6**
- **react-leaflet** + **Leaflet** (OpenStreetMap)
- **react-icons** (Feather Icons)
- **jsPDF** + **jspdf-autotable** (PDF generation)
- **Inter** font (Google Fonts)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is deployed to **GitHub Pages** from the `gh-pages` branch. To redeploy:

```bash
npm run build
npx gh-pages -d dist
```

---

## Author

**This tool has been built by:**

**John Cardenas**
📧 [john.cardenas@leadersystems.com.au](mailto:john.cardenas@leadersystems.com.au)

Got feedback or suggestions? Feel free to reach out!

---

© 2026 Leader Computers Pty Ltd. All rights reserved.
