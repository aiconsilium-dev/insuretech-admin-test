import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '@/config/queryKeys';
import { fetchKpi } from './dashboardApi';
import type { KpiData } from '@/types/dashboard';

export function useKpiQuery() {
  return useQuery<KpiData>({
    queryKey: dashboardKeys.kpi(),
    queryFn: fetchKpi,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}
