import { client, extractData } from '@/api/client';
import type { DocumentsListResponse, DocumentsQueryParams } from '@/types/documents';

/** GET /documents */
export async function fetchDocuments(params?: DocumentsQueryParams): Promise<DocumentsListResponse> {
  const res = await client.get<unknown>('/documents', { params });
  return extractData<DocumentsListResponse>(res.data);
}
