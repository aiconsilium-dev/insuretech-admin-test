import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  PhotoPlaceholder,
  ReasonBlock,
  KVRow,
  Button,
  Toast,
} from '@/components/common';
import { fetchClaimById } from '@/lib/api';
import type { ClaimDetail } from '@/types/claims';

export default function TypeCPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claim, setClaim] = useState<ClaimDetail | null>(null);

  useEffect(() => {
    if (!id) {
      setError('청구 ID가 없습니다.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchClaimById(id)
      .then((data) => {
        if (!cancelled) setClaim(data);
      })
      .catch(() => {
        if (!cancelled) setError('데이터를 불러오지 못했습니다. 다시 시도해주세요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-border-light rounded w-1/3 mb-4" />
        <div className="h-4 bg-border-light rounded w-1/2 mb-8" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
          <div className="h-64 bg-border-light rounded-card" />
          <div className="h-64 bg-border-light rounded-card" />
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-secondary">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-30">
          <circle cx="12" cy="12" r="9" stroke="#64748B" strokeWidth="1.5" />
          <path d="M12 8v4M12 16h.01" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div className="text-[14px] font-semibold mb-1">{error ?? '청구 건을 찾을 수 없습니다.'}</div>
        <button
          onClick={() => navigate('/claims')}
          className="mt-3 text-[13px] text-primary hover:underline"
        >
          청구 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const est = claim.estimation;
  const confidencePct = ((claim.aiConfidence ?? 0) * 100).toFixed(1);
  const claimedDate = claim.claimedAt?.slice(0, 16).replace('T', ' ') ?? '';

  // Build AI reasons
  const reasons: string[] = claim.aiReasons && claim.aiReasons.length > 0
    ? claim.aiReasons
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((r) => r.reasonText)
    : [
        '공용 급배수 배관 누출에 의한 전유부 피해 확인',
        'TYPE A(시공 하자) 근거 불충분',
        'TYPE B(점유자 과실) 증거 없음 → 정당 보상 대상',
      ];

  // Build photos array for rendering
  const photos = claim.photos && claim.photos.length > 0
    ? claim.photos.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((p, idx) => ({
        label: p.label,
        span: idx === 0 ? 2 : 1,
        bg: '#d0e8f5',
        borderStyle: idx === 0 ? 'dashed-primary' as const : undefined,
        badges: p.annotations
          ? [{ text: p.annotations, color: 'var(--color-primary)', position: 'bottom-right' as const }]
          : [],
      }))
    : [
        { label: '세그멘테이션 결과', span: 2, bg: '#d0e8f5', borderStyle: 'dashed-primary' as const, badges: [] },
        { label: '근접 확인', span: 1, bg: '#c8e0ed', borderStyle: undefined, badges: [] },
        { label: '재료 확인', span: 1, bg: '#bfd7e7', borderStyle: undefined, badges: [] },
      ];

  // Estimation data
  const totalAmount = est?.totalAmount ?? claim.amount ?? 0;
  const vendorEstimate = est?.vendorEstimate ?? Math.round(totalAmount * 1.4);
  const savingsAmount = est?.savingsAmount ?? (vendorEstimate - totalAmount);
  const savingsPercent = est?.savingsPercent ?? (savingsAmount > 0 ? ((savingsAmount / vendorEstimate) * 100).toFixed(1) : 0);
  const finalAmount = est?.finalAmount ?? totalAmount;
  const calculationTime = est?.calculationTime ?? '산출 완료';

  const breakdown = est?.breakdown && est.breakdown.length > 0
    ? est.breakdown
    : [
        { label: '보험금 산출액', value: `${totalAmount.toLocaleString()}원` },
      ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="bc" className="text-[11px] py-[3px] px-[10px]">TYPE C — 보험 지급</Badge>
            <span className="text-[11px] text-secondary">{claim.id}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{claim.description}</h1>
          <p className="text-[13px] text-secondary">
            접수: {claimedDate}
          </p>
        </div>
        <span className="bg-green-light text-green text-[11px] font-semibold py-1 px-3 rounded-[5px]">
          신뢰도 {confidencePct}%
        </span>
      </div>

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Photos */}
          <DetailCard title="첨부 사진 — 세그멘테이션 결과" bodyClassName="p-3">
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo, idx) => (
                <PhotoPlaceholder
                  key={idx}
                  label={photo.label}
                  span={photo.span}
                  bgColor={photo.bg}
                  borderStyle={photo.borderStyle}
                  badges={photo.badges}
                />
              ))}
            </div>
          </DetailCard>

          {/* AI Classification */}
          <DetailCard title="AI 분류 근거">
            <ReasonBlock items={reasons} dotColor="green" />
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Estimation Result */}
          <DetailCard title={`AI 적산 결과 요약 — ${calculationTime}`}>
            {/* Big amount */}
            <div className="text-center pt-[14px] pb-[10px]">
              <div className="text-[36px] font-bold text-txt tracking-[-1px]">
                {totalAmount.toLocaleString()}원
              </div>
              <div className="text-[12px] text-secondary mt-1">
                AI 산출 적정 보험금 (표준노임단가 기준)
              </div>
            </div>

            {/* Savings banner */}
            <div className="bg-amber-light rounded-[6px] py-[9px] px-[12px] text-[12px] text-amber flex justify-between mb-[14px] border border-amber-border">
              <span>업체 견적 {vendorEstimate.toLocaleString()}원 대비</span>
              <strong>-{savingsPercent}% ({savingsAmount.toLocaleString()}원 절감)</strong>
            </div>

            {/* Breakdown */}
            {breakdown.map((kv, idx) => (
              <KVRow
                key={idx}
                label={kv.label}
                value={kv.value}
                valueColor={kv.valueColor as 'green' | 'red' | 'amber' | 'primary' | undefined}
                isLast={idx === breakdown.length - 1}
              />
            ))}

            {/* Final total */}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-border" style={{ fontSize: '15px', fontWeight: 700 }}>
              <span>지급 보험금</span>
              <span className="text-green">{finalAmount.toLocaleString()}원</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-[14px]">
              <Button
                variant="green"
                onClick={() => {
                  setToastVisible(true);
                  navigate('/approve');
                }}
              >
                승인 및 지급 처리
              </Button>
              <Button variant="secondary" onClick={() => navigate('/estimation')}>
                수량 내역서 상세
              </Button>
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast
        message="승인 페이지로 이동합니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
