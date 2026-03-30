import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DataTable,
  StatusPill,
  Button,
} from '@/components/common';
import type { Column } from '@/components/common';
import type { OpinionItem } from '@/lib/types';
import { opinions } from '@/lib/data';
import { fetchDocuments } from '@/lib/api';
import type { DocumentItem } from '@/lib/api';

const statusVariantMap: Record<string, 'done' | 'sent' | 'wait' | 'transfer'> = {
  done: 'done',
  sent: 'sent',
  wait: 'wait',
  transfer: 'transfer',
  paid: 'done',
};

function mapApiDocument(doc: DocumentItem): OpinionItem {
  return {
    claimId: doc.claimId,
    summary: doc.summary,
    type: doc.type ?? doc.docType ?? '의견서',
    date: doc.date?.slice(0, 10) ?? '',
    status: (doc.status as OpinionItem['status']) ?? 'done',
    statusLabel: doc.statusLabel ?? doc.status,
    actionLabel: doc.actionLabel ?? 'PDF',
    actionVariant: (doc.actionVariant ?? 'secondary') as 'primary' | 'secondary',
    actionRoute: doc.actionRoute,
  };
}

export default function OpinionPage() {
  const navigate = useNavigate();
  const [opinionItems, setOpinionItems] = useState<OpinionItem[]>(opinions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDocuments({ limit: 50 })
      .then((data) => {
        if (cancelled) return;
        if (data.items && data.items.length > 0) {
          setOpinionItems(data.items.map(mapApiDocument));
        }
      })
      .catch(() => {
        // Fallback: keep mock data
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const columns: Column<OpinionItem>[] = [
    {
      key: 'claimId',
      label: '청구번호',
      width: '110px',
      render: (row) => <span className="text-[11px] text-secondary">{row.claimId}</span>,
    },
    {
      key: 'summary',
      label: '사건 요약',
      render: (row) => <div className="font-semibold">{row.summary}</div>,
    },
    { key: 'type', label: '의견서 유형', width: '140px' },
    {
      key: 'date',
      label: '생성일',
      width: '110px',
      render: (row) => <span className="text-[12px] text-secondary">{row.date}</span>,
    },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (row) => (
        <StatusPill variant={statusVariantMap[row.status] ?? 'done'}>
          {row.statusLabel}
        </StatusPill>
      ),
    },
    {
      key: 'action',
      label: '액션',
      width: '90px',
      render: (row) => (
        <Button
          variant={row.actionVariant}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            if (row.actionRoute) navigate(row.actionRoute);
          }}
        >
          {row.actionLabel}
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-[18px]">
        <div className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">법률 의견서 관리</div>
        <div className="text-[13px] text-secondary">자동 생성된 법률 의견서 목록</div>
      </div>

      {loading ? (
        <div className="bg-card rounded-card border border-border overflow-hidden animate-pulse">
          <div className="h-10 bg-border-light border-b border-border" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-b border-border items-center">
              <div className="h-3 w-20 bg-border-light rounded" />
              <div className="flex-1 h-3 bg-border-light rounded" />
              <div className="h-3 w-24 bg-border-light rounded" />
              <div className="h-3 w-20 bg-border-light rounded" />
              <div className="h-5 w-16 bg-border-light rounded" />
              <div className="h-6 w-12 bg-border-light rounded" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable<OpinionItem>
          columns={columns}
          data={opinionItems}
          onRowClick={(row) => {
            if (row.actionRoute) navigate(row.actionRoute);
          }}
        />
      )}
    </div>
  );
}
