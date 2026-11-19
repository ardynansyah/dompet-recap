export type CategoryId =
  | 'makan'
  | 'nongkrong'
  | 'transport'
  | 'belanja'
  | 'hiburan'
  | 'lainnya';

export interface Category {
  id: CategoryId;
  name: string;
  color: string;      // Solid accent color (e.g. #F95738)
  bgColor: string;    // Light tint for badge surface (e.g. #FFECE8)
  textColor: string;  // High-contrast text color (e.g. #C83214)
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  categoryId: CategoryId;
  date: string; // Format 'YYYY-MM-DD'
  createdAt: number;
  isSample?: boolean;
}

export interface BudgetSettings {
  monthlyBudget: number;
}

export type WalletStatusType = 'sultan' | 'aman' | 'waspada' | 'bertahan';

export interface WalletStatusInfo {
  type: WalletStatusType;
  label: string;
  comment: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}
