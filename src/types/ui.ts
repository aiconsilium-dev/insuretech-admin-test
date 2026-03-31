/**
 * UI component types (previously in lib/types.ts)
 */

export interface KPIData {
  label: string;
  value: number;
  description: string;
  chipLabel?: string;
  variant: 'total' | 'type-a' | 'type-b' | 'type-c';
  route?: string;
  valueStyle?: string;
}

export interface BarItem {
  label: string;
  value: number;
  color: 'amber' | 'red' | 'green';
}

export interface TimelineItemData {
  title: string;
  time: string;
  status: 'done' | 'now' | 'wait';
  stepNumber?: number;
}

export interface StageData {
  label: string;
  status: 'done' | 'now' | 'pending';
  stepNumber?: number;
}

export interface CaseItemData {
  caseNumber: string;
  description: string;
  numberColor?: 'primary' | 'red';
}

export interface KVRowData {
  label: string;
  value: string;
  valueColor?: 'green' | 'red' | 'amber' | 'primary';
  valueFontSize?: string;
}

export interface PreviewData {
  badge: string;
  badgeVariant: 'ba' | 'bb' | 'bc';
  title: string;
  claimId: string;
  date: string;
  kvRows: KVRowData[];
  actions: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'green';
    route?: string;
  }>;
  alertMessage?: string;
}
