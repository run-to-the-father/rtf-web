# Run to the Father

성경적 가치 기반의 크리스천 AI 챗봇 서비스입니다.

## 프로젝트 개요

- **목표**: 성경적 가치 기반의 크리스천 AI 챗봇 서비스 개발
- **주요 기술 스택**: Next.js (App Router), Tailwind CSS, shadcn/ui, FSD (Feature-Sliced Design)

## 디자인 및 스타일링

- **디자인 참고**: [Figma 디자인](https://www.figma.com/design/6LbI7x1vDL8d0AwaMDFyGc/Run-to-the-father?node-id=0-1&t=xtYwdjpDT8DS8n94-1)
- **스타일링**: Tailwind CSS 기반
- **반응형 디자인**:
  - 모바일 기준 너비: 375px (iPhone SE)
  - 태블릿 브레이크포인트: 768px
  - 데스크탑 최대 너비: 1440px
- **모드 지원**: 다크/라이트 모드

## 아키텍처 구조 (FSD)

프로젝트는 Feature-Sliced Design 아키텍처를 따릅니다:

- **app**: 애플리케이션 진입점, 페이지, 레이아웃
- **widgets**: 복잡한 UI 블록 (헤더, 푸터, 사이드바 등)
- **features**: 비즈니스 기능들 (인증, 채팅 등)
- **entities**: 비즈니스 엔티티 (유저, 메시지 등)
- **domains**: 도메인 로직
- **shared**: 공유 유틸리티, UI 컴포넌트, API 등

각 레이어는 하위 레이어에만 의존할 수 있으며, 상위 레이어에 의존할 수 없습니다.

## 개발 방침

- UI 우선 개발 후 로직 통합
- shadcn/ui 기반 컴포넌트 라이브러리 사용
- 페이지 단위로 작업 진행 (로그인, 회원가입, 채팅 UI 등)
- 작업 완료 후 atomic units로 리팩토링하여 패키지화

## 설치 및 실행
```
pnpm install          # 전체 의존성 설치
pnpm dev              # 앱 실행
```
