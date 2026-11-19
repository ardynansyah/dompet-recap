# Project Brief: Personal Expense Tracker + Shareable IG Story Recap

## 1. Overview
Build a modern, fast, and responsive personal expense tracker web application in casual, relatable Indonesian slang (bahasa gaul anak muda Jakarta/Indonesia, IDR currency). Beyond daily expense logging and visual spending charts, the app features a fun, aesthetic **"Monthly Wallet Recap" generator** that renders a 9:16 vertical card ready to be downloaded as a high-resolution PNG for Instagram Stories.

## 2. Tech Stack
- **Framework:** React (with Vite) + TypeScript
- **Styling:** Tailwind CSS (Mobile-First Responsive Design)
- **Icons:** `lucide-react` (STRICTLY MINIMAL USAGE: only for essential functional actions like delete, download, close modal, and edit budget — avoid decorative icons/emojis everywhere)
- **Charts / Graph:** Lightweight custom SVG/CSS charts or `recharts` (clean, responsive category breakdown bar/donut chart & daily spending trend)
- **Image Export:** `html-to-image` (for exporting the recap card to PNG)
- **Persistence:** `localStorage` (with clean state management and reset/clear option)

## 3. UI/UX, Tone of Voice & Layout Architecture
- **Tone of Voice (Bahasa Gaul & Santai):** Avoid rigid/formal banking Indonesian ("Anda", "Masukkan nominal", "Riwayat Transaksi"). Use casual, natural everyday Indonesian slang:
  - App vibe: *"Jajan Tracker"*, *"Dompet Aman?"*, *"Catet Jajan"*, *"Sisa Napas Bulan Ini"*, *"Larinya Duit Lu"*, *"Bikin Story IG"*.
  - Empty state: *"Belum ada jajan yang dicatet nih. Dompet masih aman sentosa."*
- **Minimal Icon Policy:** Keep the interface clean and typography-driven. Use color-coded pills, subtle borders, and clean spacing instead of cluttering every label, category, or button with icons or emojis.
- **Currency Format:** Always format numbers in Indonesian Rupiah (`Rp 25.000`, `Rp 1.500.000`) using `Intl.NumberFormat('id-ID')`.
- **Mobile Layout (< 768px):** Single-column layout (`max-w-md mx-auto`), thumb-friendly controls, clean card hierarchy.
- **Desktop Layout (>= 1024px):** Centered dashboard container (`max-w-5xl mx-auto`) split into a **2-column asymmetric grid**:
  - **Left Column (Sticky):** Monthly Budget Overview Card (with Warning Alert) + Quick Expense Input Form.
  - **Right Column:** Spending Analytics Graph + Category Filter Pills + Chronological Transaction History List.

## 4. Core Features (MVP Scope)

### A. Monthly Budget, Dynamic Warning Banner & Wallet Status
- Allow the user to set or edit their **Monthly Budget Limit** (*"Jatah Jajan Sebulan"*, default `Rp 3.000.000`).
- Display:
  1. Total Spent this month (*"Udah Kepake"*)
  2. Remaining Balance (*"Sisa Napas"*)
  3. Visual Progress Bar (changes color smoothly: Emerald < 60%, Amber 60–80%, Rose/Red > 80%).
- **Low-Balance / Near-Limit Warning Banner:**
  - Automatically appears prominently inside the budget card when spending crosses threshold limits:
    - **75% – 89% spent (Warning State - Amber):** *"Rem dikit bro, jatah bulan ini tinggal dikit lagi."*
    - **90% – 100% spent (Critical State - Rose/Red):** *"Waduh, saldo udah kritis! Tahan dulu checkout sama ngopinya."*
    - **> 100% spent (Overbudget State - Dark Red):** *"Fix boncos! Pengeluaran bulan ini udah lewat batas."*
- Dynamic Wallet Status Pill (clean text badge without excessive emojis):
  - `< 40%` spent: **"Mode Sultan"**
  - `40% - 74%` spent: **"Masih Aman"**
  - `75% - 90%` spent: **"Mulai Waspada"**
  - `> 90%` spent: **"Mode Bertahan Hidup"**

### B. Spending Graph / Visual Breakdown
- Include a clean, playful **Spending Graph Card** (*"Larinya Duit Lu"*) that updates in real-time:
  - **Category Breakdown Chart:** Visual horizontal stacked bar or clean donut/bar chart showing spending distribution and percentages across categories.
  - **Daily Spending Mini-Graph:** 7-day or current-month daily bar chart showing which days had the highest spending spikes, with interactive hover/tap tooltips showing exact IDR amounts.

### C. Quick Expense Input Form (*"Catet Jajan"*)
- Fast entry fields:
  - **Nominal:** Numeric input with live IDR formatting preview (`Rp ...`).
  - **Buat apaan? (Title/Note):** Short text input (e.g., *"Kopi kenangan mantan"*, *"Gacoan level 3"*).
  - **Kategori:** Clean color-coded selectable pills (text + color dot only, no heavy icons):
    - `Makan & Minum`
    - `Kopi & Nongkrong`
    - `Transport`
    - `Belanja`
    - `Hiburan & Tagihan`
    - `Lainnya`
  - **Tanggal:** Defaults to today, editable.
- Pressing Enter or clicking *"Gas Catet"* immediately saves to `localStorage` and updates totals, warnings, and graphs.

### D. Transaction History & Management (*"Jejak Pengeluaran"*)
- Filter transactions by **Month** (current month default) and **Category** (`Semua`, or specific category).
- Group transactions by date (*Hari Ini*, *Kemarin*, or formatted date like *19 Nov 2026*).
- Each item shows a subtle category color indicator, title, category pill, formatted amount, and a minimal delete button.

### E. Shareable IG Story Recap Card (*"Bikin Recap Story"*)
- Button: **"Bikin Recap IG Story"** that opens a responsive Modal/Drawer.
- Inside the Modal:
  - **Live Preview of a 9:16 Aspect Ratio Card** (`aspect-[9/16]`, styled cleanly to export at high resolution).
  - **2 Selectable Clean Card Themes (Bebas dari badge status/mode alay):**
    1. **Struk Kasir:** Monospace font, off-white paper texture, dashed dividers, rincian kategori, total pengeluaran, barcode kasir di bawah, dan catatan receipt rapi.
    2. **Clean Chart:** Tampilan super bersih berfokus pada **Donut Chart** (gaya cincin tipis myBCA), header bulan & tahun, dan rincian persentase kategori singkat di bawahnya.
  - **Auto-Calculated Card Content:**
    - Month & Year header
    - Total Transactions count & Total Spending (plus toggle **"Sensor Nominal Rp"** untuk privasi)
    - Persentase alokasi pengeluaran per kategori
  - **Action Button:** **"Download PNG"** using `toPng` from `html-to-image` with `pixelRatio: 3` so text and charts stay ultra-sharp on Instagram Stories.

## 5. Step-by-Step Implementation Instructions
1. **Setup & Types:** Define TypeScript interfaces for `Transaction`, `Category`, and `BudgetSettings`, plus helper functions for IDR formatting and `localStorage` sync.
2. **Core Dashboard, Warning & Form:** Build the responsive 2-column desktop / 1-column mobile layout with the Budget Summary header, dynamic Near-Limit Warning Banner, and Quick Expense Input.
3. **Spending Graph & Transaction List:** Build the real-time Spending Graph component (myBCA thin-ring Donut Chart), date-grouped transaction list, category filters, and delete functionality with 4-5 realistic casual Indonesian sample transactions (plus a *"Hapus Data Contoh"* button).
4. **Story Recap Modal & PNG Export:** Build the 9:16 Recap Card component with clean 2-theme switcher (*Struk Kasir* vs. *Clean Chart*), privacy toggle (*Sensor Nominal Rp*), and `html-to-image` download handler.
5. **Polish:** Ensure smooth micro-interactions, clean minimal-icon aesthetics, and zero horizontal overflow on mobile viewports.