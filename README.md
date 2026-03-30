# 보험 하자접수 AI — 어드민 시스템 (Test)

## 데모
🔗 https://aiconsilium-dev.github.io/insuretech-admin-test/

## 기술 스택
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- React Router v7

## 페이지 구성
| 경로 | 페이지 | 기능 |
|------|--------|------|
| `/` | 대시보드 | KPI 카드, 접수 현황 |
| `/claims` | 청구 관리 | 전체 청구건 목록 |
| `/type-a` | TYPE A | 시공사 하자 관리 |
| `/type-b` | TYPE B | 면책 관리 |
| `/type-c` | TYPE C | AI 적산 + 보험금 산출 |
| `/estimation` | 적산 | 공종별 산정 |
| `/approve` | 승인 | 결재 프로세스 |
| `/opinion` | 의견서 | 의견서 발송 |

## 컴포넌트
- `Layout` (Sidebar + Topbar + Content)
- `common/` — Badge, Button, DataTable, KPICard, Modal, StatusPill, Timeline 등

---
법무법인 더 에이치 황해 × AI Consilium
