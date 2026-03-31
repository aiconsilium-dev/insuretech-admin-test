import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface MonthlyKpiRow {
  year_month: string;
  total_claims: number;
  type_a: number;
  type_b: number;
  type_c: number;
  pending_approval: number;
}

interface MonthlyAmountRow {
  year_month: string;
  amount_ab: string;
  amount_c: string;
}

export interface KpiData {
  totalClaims: number;
  typeA: number;
  typeB: number;
  typeC: number;
  pendingApproval: number;
  lossRateAb: number;
  lossRateC: number;
}

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getMonthlyKpi(): Promise<KpiData> {
    const [kpiRows, amountRows] = await Promise.all([
      this.dataSource.query<MonthlyKpiRow[]>(
        `SELECT * FROM v_monthly_kpi WHERE year_month = to_char(NOW(), 'YYYY-MM')`,
      ),
      this.dataSource.query<MonthlyAmountRow[]>(`
        SELECT
          to_char(claimed_at, 'YYYY-MM') AS year_month,
          SUM(CASE WHEN type IN ('A', 'B') THEN COALESCE(amount, 0) ELSE 0 END) AS amount_ab,
          SUM(CASE WHEN type = 'C' THEN COALESCE(amount, 0) ELSE 0 END) AS amount_c
        FROM claims
        WHERE deleted_at IS NULL
          AND claimed_at >= date_trunc('month', NOW() - INTERVAL '1 month')
          AND claimed_at  < date_trunc('month', NOW() + INTERVAL '1 month')
        GROUP BY 1
        ORDER BY 1
      `),
    ]);

    const row = kpiRows[0];

    // Build a lookup map: year_month → amounts
    const amountMap = new Map<string, MonthlyAmountRow>();
    for (const r of amountRows) {
      amountMap.set(r.year_month, r);
    }

    const currentMonth = new Date();
    const thisYM = toYearMonth(currentMonth);
    const lastYM = toYearMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const thisAb = parseAmount(amountMap.get(thisYM)?.amount_ab);
    const lastAb = parseAmount(amountMap.get(lastYM)?.amount_ab);
    const thisC  = parseAmount(amountMap.get(thisYM)?.amount_c);
    const lastC  = parseAmount(amountMap.get(lastYM)?.amount_c);

    return {
      totalClaims: row?.total_claims ?? 0,
      typeA: row?.type_a ?? 0,
      typeB: row?.type_b ?? 0,
      typeC: row?.type_c ?? 0,
      pendingApproval: row?.pending_approval ?? 0,
      lossRateAb: calcChangeRate(thisAb, lastAb),
      lossRateC: calcChangeRate(thisC, lastC),
    };
  }
}

/** Format a Date to 'YYYY-MM' string. */
function toYearMonth(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

/** Safely parse a possibly-string bigint value from Postgres to a JS number. */
function parseAmount(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/**
 * Calculate the month-over-month percentage change.
 * Returns 0 when there is no previous-month data to compare against.
 */
function calcChangeRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  const rate = ((current - previous) / previous) * 100;
  // Round to one decimal place
  return Math.round(rate * 10) / 10;
}
