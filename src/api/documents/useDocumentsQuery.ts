import { useQuery } from '@tanstack/react-query';
import { documentsKeys } from '@/config/queryKeys';
import { fetchDocuments } from './documentsApi';
import type { DocumentsQueryParams } from '@/types/documents';

export function useDocumentsQuery(params?: DocumentsQueryParams) {
  return useQuery({
    queryKey: documentsKeys.list((params ?? {}) as object),
    queryFn: () => fetchDocuments(params),
    staleTime: 1000 * 30,
    retry: 1,
  });
}
