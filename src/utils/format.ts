/**
 * Format angka ke format mata uang Rupiah (IDR)
 * Contoh: 25000 -> "Rp 25.000"
 */
export function formatRupiah(amount: number, hideAmount: boolean = false): string {
  if (hideAmount) {
    return 'Rp ••••••';
  }

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `Rp ${formattedNumber}`;
}

/**
 * Format tanggal input string YYYY-MM-DD ke label ramah pengguna
 * Contoh: "Hari Ini", "Kemarin", atau formatted string lokal
 */
export function formatDateLabel(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(targetDate, today)) {
    return 'Hari Ini';
  }

  if (isSameDay(targetDate, yesterday)) {
    return 'Kemarin';
  }

  return targetDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Mendapatkan string tanggal hari ini dalam format lokal YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Mendapatkan string bulan dan tahun saat ini (YYYY-MM) sesuai waktu lokal
 */
export function getCurrentMonthPrefix(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format tanggal hari ini dalam huruf kapital untuk struk (misal: "19 NOV 2026")
 */
export function getTodayFormattedUpper(): string {
  const now = new Date();
  return now
    .toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase();
}

/**
 * Mendapatkan daftar 6 opsi bulan terakhir untuk dropdown pemilih bulan
 */
export function getRecentMonthOptions(): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const value = `${year}-${month}`;
    const label = d.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    });
    options.push({ value, label });
  }
  return options;
}

/**
 * Format string YYYY-MM ke nama bulan dan tahun (misal: "2026-11" -> "November 2026")
 */
export function formatMonthValueToLabel(monthValue: string): string {
  if (!monthValue || !monthValue.includes('-')) {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }
  const [year, month] = monthValue.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format bulan dan tahun sesuai waktu perangkat atau dateString yang diberikan
 */
export function formatCurrentMonthYear(dateString?: string): string {
  if (dateString) {
    return formatMonthValueToLabel(dateString.slice(0, 7));
  }
  return new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}
