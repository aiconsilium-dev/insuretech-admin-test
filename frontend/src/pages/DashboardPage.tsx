import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  KPICard,
  Badge,
  StatusPill,
  DataTable,
  DetailCard,
  BarChart,
  Button,
} from '@/components/common';
import type { Column } from '@/components/common';
import type { Claim } from '@/lib/types';
import { kpiData, dashboardRecentClaims, barChartData } from '@/lib/data';
import { fetchKpi, fetchClaims } from '@/lib/api';
import type { KpiData, ClaimListItem } from '@/lib/api';

const typeToRoute: Record<string, string> = {
  A: '/type-a',
  B: '/type-b',
  C: '/type-c',
};

const badgeVariantMap: Record<string, 'ba' | 'bb' | 'bc'> = {
  A: 'ba',
  B: 'bb',
  C: 'bc',
};

const statusVariantMap: Record<string, 'done' | 'sent' | 'wait' | 'transfer'> = {
  done: 'done',
  sent: 'sent',
  wait: 'wait',
  transfer: 'transfer',
  paid: 'done',
};

// Map API ClaimListItem → local Claim shape for DataTable
function mapApiClaim(item: ClaimListItem): Claim {
  return {
    id: item.id,
    complex: item.complexName,
    description: item.description,
    date: item.claimedAt?.slice(0, 10) ?? '',
    type: item.type,
    confidence: item.aiConfidence,
    status: item.status as Claim['status'],
    statusLabel: item.status,
    amount: item.amount,
    actionLabel: '상세',
    actionVariant: 'primary',
    actionRoute: typeToRoute[item.type] ?? '/claims',
  };
}

// Loading skeleton for KPI cards
function KPICardSkeleton() {
  return (
    <div className="bg-card rounded-card border border-border p-4 animate-pulse">
      <div className="h-3 bg-border-light rounded w-2/3 mb-3" />
      <div className="h-8 bg-border-light rounded w-1/2 mb-2" />
      <div className="h-3 bg-border-light rounded w-3/4" />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  // API state
  const [kpi, setKpi] = useState<KpiData | null>(null);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [lossRateAb, setLossRateAb] = useState<number>(-16.8);
  const [lossRateC, setLossRateC] = useState<number>(-11.2);
  const [loading, setLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(true);

  // Fetch KPI
  useEffect(() => {
    let cancelled = false;
    fetchKpi()
      .then((data) => {
        if (cancelled) return;
        setKpi(data);
        setLossRateAb(data.lossRateAb);
        setLossRateC(data.lossRateC);
      })
      .catch(() => {
        // Fallback: keep null → will use mock data below
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Fetch recent claims
  useEffect(() => {
    let cancelled = false;
    fetchClaims({ limit: 5 })
      .then((data) => {
        if (cancelled) return;
        setRecentClaims(data.items.map(mapApiClaim));
      })
      .catch(() => {
        // Fallback: use mock data
        if (!cancelled) setRecentClaims(dashboardRecentClaims);
      })
      .finally(() => {
        if (!cancelled) setClaimsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Build KPI cards from API data or fall back to mock
  const kpiCards = kpi
    ? [
        {
          ...kpiData[0],
          value: kpi.totalClaims,
        },
        {
          ...kpiData[1],
          value: kpi.typeA,
        },
        {
          ...kpiData[2],
          value: kpi.typeB,
        },
        {
          ...kpiData[3],
          value: kpi.typeC,
        },
      ]
    : kpiData;

  const displayClaims = recentClaims.length > 0 ? recentClaims : dashboardRecentClaims;

  const columns: Column<Claim>[] = [
    {
      key: 'id',
      label: '청구번호',
      width: '100px',
      render: (row) => (
        <span className="text-[11px] text-secondary">{row.id}</span>
      ),
    },
    {
      key: 'complex',
      label: '단지·내용',
      render: (row) => (
        <div>
          <div className="font-semibold">{row.complex}</div>
          <div className="text-[11px] text-secondary">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: '접수일',
      width: '80px',
      render: (row) => (
        <span className="text-[12px] text-secondary">{row.date.slice(5).replace('-', '/')}</span>
      ),
    },
    {
      key: 'type',
      label: '유형',
      width: '90px',
      render: (row) => (
        <Badge variant={badgeVariantMap[row.type]}>TYPE {row.type}</Badge>
      ),
    },
    {
      key: 'confidence',
      label: '신뢰도',
      width: '80px',
      render: (row) => {
        const pct = (row.confidence * 100).toFixed(1);
        const color = row.confidence >= 0.9 ? 'text-green' : 'text-amber';
        return <span className={`font-semibold ${color}`}>{pct}%</span>;
      },
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] ?? 'done'}>
          {row.statusLabel}
        </StatusPill>
      ),
    },
  ];

  return (
    <div>
      {/* Page Title */}
      <div className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">청구 관리 대시보드</div>
      <div className="text-[13px] text-secondary mb-[18px]">2026년 3월 · 전체 단지 기준</div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-[18px]">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
          : kpiCards.map((kpi) => (
              <KPICard
                key={kpi.variant}
                {...kpi}
                onClick={() => navigate(kpi.route ?? '/claims')}
              />
            ))}
      </div>

      {/* 2-column layout */}
      <div className="grid gap-[14px] grid-cols-1 xl:grid-cols-[1fr_300px]">
        {/* Left: Recent Claims Table */}
        {claimsLoading ? (
          <div className="bg-card rounded-card border border-border p-6 animate-pulse">
            <div className="h-4 bg-border-light rounded w-1/4 mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-border-light rounded mb-2" />
            ))}
          </div>
        ) : (
          <DataTable<Claim>
            title="최근 청구 내역"
            columns={columns}
            data={displayClaims}
            onRowClick={(row) => navigate(typeToRoute[row.type] ?? '/claims')}
            headerRight={
              <Button variant="secondary" size="sm" onClick={() => navigate('/claims')}>
                전체 보기
              </Button>
            }
          />
        )}

        {/* Right: Loss Rate + Savings */}
        <div className="flex flex-col gap-[14px]">
          <DetailCard title="TYPE별 손해율 절감">
            <BarChart items={barChartData} />
            {/* Savings Summary Box */}
            <div className="bg-border-light rounded-block p-3 mt-4">
              <div className="text-[11px] text-secondary mb-[7px]">이번 달 손해율 절감</div>
              <div className="flex gap-3">
                <div>
                  <div className="text-[18px] font-bold text-amber">{lossRateAb}%</div>
                  <div className="text-[10px] text-secondary">A+B 직접 차단</div>
                </div>
                <div className="w-px bg-border" />
                <div>
                  <div className="text-[18px] font-bold text-green">{lossRateC}%</div>
                  <div className="text-[10px] text-secondary">C 과다견적 방어</div>
                </div>
              </div>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
