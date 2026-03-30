# PRD — 보험 하자접수 AI 어드민 시스템

## 1. Product Overview
- **서비스명**: 보험 하자접수 AI — 어드민 (Test)
- **설명**: 보험사/손해사정사가 아파트 하자접수 청구건을 TYPE별로 관리하는 데스크탑 웹 시스템
- **대상 사용자**: 보험사 담당자, 손해사정사, 관리자

## 2. Tech Stack
- **프레임워크**: React 19 + TypeScript
- **빌드**: Vite 8
- **스타일링**: Tailwind CSS v4 (@tailwindcss/vite 플러그인)
- **라우팅**: React Router v7 (BrowserRouter)
- **패키지 매니저**: pnpm
- **배포**: GitHub Pages (gh-pages 브랜치)

## 3. Architecture
```
frontend/
├── src/
│   ├── App.tsx              — 라우터 정의
│   ├── main.tsx             — 엔트리포인트
│   ├── index.css            — 글로벌 스타일
│   ├── contexts/
│   │   └── SidebarContext   — 사이드바 상태 관리
│   ├── lib/
│   │   ├── types.ts         — 타입 정의
│   │   └── data.ts          — 목업 데이터
│   ├── components/
│   │   ├── layout/          — Layout, Sidebar, Topbar
│   │   └── common/          — 재사용 컴포넌트 (Badge, Button, DataTable, KPICard, Modal 등)
│   └── pages/               — 8개 페이지 컴포넌트
```

## 4. Pages & Routes
| 경로 | 컴포넌트 | 기능 |
|------|---------|------|
| `/` | DashboardPage | KPI 4종 카드 + 접수 현황 요약 |
| `/claims` | ClaimsPage | 전체 청구건 목록 (필터/검색) |
| `/type-a` | TypeAPage | 시공사 하자 — 하자보증기간, 감정평가, 시공사 협상/청구 |
| `/type-b` | TypeBPage | 면책 — 면책 사유, 의견서 발송, 이의신청, 금감원 대응 |
| `/type-c` | TypeCPage | AI 적산 — 공종별 산정, 소유자/임차인 분리, 보험 연계 |
| `/estimation` | EstimationPage | 적산 상세 — 품셈/단가 기반 금액 산출 |
| `/approve` | ApprovePage | 승인 결재 — 결재 프로세스 관리 |
| `/opinion` | OpinionPage | 의견서 — 의견서 작성/발송/관리 |

## 5. Key Features
- TYPE 3종 분류: A(시공사 하자) / B(면책) / C(보험금 산출)
- 공종별 AI 적산 (2026년 표준품셈 기반)
- 소유자/임차인 보상 분리 표시
- 단지별 가입 보험 관리 (CGL/재물/주택화재)
- 현장조사/구상권/보험연계 통합 관리
- 면책 의견서 발송 + 이의신청 + 금감원 대응

## 6. Design System
- Tailwind CSS v4
- 사이드바 네비게이션 + 탑바 + 메인 콘텐츠 레이아웃
- 공통 컴포넌트: Badge, Button, DataTable, KPICard, Modal, StatusPill, Timeline, StageTracker

## 7. Deployment
- **URL**: https://aiconsilium-dev.github.io/insuretech-admin-test/
- **브랜치**: gh-pages
- **base path**: /insuretech-admin-test/

## 8. Known Limitations
- 모든 데이터는 목업 (lib/data.ts)
- 백엔드 미구현 (backend/ 디렉토리는 TBD)
- AI 적산은 프론트엔드 시뮬레이션
