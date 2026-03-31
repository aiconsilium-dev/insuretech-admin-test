/**
 * Documents domain types
 */

import type { ClaimStatus } from './claims';

export interface DocumentItem {
  id: string;
  claimId: string;
  summary: string;
  type: string;
  docType?: string;
  date: string;
  status: string;
  statusLabel: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary';
  actionRoute?: string;
}

export interface DocumentsListResponse {
  items: DocumentItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentsQueryParams {
  claimId?: string;
  docType?: string;
  page?: number;
  limit?: number;
}

// Local UI shape for opinion page
export interface OpinionItem {
  claimId: string;
  summary: string;
  type: string;
  date: string;
  status: ClaimStatus;
  statusLabel: string;
  actionLabel: string;
  actionVariant: 'primary' | 'secondary';
  actionRoute?: string;
}
