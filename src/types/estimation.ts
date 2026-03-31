/**
 * Estimation domain types
 */

export interface EstimationItem {
  id: string | number;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  standardLabel: string;
  standardVariant: 'primary' | 'green';
  subtotal: number;
  isSelected: boolean;
}

export interface EstimationDetail {
  claimId: string;
  totalAmount: number;
  vendorEstimate?: number;
  savingsPercent?: number;
  savingsAmount?: number;
  calculationTime?: string;
  depreciation?: number;
  deductible?: number;
  indirectRate?: number;
  items: EstimationItem[];
}

// Local UI shape (checked vs isSelected)
export interface EstimationRow {
  id: number;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  standardLabel: string;
  standardVariant: 'primary' | 'green';
  subtotal: number;
  checked: boolean;
}
