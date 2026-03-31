import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  StatusFlow,
  ReasonBlock,
  CaseItem,
  Button,
  Toast,
} from '@/components/common';
import { fetchClaimById } from '@/lib/api';
import type { ClaimDetail } from '@/types/claims';
import type { CaseItemData } from '@/types/ui';

export default function TypeBPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
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

  const detail = claim.typeBDetail;
  const assigneeName = claim.assignee?.name ?? '미배정';
  const claimedDate = claim.claimedAt?.slice(0, 16).replace('T', ' ') ?? '';
  const confidencePct = ((claim.aiConfidence ?? 0) * 100).toFixed(1);
  const policyType = claim.policy?.policyType ?? '영업배상책임보험';
  const holderName = claim.claimantName ?? claim.policy?.holderName ?? '청구인 미상';

  // Build AI reasons
  const reasons: string[] = claim.aiReasons && claim.aiReasons.length > 0
    ? claim.aiReasons
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((r) => r.reasonText)
    : [`AI 신뢰도 ${confidencePct}% — 면책 분류`];

  // Build cases from precedents
  const cases: CaseItemData[] = claim.precedents && claim.precedents.length > 0
    ? claim.precedents
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => ({ caseNumber: p.caseNumber, description: p.description, numberColor: 'red' as const }))
    : [];

  // Status flow items from events or defaults
  const statusFlowItems = claim.events && claim.events.length > 0
    ? claim.events.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((ev) => ev.title)
    : ['면책 통보 완료', '이의신청 수신', '재검토 중', '최종 종결'];

  const statusFlowDescriptions = claim.events && claim.events.length > 0
    ? claim.events.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((ev) => ev.title)
    : [
        `${claimedDate} 법률 의견서와 함께 면책 사유 발송 완료. 이의신청 기한: 30일`,
        '이의신청이 수신되었습니다. APT Insurance 법무팀 검토 중입니다.',
        'APT Insurance 법무팀이 이의신청을 재검토하고 있습니다. 추가 서류가 요청될 수 있습니다.',
        '최종 종결 처리되었습니다. 청구인에게 최종 결정 통보가 발송되었습니다.',
      ];

  const clauseText = detail?.exemptionClause ?? '보험약관 제4조 제2항 제3호 — 피보험자/점유자의 고의·과실';
  const objectionRemainingDays = detail?.objectionDeadlineDays ?? 30;

  const civilDocuments = ['민원 대응 요약서', '약관 조항 해석서', '유사 판례 패키지'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="bb" className="text-[11px] py-[3px] px-[10px]">TYPE B — 면책 처리</Badge>
            <span className="text-[11px] text-secondary">{claim.id}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{claim.description}</h1>
          <p className="text-[13px] text-secondary">
            {policyType} / 접수: {claimedDate} / 청구인: {holderName} / 담당: {assigneeName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setToastMsg('이전 건으로 이동')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            이전 건
          </button>
          <button
            onClick={() => setToastMsg('다음 건으로 이동')}
            className="flex items-center gap-1 py-[5px] px-[10px] rounded-[6px] border border-border bg-card text-[12px] font-medium text-secondary cursor-pointer transition-all hover:border-primary hover:text-primary"
          >
            다음 건
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Status Flow Card */}
      <div className="bg-card rounded-card border border-border mb-[14px]">
        <div className="py-[12px] px-[18px]">
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] mb-2">면책 처리 진행 상태</div>
          <StatusFlow
            items={statusFlowItems}
            activeIndex={activeFlowIndex}
            onChange={setActiveFlowIndex}
          />
          <div className="text-[12px] text-secondary bg-border-light rounded-[6px] py-[8px] px-[10px]">
            {statusFlowDescriptions[activeFlowIndex]}
          </div>
        </div>
      </div>

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Classification */}
          <DetailCard title={`AI 분류 근거 — 신뢰도 ${confidencePct}%`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="bb">TYPE B</Badge>
              <span className="bg-red-light text-red text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">신뢰도 {confidencePct}%</span>
            </div>
            <ReasonBlock items={reasons} dotColor="red" />

            {/* Clause */}
            <div className="mt-[10px] bg-red-light rounded-[6px] py-[10px] px-[12px]">
              <div className="text-[11px] font-bold text-red mb-1">적용 약관 (자동 매칭)</div>
              <div className="text-[12px] text-red leading-[1.6] opacity-90">{clauseText}</div>
            </div>

            {/* Cases */}
            <div className="mt-2">
              {cases.map((c, idx) => (
                <CaseItem
                  key={idx}
                  caseNumber={c.caseNumber}
                  description={c.description}
                  numberColor={c.numberColor}
                />
              ))}
            </div>
          </DetailCard>

          {/* Legal Opinion */}
          <DetailCard title="법률 의견서 상태" bodyClassName="px-[18px] py-3">
            <div className="bg-primary-light border border-[#c7d2fe] rounded-btn py-[11px] px-[13px] flex gap-[10px] items-start mb-[10px]">
              <div>
                <div className="font-bold text-[13px] mb-[6px] text-primary">
                  면책 통보 의견서 — {detail?.legalOpinionStatus ?? '발송 완료'}
                </div>
                본 건은 보험약관 제4조 제2항 제3호에 따라 면책 대상으로 판단됩니다.<br />
                <span className="text-[11px] text-secondary">APT Insurance 법무팀 최종 검토 완료 | {claimedDate}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setToastMsg('법률 의견서 PDF 다운로드')}>PDF 다운로드</Button>
              <Button variant="secondary" onClick={() => navigate('/opinion')}>
                의견서 관리
              </Button>
            </div>
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Objection Management */}
          <DetailCard title="이의신청 관리" bodyClassName="px-[18px] py-3">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[13px] text-secondary">접수된 이의신청 없음</span>
              <span className="text-[11px] text-secondary bg-border-light py-[3px] px-2 rounded-badge">잔여 기간 {objectionRemainingDays}일</span>
            </div>
            <div className="bg-border-light rounded-block p-6 text-center text-secondary mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <div className="text-[12px]">이의신청 기한 내 접수 시<br />자동으로 재검토 단계로 이동합니다</div>
            </div>
            <div className="bg-amber-light rounded-[6px] py-[10px] px-[12px] text-[12px] text-amber">
              이의신청 수신 시 APT Insurance 법무팀에 자동 알림이 발송됩니다.
            </div>
          </DetailCard>

          {/* Civil Documents */}
          <DetailCard title="금감원 민원 대응 자료" bodyClassName="px-[18px] py-3">
            <div className="text-[12px] text-secondary leading-[1.6] mb-3">
              면책 통보 시 자동 생성된 민원 대응 자료입니다. 금감원 민원 접수 시 즉시 활용 가능합니다.
            </div>
            <div className="flex flex-col gap-[7px]">
              {civilDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-[8px] px-[10px] bg-border-light rounded-[6px] text-[12px]"
                >
                  <span className="font-semibold">{doc}</span>
                  <Button variant="secondary" size="sm" className="py-[3px] px-[9px] text-[11px]" onClick={() => setToastMsg(`${doc} 다운로드`)}>다운로드</Button>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast message={toastMsg} visible={!!toastMsg} onHide={() => setToastMsg('')} />
    </div>
  );
}
