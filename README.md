# Frontend

Vite 7 + React 18 + TypeScript 기반 프론트엔드 프로젝트.

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 빌드 | Vite 7, TypeScript 5.9 |
| UI | React 18, Ant Design 5 |
| 라우팅 | React Router 7 |
| 상태 관리 | Zustand |
| 서버 상태 | TanStack Query |
| 차트 | ECharts 5 (커스텀 래퍼), amCharts 5 |
| 유효성 검사 | Zod |
| 코드 생성 | Kubb (OpenAPI → TS 타입, Zod 스키마, React Query 훅) |
| 린트/포맷 | Biome |
| 테스트 | Vitest, React Testing Library |

## 시작하기

```bash
pnpm install
pnpm dev
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | TypeScript 체크 + 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과물 미리보기 |
| `pnpm test` | Vitest 감시 모드 실행 |
| `pnpm test:run` | Vitest 단일 실행 |
| `pnpm lint` | Biome 린트/포맷 체크 |
| `pnpm lint:fix` | Biome 자동 수정 |
| `pnpm format` | Biome 포맷 적용 |
| `pnpm generate` | Kubb OpenAPI 코드 생성 |

## 프로젝트 구조

```
src/
├── components/       # 공통 컴포넌트 (EChartsReact, Layout 등)
├── pages/            # 페이지 컴포넌트
├── stores/           # Zustand 스토어
├── gen/              # Kubb 자동 생성 코드 (models, zod, hooks)
├── test/             # 테스트 설정
├── App.tsx           # 라우트 정의
└── main.tsx          # 앱 진입점 (QueryClient, BrowserRouter)
kubb.config.ts        # Kubb 코드 생성 설정
biome.json            # Biome 린트/포맷 설정
```
