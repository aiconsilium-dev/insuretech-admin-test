import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimsKeys } from '@/config/queryKeys';
import {
  fetchClaims,
  fetchClaimById,
  fetchEstimation,
  patchEstimationItem,
  postApproval,
} from './claimsApi';
import type { ClaimsQueryParams, ApprovalPayload } from '@/types/claims';

export function useClaimsQuery(params?: ClaimsQueryParams) {
  return useQuery({
    queryKey: claimsKeys.list((params ?? {}) as object),
    queryFn: () => fetchClaims(params),
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useClaimDetailQuery(id: string) {
  return useQuery({
    queryKey: claimsKeys.detail(id),
    queryFn: () => fetchClaimById(id),
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function useEstimationQuery(claimId: string) {
  return useQuery({
    queryKey: claimsKeys.estimation(claimId),
    queryFn: () => fetchEstimation(claimId),
    staleTime: 1000 * 60,
    retry: 1,
  });
}

export function usePatchEstimationItem(claimId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, isSelected }: { itemId: string | number; isSelected: boolean }) =>
      patchEstimationItem(claimId, itemId, isSelected),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.estimation(claimId) });
    },
  });
}

export function usePostApproval(claimId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApprovalPayload) => postApproval(claimId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.all });
    },
  });
}
