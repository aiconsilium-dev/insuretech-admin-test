import { client, extractData } from '@/api/client';
import type { KpiData } from '@/types/dashboard';

/** GET /dashboard/kpi */
export async function fetchKpi(): Promise<KpiData> {
  const res = await client.get<unknown>('/dashboard/kpi');
  return extractData<KpiData>(res.data);
}
