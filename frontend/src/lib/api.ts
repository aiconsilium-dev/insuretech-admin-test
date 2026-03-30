/**
 * API 클라이언트 — fetch 기반
 * 응답 형식: { success: boolean, message: string, data: T }
 * 자동으로 data.data 추출
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// ── Token management (JWT endpoints) ──
let _accessToken: string | null = null;

export function setAccessToken(token: string): void {
  _accessToken = token;
}

function getAuthHeaders(): Record<string, string> {
  if (_accessToken) {
    return { Authorization: `Bearer ${_accessToken}` };
  }
  return {};
}

// ── API functions ──

export interface KpiData {
  totalClaims: number;
  typeA: number;
  typeB: number;
  typeC: number;
  pendingApproval: number;
  lossRateAb: number;
  lossRateC: number;
}

export interface ClaimListItem {
  id: string;
  complexName: string;
  description: string;
  claimedAt: string;
  type: 'A' | 'B' | 'C';
  status: string;
  aiConfidence: number;
  amount?: number;
}

export interface ClaimsListResponse {
  items: ClaimListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ClaimDetail {
  id: string;
  complexName: string;
  description: string;
  claimedAt: string;
  type: 'A' | 'B' | 'C';
  status: string;
  aiConfidence: number;
  amount?: number;
  typeADetail?: unknown;
  typeBDetail?: unknown;
  estimation?: unknown;
  items?: unknown[];
}

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

/** GET /dashboard/kpi */
export async function fetchKpi(): Promise<KpiData> {
  return apiFetch<KpiData>('/dashboard/kpi');
}

/** GET /claims */
export async function fetchClaims(params?: {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ClaimsListResponse> {
  const qs = new URLSearchParams();
  if (params?.type) qs.set('type', params.type);
  if (params?.status) qs.set('status', params.status);
  if (params?.search) qs.set('search', params.search);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiFetch<ClaimsListResponse>(`/claims${query ? `?${query}` : ''}`);
}

/** GET /claims/:id */
export async function fetchClaimById(id: string): Promise<ClaimDetail> {
  return apiFetch<ClaimDetail>(`/claims/${id}`);
}

/** GET /claims/:id/estimation */
export async function fetchEstimation(claimId: string): Promise<EstimationDetail> {
  return apiFetch<EstimationDetail>(`/claims/${claimId}/estimation`);
}

/** PATCH /claims/:id/estimation/items/:itemId */
export async function patchEstimationItem(
  claimId: string,
  itemId: string | number,
  isSelected: boolean,
): Promise<unknown> {
  return apiFetch<unknown>(`/claims/${claimId}/estimation/items/${itemId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isSelected }),
  });
}

/** POST /claims/:id/approvals */
export async function postApproval(
  claimId: string,
  payload: { decision: string; approvedAmount?: number; comment?: string },
): Promise<unknown> {
  return apiFetch<unknown>(`/claims/${claimId}/approvals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

/** GET /documents */
export async function fetchDocuments(params?: {
  claimId?: string;
  docType?: string;
  page?: number;
  limit?: number;
}): Promise<DocumentsListResponse> {
  const qs = new URLSearchParams();
  if (params?.claimId) qs.set('claimId', params.claimId);
  if (params?.docType) qs.set('docType', params.docType);
  if (params?.page !== undefined) qs.set('page', String(params.page));
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiFetch<DocumentsListResponse>(`/documents${query ? `?${query}` : ''}`);
}
