import { client, extractData } from '@/api/client';
import type {
  ClaimsListResponse,
  ClaimDetail,
  ClaimsQueryParams,
  ApprovalPayload,
} from '@/types/claims';
import type { EstimationDetail } from '@/types/estimation';

/** GET /claims */
export async function fetchClaims(params?: ClaimsQueryParams): Promise<ClaimsListResponse> {
  const res = await client.get<unknown>('/claims', { params });
  return extractData<ClaimsListResponse>(res.data);
}

/** GET /claims/:id */
export async function fetchClaimById(id: string): Promise<ClaimDetail> {
  const res = await client.get<unknown>(`/claims/${id}`);
  return extractData<ClaimDetail>(res.data);
}

/** GET /claims/:id/estimation */
export async function fetchEstimation(claimId: string): Promise<EstimationDetail> {
  const res = await client.get<unknown>(`/claims/${claimId}/estimation`);
  return extractData<EstimationDetail>(res.data);
}

/** PATCH /claims/:id/estimation/items/:itemId */
export async function patchEstimationItem(
  claimId: string,
  itemId: string | number,
  isSelected: boolean,
): Promise<unknown> {
  const res = await client.patch<unknown>(
    `/claims/${claimId}/estimation/items/${itemId}`,
    { isSelected },
  );
  return extractData<unknown>(res.data);
}

/** POST /claims/:id/approvals */
export async function postApproval(
  claimId: string,
  payload: ApprovalPayload,
): Promise<unknown> {
  const res = await client.post<unknown>(`/claims/${claimId}/approvals`, payload);
  return extractData<unknown>(res.data);
}
