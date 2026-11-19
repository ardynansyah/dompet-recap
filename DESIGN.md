# 🎨 DESIGN SYSTEM & PANDUAN UI/UX: DOMPET RECAP

Dokumen ini adalah acuan resmi desain antarmuka (UI), pengalaman pengguna (UX), dan gaya bahasa (Tone of Voice) untuk aplikasi **Dompet Recap**.

Aplikasi ini mengusung vibe visual **"Playful, Gemoy, dan Estetik khas Gen-Z"**, namun tetap **"Clean, Tajam, dan Bebas AI-Slop"**. Kelucuan dan daya tarik visual diciptakan melalui permainan warna *pastel-pop*, bentuk bento card yang membulat gemoy, tipografi ekspresif, grafik data yang estetik, dan *copywriting* bahasa gaul Indonesia santai—**bukan dari tempelan ikon atau emoji yang bertebaran di mana-mana**.

---

## 1. Visual Direction & Minimal-Icon Rule

### 1.1 Konsep Utama: "Playful Bento & Soft Neo-Brutalism"
- **Warm & Tactile Canvas:** Menggunakan warna latar hangat *warm cream / oat milk* (`#F8F5EE`), bukan putih flat rumah sakit yang silau di mata.
- **Chunky & Membulat Gemoy:** 
  - Sudut melengkung ramah: `rounded-3xl` (24px) untuk kartu bento utama & modal, `rounded-2xl` (16px) untuk item transaksi, dan `rounded-full` (9999px) untuk chips filter.
  - Border charcoal tegas manis (`border-2 border-[#1E232A]`).
  - *Hard drop shadow* fisik (`shadow-[3px_3px_0px_#1E232A]`).
- **Bouncy Physical Feedback:** Interaksi tombol terasa membal layaknya tombol mainan fisik saat ditekan (`active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`).

### 1.2 Aturan Ketat Minimal-Ikon (Anti-AI Slop Policy)
- **Dilarang menempelkan ikon/emoji di setiap judul kartu, label form, atau tombol umum.**
- Ikon dibatasi secara ketat hanya untuk **aksi fungsional esensial**:
  1. Hapus transaksi (`Trash2`)
  2. Edit budget (`Pencil`)
  3. Tutup modal (`X`)
  4. Download gambar (`Download`)
  5. Kalender tanggal input (`Calendar`)
- Kategori pengeluaran diidentifikasi menggunakan **dot warna solid** (`w-2.5 h-2.5 rounded-full`) dan badge teks bersih berkontras tinggi, bukan dijejali deretan icon grafik yang bising.

---

## 2. Color Palette (Solid Pastel-Pop & Warning System)

### 2.1 Background & Neutral Colors
| Elemen | Nama Warna | HEX Code | Tailwind Class / Penggunaan |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | Warm Oat Milk | `#F8F5EE` | `bg-[#F8F5EE]` (Latar utama aplikasi) |
| **Card Surface** | Pure White | `#FFFFFF` | `bg-white` (Permukaan kartu utama) |
| **Inset Surface** | Pale Cream | `#F2EDE2` | `bg-[#F2EDE2]` (Container input & background bar) |
| **Border & Outlines** | Ink Charcoal | `#1E232A` | `border-[#1E232A]` (Border tegas manis) |
| **Text Primary** | Deep Ink | `#1E232A` | `text-[#1E232A]` (Judul & nominal utama) |
| **Text Muted** | Slate Gray | `#64748B` | `text-[#64748B]` (Tanggal, sub-label) |
| **Divider Line** | Soft Biscuit | `#E6E0D4` | `border-[#E6E0D4]` (Garis batas pemisah) |

### 2.2 Category Pastel-Pop Palette (Warna Solid Kategori & Grafik)
Setiap kategori memiliki warna solid yang kuat dipadu dengan warna latar badge yang lembut:

| Kategori | Nuansa Warna | HEX Solid Aksen | HEX Background Badge | HEX Teks Badge |
| :--- | :--- | :--- | :--- | :--- |
| **Makan & Minum** | Coral Punch | `#F95738` | `#FFECE8` | `#C83214` |
| **Kopi & Nongkrong** | Warm Toffee | `#F4A261` | `#FEF3E8` | `#B05B17` |
| **Transport** | Fresh Pine | `#2A9D8F` | `#E8F6F4` | `#1C6B61` |
| **Belanja** | Electric Iris | `#7058D0` | `#F0EDFC` | `#4D36A8` |
| **Hiburan & Tagihan** | Bold Berry | `#E76F51` | `#FDF0ED` | `#BF482A` |
| **Lainnya** | Steel Teal | `#4A7C59` | `#EDF4EF` | `#2C5237` |

### 2.3 Sistem Warna Banner Peringatan Budget (Warning Banner System)
Banner peringatan muncul secara otomatis di dalam kartu budget saat pengeluaran mendekati atau melampaui limit:

| Status Peringatan | Ambang Batas (% Terpakai) | Warna Aksen / Border | Background Banner | Warna Teks |
| :--- | :--- | :--- | :--- | :--- |
| **Waspada (Amber Warning)** | `75% - 89%` | `#F59E0B` | `#FFFBEB` | `#92400E` |
| **Kritis (Rose Critical)** | `90% - 100%` | `#E11D48` | `#FFF1F2` | `#9F1239` |
| **Boncos (Overbudget Dark Red)**| `> 100%` | `#B91C1C` | `#FEF2F2` | `#7F1D1D` |

### 2.4 Status Dompet Dinamis (Clean Text Badges)
| Status Dompet | Kriteria Terpakai | Accent HEX | Badge Background | Teks Label |
| :--- | :--- | :--- | :--- | :--- |
| **Mode Sultan** | `< 40%` | `#2A9D8F` | `#E8F6F4` | Mode Sultan |
| **Masih Aman** | `40% - 74%` | `#3B82F6` | `#EFF6FF` | Masih Aman |
| **Mulai Waspada** | `75% - 90%` | `#F59E0B` | `#FEF3E8` | Mulai Waspada |
| **Mode Bertahan Hidup**| `> 90%` | `#E11D48` | `#FFF1F2` | Mode Bertahan Hidup |

---

## 3. Typography & Formatting Rules

### 3.1 Font Stacks (Google Fonts)
1. **Primary & Headings:** `Plus Jakarta Sans`
   - Huruf geometris tebal dan ramah, sangat tajam untuk judul dan angka nominal besar.
   - Bobot: `font-bold (700)` untuk sub-heading dan `font-black (800)` untuk angka/hero.
2. **Body & Microcopy:** `Plus Jakarta Sans`
   - Bobot: `font-normal (400)`, `font-medium (500)`, dan `font-semibold (600)`.
3. **Monospace (Khusus Tema Struk Kasir):** `Space Mono`
   - Bobot: `font-normal (400)` & `font-bold (700)`.
   - Memberikan kesan cetakan printer thermal struk minimarket yang otentik.

### 3.2 Format Mata Uang Rupiah (IDR)
- Format standar: `Rp 25.000` (menggunakan `Intl.NumberFormat('id-ID')`, tanpa desimal sen `,00`).
- Pengeluaran selalu bertanda minus: `- Rp 35.000`.
- Mode Privasi: `Rp •••••••` (menyembunyikan angka asli saat membuat story recap).

---

## 4. Casual Indonesian Copywriting Guide (Bahasa Gaul Santai)

Aplikasi ini menggunakan gaya bahasa gaul anak muda Indonesia/Jakarta yang santai, akrab, dan sedikit jenaka (*playful roast*), menggantikan istilah perbankan kaku seperti "Anda" atau "Catatan Transaksi".

### 4.1 Kamus Istilah & Tombol
| Konteks | Versi Kaku / Formal | Versi Santai Dompet Recap |
| :--- | :--- | :--- |
| **Judul Aplikasi** | "Pengelola Keuangan Pribadi" | **"Dompet Recap"** *(Sub-label: Jajan Tracker)* |
| **Header Status** | "Kondisi Keuangan" | **"Dompet Aman?"** |
| **Target Budget** | "Batas Anggaran Bulanan" | **"Jatah Jajan Sebulan"** |
| **Pengeluaran** | "Total Pengeluaran" | **"Udah Kepake"** |
| **Sisa Saldo** | "Sisa Saldo Anggaran" | **"Sisa Napas"** |
| **Form Input** | "Tambah Transaksi Baru" | **"Catet Jajan"** |
| **Label Catatan** | "Keterangan / Deskripsi" | **"Buat apaan?"** *(Placeholder: Misal Kopi Kenangan Mantan)* |
| **Tombol Submit** | "Simpan Transaksi" | **"Gas Catet"** |
| **Grafik Pengeluaran** | "Analisis Distribusi Kategori"| **"Larinya Duit Lu"** |
| **Riwayat Transaksi** | "Daftar Riwayat Transaksi" | **"Jejak Pengeluaran"** |
| **Tombol Story** | "Ekspor Ringkasan Instagram" | **"Bikin Recap IG Story"** |
| **Tombol Unduh** | "Unduh Berkas Gambar" | **"Download PNG"** |
| **Sensor Nominal** | "Sembunyikan Nilai Saldo" | **"Sensor Nominal Rp"** |

### 4.2 Teks Banner Peringatan Budget (Warning Banner Copy)
Banner dinamis muncul dengan pesan gaul sesuai kondisi saldo:
- **Kondisi Waspada (75% - 89% terpakai):**
  > *"Rem dikit bro, jatah bulan ini tinggal dikit lagi."*
- **Kondisi Kritis (90% - 100% terpakai):**
  > *"Waduh, saldo udah kritis! Tahan dulu checkout sama ngopinya."*
- **Kondisi Boncos (> 100% terpakai):**
  > *"Fix boncos! Pengeluaran bulan ini udah lewat batas."*

### 4.3 Empty States (Saat Data Kosong)
- **Belum Ada Transaksi Bulan Ini:**
  > *"Belum ada jajan yang dicatet nih. Dompet masih aman sentosa."*
- **Filter Kategori Tidak Ada Transaksi:**
  > *"Kategori ini masih suci bersih dari jajan."*

### 4.4 Copywriting Otentik Struk Kasir (IG Story Theme 1)
```text
=========================================
            DOMPET RECAP MART
       "Catatan Realita Pengeluaran"
=========================================
PERIODE : NOV 2026          KASIR: SELF
STATUS  : MULAI WASPADA
-----------------------------------------
[ITEMIZED SUMMARY]
- Makan & Minum        : Rp 1.200.000 (45%)
- Kopi & Nongkrong     : Rp   450.000 (17%)
- Transport            : Rp   350.000 (13%)
- Belanja              : Rp   450.000 (17%)
-----------------------------------------
TOTAL KELUAR           : Rp 2.450.000
SISA BUDGET            : Rp   550.000
=========================================
[BARCODE OTENTIK]
"Barang yang udah dibeli ga bisa dibalikin.
 Begitu juga saldo rekening lu."
"Terima kasih telah berjuang bulan ini!"
=========================================
```

---

## 5. Spesifikasi Komponen & Grafik

### 5.1 Kartu Budget Utama + Dynamic Warning Banner
- **Container:** `bg-white border-2 border-[#1E232A] rounded-3xl p-5 md:p-6 shadow-[3px_3px_0px_#1E232A]`
- **Header:** Judul *"Dompet Aman?"*, bulan aktif (*"November 2026"*), dan tombol minimalis edit *"Jatah Jajan Sebulan"*.
- **Display 2 Angka Utama:**
  - *"Udah Kepake"*: `text-2xl font-black text-[#1E232A]`
  - *"Sisa Napas"*: `text-2xl font-black text-[#2A9D8F]` (berubah merah `#E11D48` jika minus).
- **Progress Bar Chunky:**
  - Track: `bg-[#F2EDE2] border-2 border-[#1E232A] rounded-full h-4 p-0.5 overflow-hidden`.
  - Indicator: Warna solid dinamis (Emerald `< 60%`, Amber `60%–80%`, Rose `> 80%`).
- **Dynamic Warning Banner:**
  - Tampil di bagian bawah kartu budget jika persentase pengeluaran `>= 75%`.
  - Border tebal `border-2`, teks bold, warna latar sesuai tabel warning (Amber / Rose / Dark Red).

### 5.2 Grafik Pengeluaran: "Larinya Duit Lu"
Menampilkan visualisasi data yang bersih dan mudah dipahami dalam 1 kartu bento terpadu:
1. **Category Breakdown Bar (Horizontal Segmented Bar):**
   - Menampilkan alokasi pengeluaran per kategori secara proporsional menggunakan segmen warna solid pastel-pop.
   - Di bawah bar terdapat daftar chip kategori lengkap dengan persentase dan nominal yang rapi.
2. **Daily Spending Mini-Graph (Grafik Batang Harian):**
   - Grafik batang mini 7 hari terakhir atau hari-hari dengan transaksi pengeluaran.
   - Batang dengan warna solid `bg-[#1E232A]` atau aksen kategori, dengan interaksi hover/tap yang menampilkan tooltip nominal pasti (`Rp 45.000`).

### 5.3 Form Input Cepat: "Catet Jajan"
- **Nominal Display:** Input angka besar dengan prefix `Rp` permanen dan format pemisah ribuan otomatis.
- **Input "Buat apaan?":** Input teks dengan placeholder gaul.
- **Pills Pemilih Kategori:**
  - Berisi dot warna solid (`w-2.5 h-2.5 rounded-full`) + teks nama kategori.
  - Active State: Background pastel kategori + `border-2 border-[#1E232A] shadow-[2px_2px_0px_#1E232A]`.
- **Tombol "Gas Catet":** Solid Coral Punch `bg-[#F95738]` dengan animasi tactile.

### 5.4 Daftar Riwayat: "Jejak Pengeluaran"
- **Pills Filter Kategori:** Filter horizontal dengan penanda jumlah transaksi di tiap chip.
- **Pengelompokan Tanggal:** Dikurasi per tanggal (*"Hari Ini"*, *"Kemarin"*, atau *"19 Nov 2026"*).
- **Baris Item:**
  - Indikator dot warna kategori di sebelah kiri.
  - Judul pengeluaran tebal + tag nama kategori.
  - Nominal merah tegas di sebelah kanan (`- Rp 35.000`).
  - Tombol hapus minimalis (`Trash2`) dengan konfirmasi hapus cepat.

### 5.5 Kartu IG Story Recap (9:16) — Siap Pamer
Modal preview interaktif dengan rasio vertikal 9:16 (`1080 x 1920 px` high resolution):
- **Tema 1: Struk Kasir (Thermal Paper Style):**
  - Kertas gading alami (`#FCFBF7`), gerigi sobekan kertas (*sawtooth tear*) di atas dan bawah, tipografi monospace `Space Mono`, barcode otentik, dan catatan kasir santai.
- **Tema 2: Modern Wrapped (Bold Editorial Color-Block):**
  - Latar solid Dark Slate (`#181B20`), kartu blok warna kontras tinggi, tipografi besar `Plus Jakarta Sans`, highlight top 3 pengeluaran terbesar, dan badge status dompet.
- **Fitur Privasi "Sensor Nominal Rp":**
  - Saklar toggle untuk menyamarkan nominal menjadi `Rp •••••••`, sehingga aman dibagikan di Instagram Story tanpa risih saldo diketahui orang lain.

---

## 6. Aturan Desain Responsif

### 6.1 Layar Ponsel (< 768px)
- **Layout 1 Kolom Vertikal:**
  - Lebar container `max-w-md mx-auto px-4 py-4 space-y-5`.
  - Urutan tampilan dari atas ke bawah:
    1. Header & Indikator Bulan
    2. Kartu Budget Hero + Dynamic Warning Banner
    3. Form "Catet Jajan"
    4. Grafik "Larinya Duit Lu"
    5. Filter & Riwayat "Jejak Pengeluaran"
- **Story Modal:** Menyesuaikan ukuran layar HP secara proporsional dengan tombol "Download PNG" tetap mudah dijangkau di bagian bawah.

### 6.2 Layar Desktop (>= 1024px)
- **Grid Asimetris 2 Kolom:**
  - Container `max-w-5xl mx-auto px-6 py-8 grid grid-cols-12 gap-6`.
  - **Kolom Kiri (5 dari 12 kolom, Sticky):**
    - Kartu Budget Hero + Dynamic Warning Banner
    - Form "Catet Jajan"
    - Tombol utama "Bikin Recap IG Story"
  - **Kolom Kanan (7 dari 12 kolom):**
    - Grafik "Larinya Duit Lu" (Category Breakdown & Daily Spending)
    - Filter Kategori & Riwayat "Jejak Pengeluaran"

---

## 7. Token Interaksi & Animasi Mikro

```css
/* Efek Tekan Fisik (Tactile Soft Neo-Brutalism) */
.btn-tactile {
  transition: transform 0.12s ease-out, box-shadow 0.12s ease-out;
  box-shadow: 3px 3px 0px #1E232A;
}

.btn-tactile:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #1E232A;
}

.btn-tactile:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #1E232A;
}
```

*Dokumen DESIGN.md ini menjadi panduan tunggal implementasi UI/UX aplikasi Dompet Recap.*
