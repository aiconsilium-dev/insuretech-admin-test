/**
 * Dashboard domain types
 */

export interface KpiData {
  totalClaims: number;
  typeA: number;
  typeB: number;
  typeC: number;
  pendingApproval: number;
  lossRateAb: number;
  lossRateC: number;
}
