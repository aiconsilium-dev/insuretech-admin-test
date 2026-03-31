import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  DetailCard,
  PhotoPlaceholder,
  KVRow,
  ReasonBlock,
  CaseItem,
  StageTracker,
  Timeline,
  Button,
  Toast,
} from '@/components/common';
import { fetchClaimById } from '@/lib/api';
import { useState, useEffect } from 'react';
import type { ClaimDetail } from '@/types/claims';
import type { StageData, TimelineItemData, CaseItemData, KVRowData } from '@/types/ui';

export default function TypeAPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const detail = claim.typeADetail;
  const complexName = claim.complex?.name ?? claim.id;
  const assigneeName = claim.assignee?.name ?? '미배정';
  const claimedDate = claim.claimedAt?.slice(0, 16).replace('T', ' ') ?? '';
  const confidencePct = ((claim.aiConfidence ?? 0) * 100).toFixed(1);
  const builder = claim.complex?.builder ?? '시공사 미상';
  const builtAt = claim.complex?.builtAt ?? '';
  const warrantyYr = claim.complex?.warrantyYr ?? 10;

  // Build stages from events or use defaults
  const stages: StageData[] = claim.events && claim.events.length > 0
    ? claim.events.slice(0, 6).map((ev, idx, arr) => {
        const isDone = ev.status === 'done' || ev.status === 'complete';
        const isNow = ev.status === 'now' || ev.status === 'in_progress' || (idx === arr.findIndex((e) => e.status !== 'done' && e.status !== 'complete'));
        return {
          label: ev.title,
          status: isDone ? 'done' : isNow ? 'now' : 'pending',
          stepNumber: isDone ? undefined : ev.stepNumber,
        };
      })
    : [
        { label: 'AI 하자\n분류', status: 'done' },
        { label: '증거자료\n패키징', status: 'done' },
        { label: '소송\n제기', status: 'now', stepNumber: 3 },
        { label: '변론\n진행', status: 'pending', stepNumber: 4 },
        { label: '판결·\n합의', status: 'pending', stepNumber: 5 },
        { label: '건설사\n배상금 수령', status: 'pending', stepNumber: 6 },
      ];

  // Build timeline from events
  const timeline: TimelineItemData[] = claim.events && claim.events.length > 0
    ? claim.events
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((ev) => ({
          title: ev.title,
          time: ev.eventAt?.slice(0, 16).replace('T', ' ') ?? '',
          status: ev.status === 'done' || ev.status === 'complete'
            ? 'done'
            : ev.status === 'in_progress' || ev.status === 'now'
            ? 'now'
            : 'wait',
          stepNumber: ev.stepNumber,
        }))
    : [
        { title: 'AI 하자 분류 완료 (시공상 하자 확인)', time: claimedDate, status: 'done' },
        { title: '증거자료 패키지 자동 생성', time: claimedDate, status: 'done' },
        { title: '소송 제기 준비 중', time: '진행 중', status: 'now', stepNumber: 3 },
        { title: '변론 진행 예정', time: '대기', status: 'wait', stepNumber: 4 },
      ];

  // Build AI reasons from aiReasons
  const reasons: string[] = claim.aiReasons && claim.aiReasons.length > 0
    ? claim.aiReasons
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((r) => r.reasonText)
    : [`AI 신뢰도 ${confidencePct}% — 분석 결과 참조`];

  // Build cases from precedents
  const cases: CaseItemData[] = claim.precedents && claim.precedents.length > 0
    ? claim.precedents
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => ({ caseNumber: p.caseNumber, description: p.description }))
    : [];

  // Build defect info from typeADetail + complex
  const defectInfo: KVRowData[] = detail
    ? [
        { label: '시공사 (청구 상대방)', value: builder },
        { label: '준공일', value: builtAt },
        { label: '하자 유형', value: detail.defectType },
        { label: '잔여 담보 기간', value: `${detail.warrantyRemaining} — 소송 적격`, valueColor: 'green' },
        { label: '단지 합산 청구 예정액', value: `약 ${detail.totalClaimEst.toLocaleString()}원`, valueColor: 'primary', valueFontSize: '15px' },
        { label: '본 건 기여 예상액', value: `약 ${detail.unitClaimEst.toLocaleString()}원`, valueColor: 'amber' },
      ]
    : [
        { label: '시공사 (청구 상대방)', value: builder },
        { label: '준공일', value: builtAt },
        { label: '보증 기간', value: `${warrantyYr}년` },
        { label: '청구금액', value: claim.amount ? `${claim.amount.toLocaleString()}원` : '미정', valueColor: 'primary', valueFontSize: '15px' },
      ];

  // Build photos array for rendering
  const photos = claim.photos && claim.photos.length > 0
    ? claim.photos.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((p, idx) => ({
        label: p.label,
        span: idx === 0 ? 2 : 1,
        bg: '#d8e4ed',
        borderStyle: idx === 0 ? 'dashed-amber' as const : undefined,
        badges: p.annotations
          ? [{ text: p.annotations, color: 'var(--color-amber)', position: 'bottom-left' as const }]
          : [],
      }))
    : [
        { label: '사진 없음', span: 2, bg: '#d8e4ed', borderStyle: undefined, badges: [] },
      ];

  const stageTitle = `단지 하자소송 진행 단계 — ${complexName}`;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="ba" className="text-[11px] py-[3px] px-[10px]">TYPE A — 하자소송 증거자료</Badge>
            <span className="bg-amber-light text-amber text-[10px] font-semibold px-2 py-[2px] rounded-badge">
              보험 면책 · 건설사 청구
            </span>
            <span className="text-[11px] text-secondary">{claim.id}</span>
          </div>
          <h1 className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">{claim.description}</h1>
          <p className="text-[13px] text-secondary">
            접수: {claimedDate} / 담당: {assigneeName}
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

      {/* Warning Banner */}
      <div className="bg-amber-light border border-amber-border rounded-card py-[14px] px-[18px] mb-[14px] flex gap-[14px] items-start">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[1px]">
          <circle cx="12" cy="12" r="9" stroke="#D97706" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div>
          <div className="text-[13px] font-bold text-amber mb-1">화재보험 면책 사항 — 시공상 하자</div>
          <div className="text-[12px] text-txt leading-[1.7]">
            화재보험 보통약관 면책 조항: <strong>"설계·재료·공사상의 결함으로 생긴 손해는 보상하지 않습니다."</strong><br />
            본 건은 <strong>공동주택관리법 제37조</strong>에 따라 시공사에 하자담보책임을 청구합니다. AI가 수집한 사진·측정값은 소송 증거자료로 APT Insurance 소송팀에 전달됩니다.
          </div>
        </div>
      </div>

      {/* Stage Tracker */}
      <StageTracker title={stageTitle} stages={stages} />

      {/* 2-column detail */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* Evidence Photos */}
          <DetailCard title={`증거 사진 (${photos.length}장 / AI Annotated)`} bodyClassName="p-3">
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
            <div className="mt-2 text-[11px] text-secondary">
              사진 {photos.length}장 · AI 측정값 · 위치 메타데이터 포함 / 소송 증거 패키지 자동 생성
            </div>
          </DetailCard>

          {/* Defect Info */}
          <DetailCard title="하자담보책임 정보 (공동주택관리법 제36조)" bodyClassName="px-[18px] py-3">
            {defectInfo.map((kv, idx) => (
              <KVRow
                key={idx}
                label={kv.label}
                value={kv.value}
                valueColor={kv.valueColor}
                valueFontSize={kv.valueFontSize}
                isLast={idx === defectInfo.length - 1}
              />
            ))}
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Classification */}
          <DetailCard title={`AI 하자 분류 근거 — 신뢰도 ${confidencePct}%`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="ba">시공상 하자</Badge>
              <span className="bg-primary-light text-primary text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">신뢰도 {confidencePct}%</span>
              <span className="bg-amber-light text-amber text-[11px] font-semibold py-[2px] px-[9px] rounded-badge">보험 면책</span>
            </div>
            <ReasonBlock items={reasons} dotColor="amber" />
            {cases.length > 0 && (
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.3px] mb-[7px]">
                  인용 판례
                </div>
                {cases.map((c, idx) => (
                  <CaseItem key={idx} caseNumber={c.caseNumber} description={c.description} />
                ))}
              </div>
            )}
          </DetailCard>

          {/* Litigation Status */}
          <DetailCard title="소송 진행 현황 및 액션" bodyClassName="px-[18px] py-3">
            <Timeline items={timeline} />
            <div className="flex gap-2 mt-[14px]">
              <Button variant="primary" onClick={() => setToastMsg(`소송 제기 확인 — ${claim.id}`)}>소송 제기 요청</Button>
              <Button variant="secondary" onClick={() => setToastMsg('증거 자료 ZIP 패키지 다운로드 시작')}>증거 패키지 다운로드</Button>
            </div>
          </DetailCard>
        </div>
      </div>

      <Toast message={toastMsg} visible={!!toastMsg} onHide={() => setToastMsg('')} />
    </div>
  );
}
