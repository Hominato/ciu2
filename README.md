# LincOne Federal Credit Union Banking System

A fully functional, luxury-styled, frontend-only Online Banking Application built exclusively with **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. 

> ⚠️ **DEMONSTRATION NOTICE**: This application is a digital banking platform created for presentation and demonstration purposes.

---

## 🌟 Highlights & Features

- **Premium Luxury Fintech Aesthetic**: Dark & light mode engines, glassmorphism backdrop filters, soft gradients, gold/emerald accents, 60 FPS CSS animations, crisp typography.
- **LocalStorage Data Persistence**: Persistent state management for account balances, transaction history, customer profiles, card configurations, notification feeds, and theme preferences.
- **Three-Stage Money Transfer System**:
  - **Stage 1 (Beneficiary Verification)**: Live simulated terminal network verification sequence (`Connecting to LincOne FCU network...`, `Verifying account...`).
  - **Stage 2 (Details & Amount)**: Real-time remaining balance calculations (`$806,395.79 - Amount`), purpose selection, auto-generated transaction reference numbers.
  - **Stage 3 (Review & Confirm)**: Complete summary card with masked account credentials, multi-step progress encryption bar, and success handler.
- **Digital Receipt Generator & Printable Statements**:
  - Download single-file standalone HTML receipts.
  - Printable modal receipts using `window.print()`.
  - Monthly certified account statement generator with opening balance, total credits, total debits, and closing balance computations.
- **Transaction History & CSV Exporter**: Live multi-field search, status/category filters, column sorting, and one-click standard financial CSV export.
- **Investment Portfolio Hub**: High-performance pure 2D Vanilla JS Canvas charts (portfolio growth curve and asset allocation donut chart).
- **Interactive Virtual Debit Card**: 3D flippable metallic debit card with freeze/unfreeze controls, CVV reveal, and limit sliders.

---

## 📂 File Architecture

```
banking-system/
├── index.html                   # LincOne FCU Login & Auth Portal
├── dashboard.html               # Main Banking Application Hub (SPA-style routing)
├── css/
│   ├── style.css                # Design Tokens, CSS Variables, Typography, Buttons, Inputs
│   ├── dashboard.css            # Layouts, Sidebar, Cards, Widgets, 3D Debit Card, Modals
│   ├── transfer.css             # 3-Stage Transfer Wizard, Stepper, Terminal Simulator
│   ├── responsive.css           # Mobile, Tablet, and Desktop Breakpoints
│   └── animations.css           # Keyframes, Glass Shimmer, Card Flip, Skeleton Loaders
├── js/
│   ├── storage.js               # LocalStorage Manager & Initial State Seeder
│   ├── helpers.js               # Formatting, CSV Exporter, File Download Utilities
│   ├── ui.js                    # Toast Notifications, Modal Controller, Clock, Theme Engine
│   ├── app.js                   # Authentication Handler & Session Persistence
│   ├── dashboard.js             # View Router & 2D Canvas Charting Engine
│   ├── transfer.js              # 3-Stage Transfer Wizard Workflow Logic
│   ├── transactions.js          # Transaction Ledger Filters, Search & CSV Exporter
│   └── receipt.js               # Digital Receipts & Monthly Statement Builder
├── assets/
│   ├── logo.png                 # LincOne Federal Credit Union Logo
│   ├── favicon.png              # LincOne Favicon Icon
│   └── avatar.svg               # High-res User Avatar
└── README.md                    # System Documentation
```

---

## ⚙️ Sample Default Data

| Parameter | Value |
| :--- | :--- |
| **Member Name** | Monique Franco |
| **Member ID** | `L1FCU-806395` |
| **Account Type** | Premier Checking |
| **Available Checking Balance** | `$806,395.79` |
| **High-Yield Savings Balance** | `$150,000.00` |
| **Investment Portfolio** | `$250,000.00` (*LincOne Share Certificates*) |
| **Recurring Funding Source** | `UNHCR` ($8,000+ monthly disbursements March – August) |
| **Preloaded Beneficiary** | Monique Franco (*LincOne FCU*, Account `********5625`, Routing `********3632`) |

---

## 🚀 How to Run Locally

Because the application is built entirely with native web technologies, no build tools or package installations are required.

### Option 1: Open Directly in Browser
Simply open `index.html` in any web browser (Chrome, Safari, Firefox, Edge).

### Option 2: Run with Local HTTP Server
Using Python:
```bash
python3 -m http.server 8000
```
Or using Node.js `npx`:
```bash
npx http-server -p 8000
```
Then navigate to `http://localhost:8000` in your browser.
