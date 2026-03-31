# InsureTech Frontend

보험 청구 심사 및 관리 시스템 프론트엔드

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm

## 시작하기

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 프로젝트 구조

```
src/
  app/              # Next.js App Router 페이지
  components/
    layout/         # 레이아웃 컴포넌트 (Sidebar, Topbar)
    dashboard/      # 대시보드 컴포넌트
    claims/         # 청구 관련 컴포넌트
    type-a/         # 유형A 심사 컴포넌트
    type-b/         # 유형B 심사 컴포넌트
    type-c/         # 유형C 심사 컴포넌트
    approve/        # 승인 관련 컴포넌트
    opinion/        # 소견 관련 컴포넌트
    common/         # 공통 컴포넌트
  lib/              # 유틸리티, 타입, 데이터
  styles/           # 디자인 토큰
```
