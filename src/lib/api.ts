/**
 * Re-export from new API layer for backward compatibility.
 * @deprecated Import directly from @/api/* instead.
 */

// Types
export type { KpiData } from '@/types/dashboard';
export type {
  ClaimListItem,
  ClaimsListResponse,
  ClaimDetail,
  ApprovalPayload,
} from '@/types/claims';
export type { EstimationItem, EstimationDetail } from '@/types/estimation';
export type { DocumentItem, DocumentsListResponse } from '@/types/documents';

// Functions
export { fetchKpi } from '@/api/dashboard/dashboardApi';
export {
  fetchClaims,
  fetchClaimById,
  fetchEstimation,
  patchEstimationItem,
  postApproval,
} from '@/api/claims/claimsApi';
export { fetchDocuments } from '@/api/documents/documentsApi';

// Auth token helper (kept for compatibility — now Zustand-managed)
import { useAuthStore } from '@/stores/authStore';

/** @deprecated Use useAuthStore from @/stores/authStore */
export function setAccessToken(token: string): void {
  useAuthStore.getState().setAccessToken(token);
}
