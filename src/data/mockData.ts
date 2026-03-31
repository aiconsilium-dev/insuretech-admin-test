/**
 * Mock / static data for fallback and development
 * Previously: src/lib/data.ts
 */

import type { Claim } from '@/types/claims';
import type { KPIData, BarItem, TimelineItemData, StageData, CaseItemData, KVRowData } from '@/types/ui';
import type { OpinionItem } from '@/types/documents';
import type { EstimationRow } from '@/types/estimation';

// ── KPI 데이터 ──
export const kpiData: KPIData[] = [
  {
    label: '이번 달 전체 청구',
    value: 247,
    description: '전월 대비 +12건',
    variant: 'total',
    route: '/claims',
  },
  {
    label: 'TYPE A — 하자소송 이관',
    value: 38,
    description: '시공사 청구 증거자료 등록',
    chipLabel: '소송 진행 중',
    variant: 'type-a',
    route: '/type-a',
    valueStyle: 'var(--amber)',
  },
  {
    label: 'TYPE B — 면책 처리',
    value: 61,
    description: '보험금 직접 차단',
    chipLabel: '차단 건',
    variant: 'type-b',
    route: '/type-b',
  },
  {
    label: 'TYPE C — AI 산출',
    value: 148,
    description: '평균 산출 7분 22초',
    chipLabel: 'AI 처리',
    variant: 'type-c',
    route: '/type-c',
    valueStyle: 'var(--green)',
  },
];

// ── 청구 목록 (7건) ──
export const claims: Claim[] = [
  {
    id: 'CLM-0244',
    complex: '은평뉴타운 관리동',
    description: '엘리베이터 낙상 사고',
    date: '2026-03-12',
    type: 'C',
    confidence: 0.983,
    status: 'wait',
    statusLabel: '승인 대기',
    amount: 1240000,
    actionLabel: '지금 승인',
    actionVariant: 'green',
    actionRoute: '/approve',
    highlighted: true,
  },
  {
    id: 'CLM-0247',
    complex: '헬리오시티 102동 1204호',
    description: '천장 급배수 누수',
    date: '2026-03-14',
    type: 'C',
    confidence: 0.971,
    status: 'done',
    statusLabel: '적산 완료',
    amount: 607850,
    actionLabel: '상세',
    actionVariant: 'primary',
    actionRoute: '/type-c/CLM-0247',
  },
  {
    id: 'CLM-0246',
    complex: '마포래미안 803호',
    description: '외벽 수직 관통균열',
    date: '2026-03-13',
    type: 'A',
    confidence: 0.912,
    status: 'transfer',
    statusLabel: '소송 이관',
    actionLabel: '증거 패키지',
    actionVariant: 'secondary',
    actionRoute: '/type-a/CLM-0246',
  },
  {
    id: 'CLM-0245',
    complex: '잠실파크리오 1205호',
    description: '세탁기 배수 연결 불량',
    date: '2026-03-13',
    type: 'B',
    confidence: 0.958,
    status: 'sent',
    statusLabel: '의견서 발송',
    actionLabel: '이의신청 확인',
    actionVariant: 'secondary',
    actionRoute: '/type-b/CLM-0245',
  },
  {
    id: 'CLM-0243',
    complex: '송도더샵 A동 201호',
    description: '시공 하자 — 바닥 침하',
    date: '2026-03-12',
    type: 'A',
    confidence: 0.887,
    status: 'transfer',
    statusLabel: '소송 이관',
    actionLabel: '증거 패키지',
    actionVariant: 'secondary',
    actionRoute: '/type-a/CLM-0243',
  },
  {
    id: 'CLM-0242',
    complex: '분당파크뷰 502호',
    description: '바닥재 파손',
    date: '2026-03-11',
    type: 'B',
    confidence: 0.931,
    status: 'done',
    statusLabel: '처리 완료',
    actionLabel: '의견서',
    actionVariant: 'secondary',
    actionRoute: '/opinion',
    dimmed: true,
  },
  {
    id: 'CLM-0241',
    complex: '래미안 원베일리 301호',
    description: '욕실 배관 누수',
    date: '2026-03-10',
    type: 'C',
    confidence: 0.991,
    status: 'paid',
    statusLabel: '지급 완료',
    amount: 0,
    actionLabel: '내역서',
    actionVariant: 'secondary',
    dimmed: true,
  },
];

// ── 대시보드 최근 청구 (상위 5건) ──
export const dashboardRecentClaims = claims.slice(1, 6);

// ── 차트 데이터 ──
export const barChartData: BarItem[] = [
  { label: 'TYPE A', value: 15, color: 'amber' },
  { label: 'TYPE B', value: 25, color: 'red' },
  { label: 'TYPE C', value: 60, color: 'green' },
];

export const lossRateSummary = {
  directBlock: { value: '-16.8%', label: 'A+B 직접 차단' },
  overEstimate: { value: '-11.2%', label: 'C 과다견적 방어' },
};

// ── TYPE A 상세: 마포래미안 ──
export const typeADetail = {
  claimId: 'CLM-2026-0246',
  badge: 'TYPE A — 하자소송 증거자료',
  subBadge: '보험 면책 · 건설사 청구',
  title: '마포래미안 외벽 수직 관통균열',
  meta: '하자소송 증거자료 등록 / 접수: 2026-03-13 14:05 / 담당: 김지수',
  navCounter: { current: 2, total: 38 },
  warningBanner: {
    title: '화재보험 면책 사항 — 시공상 하자',
    content:
      '화재보험 보통약관 면책 조항: "설계·재료·공사상의 결함으로 생긴 손해는 보상하지 않습니다." 본 건은 공동주택관리법 제37조에 따라 시공사에 하자담보책임을 청구합니다. AI가 수집한 사진·측정값은 소송 증거자료로 APT Insurance 소송팀에 전달됩니다.',
  },
  stages: [
    { label: 'AI 하자\n분류', status: 'done' as const },
    { label: '증거자료\n패키징', status: 'done' as const },
    { label: '소송\n제기', status: 'now' as const, stepNumber: 3 },
    { label: '변론\n진행', status: 'pending' as const, stepNumber: 4 },
    { label: '판결·\n합의', status: 'pending' as const, stepNumber: 5 },
    { label: '건설사\n배상금 수령', status: 'pending' as const, stepNumber: 6 },
  ] satisfies StageData[],
  photos: [
    {
      label: '전경 — 소송 증거 등록',
      span: 2,
      bg: '#d8e4ed',
      borderStyle: 'dashed-amber' as const,
      badges: [
        { text: '균열 측정 0.8mm', color: 'var(--color-amber)', position: 'bottom-left' as const },
        { text: '증거 등록 완료', color: 'var(--color-green)', position: 'top-right' as const },
      ],
    },
    { label: '근접 1', span: 1, bg: '#cdd9e5' },
    { label: '근접 2', span: 1, bg: '#c2cfda' },
  ],
  defectInfo: [
    { label: '시공사 (청구 상대방)', value: '○○건설' },
    { label: '준공일', value: '2018년 11월' },
    { label: '하자 유형', value: '주요 구조부 균열 (10년 담보)' },
    { label: '잔여 담보 기간', value: '5년 1개월 — 소송 적격', valueColor: 'green' as const },
    { label: '단지 합산 청구 예정액', value: '약 38억원', valueColor: 'primary' as const, valueFontSize: '15px' },
    { label: '본 건 기여 예상액', value: '약 38,000,000원', valueColor: 'amber' as const },
  ] satisfies KVRowData[],
  aiConfidence: 91.2,
  reasons: [
    '수직 관통균열 폭 0.8mm — 건설기준 허용치(0.3mm) 2.7배 초과',
    '균열 방향·패턴이 전단 변형 구조적 하자와 일치 — 외부 충격 아님',
    '건축 4.9년차, 하자담보 기간(10년) 이내 → 시공사 귀책',
  ],
  cases: [
    { caseNumber: '대법원 2019다287231', description: '외벽 균열 시공사 귀책 인정 — 손해배상 확정' },
    { caseNumber: '서울고법 2021나38421', description: '동일 균열 패턴 공동주택 하자담보책임 인용' },
  ] satisfies CaseItemData[],
  timeline: [
    { title: 'AI 하자 분류 완료 (시공상 하자 확인)', time: '2026-03-13 14:05', status: 'done' as const },
    { title: '증거자료 패키지 자동 생성 → APT Insurance 소송팀 전달', time: '2026-03-13 14:07', status: 'done' as const },
    { title: '소송 제기 준비 중', time: '진행 중', status: 'now' as const, stepNumber: 3 },
    { title: '변론 진행 예정', time: '대기', status: 'wait' as const, stepNumber: 4 },
  ] satisfies TimelineItemData[],
};

// ── TYPE B 상세: 잠실파크리오 ──
export const typeBDetail = {
  claimId: 'CLM-2026-0245',
  badge: 'TYPE B — 면책 처리',
  title: '잠실파크리오 세탁기 배수 연결 불량',
  meta: '영업배상책임보험 / 접수: 2026-03-13 11:30 / 청구인: 홍○○',
  navCounter: { current: 1, total: 61 },
  statusFlowItems: ['면책 통보 완료', '이의신청 수신', '재검토 중', '최종 종결'],
  statusFlowDescriptions: [
    '2026-03-13 법률 의견서와 함께 면책 사유 발송 완료. 이의신청 기한: 30일',
    '이의신청이 수신되었습니다. APT Insurance 법무팀 검토 중입니다.',
    'APT Insurance 법무팀이 이의신청을 재검토하고 있습니다. 추가 서류가 요청될 수 있습니다.',
    '최종 종결 처리되었습니다. 청구인에게 최종 결정 통보가 발송되었습니다.',
  ],
  aiConfidence: 95.8,
  reasons: [
    '세탁기 배수 호스 연결부 이탈 흔적 확인',
    '외부 충격 없이 점유자 부주의로 인한 배수 불량 패턴',
    '민법 758조 공작물 책임 — \'설치·관리 하자\' 미충족',
  ],
  clauseText: '보험약관 제4조 제2항 제3호 — 피보험자/점유자의 고의·과실',
  cases: [
    { caseNumber: '서울중앙지법 2022가단52890', description: '세입자 과실로 인한 면책 판결', numberColor: 'red' as const },
  ] satisfies CaseItemData[],
  opinionSummary: {
    title: '면책 통보 의견서 — 발송 완료',
    content: '본 건은 보험약관 제4조 제2항 제3호에 따라 면책 대상으로 판단됩니다.',
    footer: 'APT Insurance 법무팀 최종 검토 완료 | 2026-03-13 15:22',
  },
  objectionRemainingDays: 17,
  civilDocuments: ['민원 대응 요약서', '약관 조항 해석서', '유사 판례 패키지'],
};

// ── TYPE C 상세: 헬리오시티 ──
export const typeCDetail = {
  claimId: 'CLM-2026-0247',
  badge: 'TYPE C — 보험 지급',
  title: '헬리오시티 102동 1204호 천장 급배수 누수',
  meta: '주택화재보험 / 접수: 2026-03-14 09:23',
  confidence: 97.1,
  photos: [
    {
      label: '세그멘테이션 결과',
      span: 2,
      bg: '#d0e8f5',
      borderStyle: 'dashed-primary' as const,
      badges: [{ text: 'AREA 2.4㎡', color: 'var(--color-primary)', position: 'bottom-right' as const }],
    },
    { label: '근접 확인', span: 1, bg: '#c8e0ed' },
    { label: '재료 확인', span: 1, bg: '#bfd7e7' },
  ],
  reasons: [
    '공용 급배수 배관 누출에 의한 전유부 피해 확인',
    'TYPE A(시공 하자) 근거 불충분',
    'TYPE B(점유자 과실) 증거 없음 → 정당 보상 대상',
  ],
  estimationResult: {
    totalAmount: 607850,
    calculationTime: '6분 41초',
    vendorEstimate: 850000,
    savingsPercent: 28.5,
    savingsAmount: 242150,
    breakdown: [
      { label: '재료비 (방수층 3.1㎡)', value: '182,400원' },
      { label: '노무비 (재도장 12.3㎡)', value: '298,700원' },
      { label: '균열주입 (4.7m)', value: '186,900원' },
      { label: '감가상각 (9.2%)', value: '-60,150원', valueColor: 'red' as const },
    ] satisfies KVRowData[],
    finalAmount: 607850,
  },
};

// ── 적산 수량 내역서 ──
export const estimationRows: EstimationRow[] = [
  {
    id: 1,
    name: '방수층 보수',
    description: '탄성도막 방수',
    quantity: '3.10',
    unit: '㎡',
    standardLabel: '표준품셈',
    standardVariant: 'primary',
    subtotal: 79100,
    checked: true,
  },
  {
    id: 2,
    name: '천장 재도장',
    description: '퍼티 + 도장 2회',
    quantity: '12.30',
    unit: '㎡',
    standardLabel: '물가정보지',
    standardVariant: 'green',
    subtotal: 124700,
    checked: true,
  },
  {
    id: 3,
    name: '균열주입',
    description: '에폭시 수지',
    quantity: '4.70',
    unit: 'm',
    standardLabel: '표준품셈',
    standardVariant: 'primary',
    subtotal: 104900,
    checked: true,
  },
  {
    id: 4,
    name: '석고보드 교체',
    description: '미선택',
    quantity: '2.40',
    unit: '㎡',
    standardLabel: '',
    standardVariant: 'primary',
    subtotal: 42700,
    checked: false,
  },
];

export const estimationDeductions = {
  depreciation: 60150,
  deductible: 30000,
  indirectRate: 0.105,
};

// ── 법률 의견서 목록 ──
export const opinions: OpinionItem[] = [
  {
    claimId: 'CLM-0245',
    summary: '잠실파크리오 — 세탁기 배수',
    type: '면책 통보서',
    date: '2026-03-13',
    status: 'done',
    statusLabel: '발송 완료',
    actionLabel: 'PDF',
    actionVariant: 'secondary',
  },
  {
    claimId: 'CLM-0246',
    summary: '마포래미안 — 외벽 균열',
    type: '소송 이관 근거서',
    date: '2026-03-13',
    status: 'transfer',
    statusLabel: 'APT Insurance 전달',
    actionLabel: 'PDF',
    actionVariant: 'secondary',
  },
  {
    claimId: 'CLM-0247',
    summary: '헬리오시티 — 급배수 누수',
    type: '손해사정 의견서',
    date: '2026-03-14',
    status: 'wait',
    statusLabel: '승인 대기',
    actionLabel: '승인',
    actionVariant: 'primary',
    actionRoute: '/approve',
  },
  {
    claimId: 'CLM-0242',
    summary: '분당파크뷰 — 바닥재 파손',
    type: '면책 통보서',
    date: '2026-03-11',
    status: 'done',
    statusLabel: '처리 완료',
    actionLabel: 'PDF',
    actionVariant: 'secondary',
  },
];

// ── 승인 페이지 타임라인 ──
export const approveTimeline: TimelineItemData[] = [
  { title: '청구 접수', time: '2026-03-14 09:23', status: 'done' },
  { title: 'AI 분류 완료 (TYPE C)', time: '2026-03-14 09:24', status: 'done' },
  { title: '적산 산출 완료 (607,850원)', time: '2026-03-14 09:31', status: 'done' },
  { title: '법률 의견서 첨부', time: '2026-03-14 09:45', status: 'done' },
  { title: '손해사정사 최종 승인 대기', time: '현재', status: 'now', stepNumber: 5 },
];

// ── 탭 필터 카운트 ──
export const claimTabCounts = {
  all: 247,
  a: 38,
  b: 61,
  c: 148,
  wait: 3,
};
