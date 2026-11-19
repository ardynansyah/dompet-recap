/**
 * Format angka ke format mata uang Rupiah (IDR)
 * Contoh: 25000 -> "Rp 25.000"
 */
export function formatRupiah(amount: number, hideAmount: boolean = false): string {
  if (hideAmount) {
    return 'Rp •••••••';
  }

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `Rp ${formattedNumber}`;
}

/**
 * Format tanggal input string YYYY-MM-DD ke label ramah pengguna
 * Contoh: "Hari Ini", "Kemarin", atau "18 Nov 2026"
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
 * Mendapatkan string tanggal hari ini dalam format YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Mendapatkan string bulan dan tahun saat ini (YYYY-MM)
 */
export function getCurrentMonthPrefix(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format bulan dan tahun (misal: "November 2026")
 */
export function formatCurrentMonthYear(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}
