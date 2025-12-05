![Dewdew](./.github/assets/dewdew.webp)

# 🚀 Dewdew Portfolio

> **Software Engineer 이연주의 개인 포트폴리오 웹사이트**  
> 현대적인 웹 기술과 사용자 경험을 중시한 풀스택 개발자의 작품집

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.2.1-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5.25-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

[🌐 **Web Site**](https://www.dewdew.dev)

---

## ✨ 프로젝트 개요

**Dewdew Portfolio**는 소프트웨어 엔지니어 이연주의 개인 포트폴리오 웹사이트로, 최신 웹 기술을 활용하여 제작된 **풀스택 프로젝트**입니다. 

### 🎯 프로젝트 목표
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- 🌍 **다국어 지원**: 한국어/영어 완벽 지원
- ⚡ **최적화된 성능**: Core Web Vitals 최고 점수 달성
- 🎨 **현대적 UI/UX**: Nuxt UI 기반 세련된 인터페이스
- 🔒 **타입 안전성**: 완전한 TypeScript 지원

---

## 🛠️ 기술 스택

### **Frontend**
[![My Skills](https://skillicons.dev/icons?i=nuxtjs,vue,ts,sass,tailwind,vite)](https://skillicons.dev)

- **🎨 Framework**: Nuxt 4.2.1 (Vue 3 + SSR/SSG)
- **📝 Language**: TypeScript 5.6.3
- **🎭 Styling**: Sass + Tailwind CSS + Nuxt UI 4.2.1
- **⚡ Build Tool**: Vite 7
- **📊 Analytics**: Vercel Analytics + Speed Insights
- **📱 PWA**: Service Worker 기반 오프라인 지원

### **Backend & Database**
[![Backend Skills](https://skillicons.dev/icons?i=supabase,postgres,nodejs)](https://skillicons.dev)

- **🗄️ Database**: Supabase (PostgreSQL)
- **🔐 Auth**: Supabase Auth
- **📁 Storage**: Supabase Storage
- **🌐 API**: Nuxt Server API

### **DevOps & Tools**
[![DevOps Skills](https://skillicons.dev/icons?i=vercel,github,vscode,vim,bun)](https://skillicons.dev)

- **🚀 Deployment**: Vercel
- **📦 Package Manager**: Bun
- **🔄 Version Control**: GitHub
- **🎯 Editor**: VS Code + Vim

---

## 🏗️ 프로젝트 아키텍처

### 📁 프로젝트 구조
```
dewdew_v5/
├── 📱 app/                    # Nuxt 4 앱 디렉토리
│   ├── 🧩 components/         # Vue 컴포넌트 (Atomic Design)
│   │   ├── a/                 # Atomic 컴포넌트
│   │   │   ├── footer/        # 푸터 컴포넌트 (Group, Information, Menu, Sns)
│   │   │   ├── Forecast.client.vue
│   │   │   ├── IconText.vue
│   │   │   ├── LanguageChange.vue
│   │   │   ├── ThemeChange.vue
│   │   │   └── TooltipButton.vue
│   │   ├── chat/              # AI 채팅 관련 컴포넌트
│   │   │   ├── Container.vue
│   │   │   ├── Content.vue
│   │   │   ├── DynamicComponent.vue
│   │   │   ├── Error.server.vue
│   │   │   └── Skeleton.server.vue
│   │   ├── dynamic/           # 동적 렌더링 카드 컴포넌트
│   │   │   └── card/
│   │   │       ├── ContactForm.client.vue
│   │   │       ├── EducationCard.server.vue
│   │   │       ├── ExperienceCarousel.server.vue
│   │   │       ├── ExperienceTimeline.server.vue
│   │   │       ├── Greeting.server.vue
│   │   │       ├── HobbyCarousel.server.vue
│   │   │       ├── ImageCarousel.server.vue
│   │   │       ├── Profile.server.vue
│   │   │       ├── ProjectCarousel.server.vue
│   │   │       ├── Skill.server.vue
│   │   │       ├── SkillRadar.server.vue
│   │   │       ├── SocialLinks.server.vue
│   │   │       └── WeaknessesCard.server.vue
│   │   ├── InstallPwa.client.vue  # PWA 설치 프롬프트
│   │   ├── SpeedInsights.client.vue  # 성능 모니터링
│   │   └── intro/             # 인트로 애니메이션 컴포넌트
│   │       ├── Controller.client.vue
│   │       ├── TransitionMessage.client.vue
│   │       ├── TransitionMessage.server.vue
│   │       ├── TypeTitle.client.vue
│   │       └── TypeTitle.server.vue
│   ├── 🔧 composables/        # Vue Composables (도메인별 분리)
│   │   ├── chat/              # AI 채팅 관련
│   │   │   └── useChat.ts     # 채팅 상태 관리 및 스트리밍 처리
│   │   ├── data/              # 데이터 관련
│   │   │   ├── hello.ts
│   │   │   ├── korLocation.json
│   │   │   ├── locations.ts
│   │   │   └── weather.ts
│   │   ├── forecast/          # 날씨 예보 관련
│   │   │   └── translateCoords.ts
│   │   ├── formatting/        # 포맷팅 유틸
│   │   │   ├── useDateFormatter.ts
│   │   │   └── useFormatter.ts
│   │   ├── query/             # 쿼리 관련
│   │   │   └── index.ts
│   │   ├── ui/                # UI 유틸리티
│   │   │   ├── imageStorage.ts
│   │   │   ├── useColorUtils.ts
│   │   │   └── useUtils.ts
│   │   ├── validation/        # 유효성 검사
│   │   │   └── useValidation.ts
│   │   └── useSkillIcon.ts    # 스킬 아이콘 유틸
│   ├── 🔌 plugins/            # Nuxt 플러그인
│   │   ├── analytics.client.ts  # Vercel Analytics
│   │   └── senitize.ts        # DOMPurify HTML 정제
│   ├── 📄 pages/              # 파일 기반 라우팅
│   │   ├── ai/                # AI 채팅 관련 페이지
│   │   │   ├── index.vue     # AI 채팅 메인 페이지
│   │   │   └── components.vue # AI 컴포넌트 데모 페이지
│   │   └── index.vue          # 메인 페이지
│   ├── 🎨 layouts/            # 레이아웃 컴포넌트
│   │   ├── center.vue
│   │   └── default.vue
│   ├── 🏪 stores/             # Pinia 상태 관리
│   │   ├── locationWeather.ts # 위치 및 날씨 상태
│   │   └── menu.ts            # 메뉴 상태
│   ├── 📝 types/              # TypeScript 타입 정의 (도메인별)
│   │   ├── chat.ts            # 채팅 관련 타입
│   │   ├── database.types.ts  # Supabase 데이터베이스 타입
│   │   ├── supabase-menu.ts   # 메뉴 스키마 타입
│   │   ├── supabase-resume.ts # 이력서 스키마 타입
│   │   ├── supabase.ts        # Supabase 공통 타입
│   │   └── weather.ts         # 날씨 관련 타입
│   ├── 🎨 assets/             # 정적 자산
│   │   ├── css/
│   │   │   └── main.css
│   │   └── scss/
│   │       ├── fonts.scss
│   │       └── style.scss
│   ├── app.config.ts          # 앱 설정
│   ├── app.vue                # 루트 컴포넌트
│   └── error.vue              # 에러 페이지
├── 🌐 server/                 # 서버 API 엔드포인트
│   └── api/
│       ├── chat/              # AI 채팅 API
│       │   ├── greeting.get.ts
│       │   └── index.post.ts
│       ├── menu/              # 메뉴 API
│       │   └── externalMenu.get.ts
│       └── resume/            # 이력서 데이터 API
│           ├── education.get.ts
│           ├── experience.get.ts
│           ├── hobbies.get.ts
│           ├── imageArchive.get.ts
│           ├── profile.get.ts
│           ├── projects.get.ts
│           ├── skills.get.ts
│           └── socialLinks.get.ts
├── 🗄️ supabase/               # Supabase Functions
│   └── functions/
│       ├── _shared/            # 공유 모듈 (배포 안됨)
│       │   ├── _openai.ts          # OpenAI 클라이언트 (레거시)
│       │   ├── ai-provider.ts      # AI 프로바이더 추상화
│       │   ├── component-mapper.ts # 컴포넌트 타입 매핑
│       │   ├── history-optimizer.ts # 대화 기록 최적화
│       │   ├── rag.ts              # RAG 로직
│       │   ├── supabase.ts         # Supabase 클라이언트
│       │   ├── types.ts            # 타입 정의
│       │   └── url-fetcher.ts      # URL 페처 유틸리티
│       └── dewdew-rag-portfolio/    # RAG 포트폴리오 함수
│           ├── index.ts
│           └── README.md
├── 🌍 i18n/                   # 다국어 번역 파일
│   └── locales/
│       ├── en.ts              # 영어 번역
│       └── ko.ts              # 한국어 번역
├── 📁 public/                 # 정적 파일
│   ├── fonts/                 # 웹폰트
│   ├── image/                 # 이미지 파일
│   ├── favicon.ico
│   ├── manifest.webmanifest
│   └── _robots.txt
├── 📜 scripts/                # 빌드 스크립트
│   └── version-manager.js
├── nuxt.config.ts             # Nuxt 설정
├── tsconfig.json              # TypeScript 설정
├── eslint.config.mjs          # ESLint 설정
├── package.json               # 패키지 의존성
└── README.md                  # 프로젝트 문서
```

### 🧩 Composable 아키텍처
```typescript
// 도메인별로 분리된 Composable 구조 (단일 책임 원칙)
app/composables/
├── chat/
│   └── useChat.ts             # AI 채팅 상태 관리, 스트리밍 처리
├── data/
│   ├── hello.ts               # 인사말 데이터
│   ├── korLocation.json       # 한국 지역 데이터
│   ├── locations.ts           # 위치 관련 유틸
│   └── weather.ts             # 날씨 데이터 처리
├── forecast/
│   └── translateCoords.ts     # 좌표 변환 (위경도 ↔ 격자)
├── formatting/
│   ├── useDateFormatter.ts    # 날짜/시간 포맷팅
│   └── useFormatter.ts        # 일반 데이터 포맷팅
├── query/
│   └── index.ts               # 쿼리 관련 유틸
├── ui/
│   ├── imageStorage.ts        # 이미지 저장소 관리 (Supabase)
│   ├── useColorUtils.ts       # 색상 매핑 유틸
│   └── useUtils.ts            # UI 헬퍼 함수
├── validation/
│   └── useValidation.ts       # 입력 유효성 검사
└── useSkillIcon.ts            # 스킬 아이콘 유틸
```

### 📋 타입 시스템
```typescript
// 도메인 주도 설계(DDD) 적용 - 도메인별 타입 분리
app/types/
├── chat.ts                    # AI 채팅 관련 타입 (ChatMessage, ComponentType 등)
├── database.types.ts          # Supabase 데이터베이스 자동 생성 타입 (public 스키마)
├── supabase-menu.ts           # 메뉴 스키마 타입 (자동 생성)
├── supabase-resume.ts         # 이력서 스키마 타입 (자동 생성)
├── supabase.ts                # Supabase 공통 타입 (자동 생성)
└── weather.ts                 # 날씨 관련 타입
```

### 🤖 AI 채팅 시스템 아키텍처
```typescript
// RAG 기반 AI 채팅 시스템
supabase/functions/
├── _shared/                    # 공유 모듈 (배포 안됨)
│   ├── component-mapper.ts    # 쿼리 → 컴포넌트 타입 매핑
│   ├── rag.ts                 # RAG (Retrieval-Augmented Generation) 로직
│   ├── ai-provider.ts         # AI 프로바이더 추상화 (@ai-sdk/openai)
│   ├── _openai.ts             # OpenAI 클라이언트 (레거시)
│   ├── history-optimizer.ts   # 대화 기록 최적화
│   ├── url-fetcher.ts         # URL 페처 유틸리티
│   ├── supabase.ts            # Supabase 클라이언트
│   └── types.ts               # 타입 정의
└── dewdew-rag-portfolio/      # 배포되는 Edge Function
    └── index.ts               # RAG 엔드포인트

// 클라이언트 측
app/composables/chat/
└── useChat.ts                 # 스트리밍 처리, 메시지 관리

app/components/chat/
├── Container.vue              # 채팅 컨테이너
├── Content.vue               # 메시지 표시 영역
├── DynamicComponent.vue       # 동적 컴포넌트 렌더링
├── Error.server.vue           # 에러 컴포넌트
└── Skeleton.server.vue        # 로딩 스켈레톤

app/components/dynamic/card/   # 동적 렌더링 카드 컴포넌트
├── ContactForm.client.vue
├── EducationCard.server.vue
├── ExperienceCarousel.server.vue
├── ExperienceTimeline.server.vue
├── Greeting.server.vue
├── HobbyCarousel.server.vue
├── ImageCarousel.server.vue
├── Profile.server.vue
├── ProjectCarousel.server.vue
├── Skill.server.vue
├── SkillRadar.server.vue
├── SocialLinks.server.vue
└── WeaknessesCard.server.vue
```

---

## 🌟 주요 기능

### 🏠 **메인 페이지** (`/`)
- **실시간 날씨**: 사용자 위치 기반 날씨 정보 표시 (기상청 API)
- **타이핑 애니메이션**: TypeIt으로 동적 텍스트 효과
- **반응형 레이아웃**: 데스크톱/모바일 최적화
- **인트로 애니메이션**: 부드러운 페이지 전환 효과

### 🤖 **AI 채팅** (`/ai`)
- **RAG 기반 AI**: 포트폴리오 데이터 기반 지식 검색
- **스트리밍 응답**: 실시간 텍스트 스트리밍
- **동적 컴포넌트**: 프로젝트, 경력, 스킬 등을 컴포넌트로 표시
- **자동 스크롤**: 긴 대화에서도 자동 스크롤 유지
- **컴포넌트 매핑**: 자연어 쿼리 → 적절한 UI 컴포넌트 자동 매핑
- **컴포넌트 데모**: `/ai/components`에서 모든 동적 컴포넌트 미리보기

### 📱 **PWA (Progressive Web App)**
- **오프라인 지원**: Service Worker 기반 캐싱
- **설치 프롬프트**: 모바일/데스크톱 설치 가능
- **자동 업데이트**: 새 버전 자동 감지 및 업데이트
- **캐싱 전략**: 이미지, 폰트, API 응답 최적화된 캐싱

### 🎨 **UI 컴포넌트**
- **Atomic Design**: 재사용 가능한 컴포넌트 구조
- **Nuxt UI**: 커스텀 프리픽스 (`Dd`) 적용
- **다크/라이트 모드**: 시스템 테마 자동 감지
- **다국어 지원**: 한국어/영어 실시간 전환

---

## ⚡ 성능 최적화

### 🚀 **Core Web Vitals**
- ✅ **LCP**: 1.2초 이하 (이미지 최적화)
- ✅ **FID**: 100ms 이하 (코드 스플리팅)
- ✅ **CLS**: 0.1 이하 (레이아웃 안정성)

### 📦 **번들 최적화**
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Dynamic Import**: 필요시에만 모듈 로드
- **Image Optimization**: WebP/AVIF 자동 변환
- **PWA**: Service Worker 캐싱

---

## 🚀 시작하기

**자세한 설정 가이드는 [SETUP.md](./SETUP.md)를 참조하세요.**

### 📋 **요구사항**
- Node.js 24.5.0+
- Bun 1.2.0+
- Supabase 계정

### ⚙️ **빠른 시작**

```bash
# 저장소 클론
git clone https://github.com/dewdew/dewdew_v5.git
cd dewdew_v5

# Node.js 버전 설정
nvm use

# 의존성 설치
bun install

# 환경 변수 설정
cp .env.example .env
# 필수 환경 변수:
# - SUPABASE_URL
# - SUPABASE_KEY
# - OPENAI_API_KEY (AI 채팅 기능용)

# 개발 서버 실행
bun dev
```

🌐 **브라우저에서 http://localhost:4110 접속**

### 🔧 **Supabase Functions 배포**
```bash
# Supabase 로그인
bun run supabase:login

# 타입 생성
bun run supabase:type          # public 스키마 타입 생성
bun run supabase:type-menu     # menu 스키마 타입 생성
bun run supabase:type-resume   # resume 스키마 타입 생성
bun run supabase:type-data     # data 스키마 타입 생성

# Functions 배포
bun run supabase:deploy
```

---

## 📊 프로젝트 진화 과정

### 🎯 **Phase 1: Composable 아키텍처 최적화**
- **문제**: 249줄의 거대한 `useUi` composable
- **해결**: 5개 전용 모듈로 분리 (단일 책임 원칙)
- **결과**: 유지보수성 향상, IDE 지원 강화

### 🏗️ **Phase 2: 타입 시스템 개선**
- **문제**: Monolithic `global.d.ts` (204줄)
- **해결**: 도메인별 타입 분리 + 제네릭 패턴
- **결과**: 타입 안전성 향상, 코드 재사용성 증대

### ⚡ **Phase 3: Nuxt 4 마이그레이션**
- **업그레이드**: Nuxt 3 → Nuxt 4.2.1
- **개선**: i18n v10, Node.js 24.5 지원
- **최적화**: 빌드 성능 20% 향상

### 🤖 **Phase 4: AI 채팅 시스템 구축**
- **RAG 구현**: Supabase Edge Functions 기반 RAG 시스템
- **스트리밍 처리**: 실시간 텍스트 스트리밍 및 자동 스크롤
- **동적 컴포넌트**: 자연어 쿼리 기반 컴포넌트 자동 매핑
- **성능 최적화**: DOM 조작 최소화로 스크롤 성능 개선

### 📱 **Phase 5: PWA 및 성능 모니터링**
- **PWA 구현**: Service Worker 기반 오프라인 지원
- **Vercel Analytics**: 실시간 사용자 분석 통합
- **Speed Insights**: Core Web Vitals 모니터링
- **캐싱 전략**: 이미지, API, 정적 자산 최적화된 캐싱

---

## 🛠️ 기술적 하이라이트

### 🎨 **현대적 개발 패턴**
```typescript
// 제네릭 타입으로 타입 안전성 보장
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// 도메인별 Composable 분리
export const useValidation = () => {
  const checkEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email)
  }
  // ...
}

// 다국어 콘텐츠 타입
interface MultilingualContent<T = string> {
  ko: T
  en: T
}
```

### 🔧 **성능 최적화 기법**
- **Lazy Loading**: 컴포넌트 지연 로딩
- **Virtual Scrolling**: 대용량 리스트 최적화
- **Image Optimization**: 자동 WebP 변환
- **Bundle Splitting**: 라우트별 코드 분할

---

## 🌍 다국어 지원

### 🗣️ **지원 언어**
- 🇰🇷 **한국어** (기본)
- 🇺🇸 **English**

### 🔄 **언어 전환**
- 브라우저 언어 설정 기반 자동 감지
- `no_prefix` 전략 사용 (URL에 언어 코드 없음)
- LocalStorage를 통한 사용자 선택 기억

---

## 📱 반응형 디자인

### 📐 **Breakpoints**
```scss
// Tailwind CSS 기반 반응형 설계
sm: 640px    // 모바일
md: 768px    // 태블릿
lg: 1024px   // 데스크톱
xl: 1280px   // 대형 데스크톱
```

### 🎨 **다크/라이트 모드**
- 시스템 테마 자동 감지
- 사용자 선택 저장
- 부드러운 테마 전환 애니메이션

---

## 🔒 보안 & 인증

### 🛡️ **보안 기능**
- **CSP 헤더**: XSS 공격 방지
- **HTTPS 강제**: SSL/TLS 암호화
- **입력 검증**: XSS/SQL Injection 방지
- **Rate Limiting**: API 요청 제한

---

## 📈 SEO & 성능

### 🔍 **SEO 최적화**
- **메타태그**: 동적 메타데이터
- **구조화 데이터**: Schema.org 마크업
- **사이트맵**: 자동 생성
- **RSS 피드**: 블로그 포스트 구독

### 📊 **분석 도구**
- **Vercel Analytics**: 실시간 방문자 분석 (프로덕션 환경)
- **Speed Insights**: 성능 모니터링 및 Core Web Vitals 추적
- **자동 성능 측정**: LCP, FID, CLS 등 실시간 모니터링

### 🔒 **보안 기능**
- **DOMPurify**: XSS 공격 방지를 위한 HTML 정제
- **입력 검증**: Yup 기반 폼 유효성 검사
- **EmailJS**: 클라이언트 측 이메일 전송 (서버 노출 없음)

---

## 📧 연락처

- **이메일**: [contact@dewdew.dev](mailto:yeonju.lee1005@gmail.com)
- **LinkedIn**: [linkedin.com/in/dewdew](https://linkedin.com/in/dewdew)
- **카카오톡**: [오픈 채팅방](https://open.kakao.com/o/subhorMe)

---

## 🎉 감사합니다!

**이 프로젝트가 도움이 되셨다면 ⭐ 스타를 눌러주세요!**

[![GitHub stars](https://img.shields.io/github/stars/dewdew/dewdew_v4?style=social)](https://github.com/dewdew/dewdew_v4/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dewdew/dewdew_v4?style=social)](https://github.com/dewdew/dewdew_v4/network)

---

**Made with ❤️ by [Dewdew](https://www.dewdew.dev)**

*최신 웹 기술로 제작된 포트폴리오 웹사이트*