/**
 * TanStack Query key factories
 */

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpi: () => [...dashboardKeys.all, 'kpi'] as const,
};

export const claimsKeys = {
  all: ['claims'] as const,
  lists: () => [...claimsKeys.all, 'list'] as const,
  list: (filters: object) => [...claimsKeys.lists(), filters] as const,
  detail: (id: string) => [...claimsKeys.all, 'detail', id] as const,
  estimation: (id: string) => [...claimsKeys.all, 'estimation', id] as const,
};

export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters: object) => [...documentsKeys.lists(), filters] as const,
};
