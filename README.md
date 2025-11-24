![Dewdew](./.github/assets/dewdew.jpg)

# 🚀 Dewdew Portfolio

> **Software Engineer 이연주의 개인 포트폴리오 웹사이트**  
> 현대적인 웹 기술과 사용자 경험을 중시한 풀스택 개발자의 작품집

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.0.3-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.5.19-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)

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

- **🎨 Framework**: Nuxt 4 (Vue 3 + SSR/SSG)
- **📝 Language**: TypeScript 5.9
- **🎭 Styling**: Sass + Tailwind CSS + Nuxt UI
- **⚡ Build Tool**: Vite 7

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
dewdew_v4/
├── 📱 app/                    # Nuxt 4 앱 디렉토리
│   ├── 🧩 components/         # Vue 컴포넌트 (Atomic Design)
│   │   ├── a/                 # Atomic 컴포넌트
│   │   ├── header/            # 헤더 관련 컴포넌트
│   │   ├── main/              # 메인 페이지 컴포넌트
│   │   └── modal/             # 모달 컴포넌트
│   ├── 🔧 composables/        # Vue Composables (도메인별 분리)
│   │   ├── data/              # 데이터 관련
│   │   ├── formatting/        # 포맷팅 유틸
│   │   ├── ui/                # UI 유틸리티
│   │   └── validation/        # 유효성 검사
│   ├── 📄 pages/              # 파일 기반 라우팅
│   ├── 🎨 layouts/            # 레이아웃 컴포넌트
│   ├── 📝 types/              # TypeScript 타입 정의 (도메인별)
│   └── 🔌 plugins/            # Nuxt 플러그인
├── 📚 content/                # Nuxt Content (마크다운 블로그)
├── 🌐 server/api/             # 서버 API 엔드포인트
├── 🏪 stores/                 # Pinia 상태 관리
├── 🌍 i18n/locales/           # 다국어 번역 파일
└── 📋 .claude/                # AI 개발 가이드라인
```

### 🧩 Composable 아키텍처
```typescript
// 도메인별로 분리된 Composable 구조
app/composables/
├── data/
│   ├── imageStorage.ts        # 이미지 저장소 관리
│   └── weatherMapData.ts      # 날씨 데이터 처리
├── formatting/
│   ├── useFormatter.ts        # 데이터 포맷팅
│   └── useDateFormatter.ts    # 날짜/시간 포맷팅
├── ui/
│   ├── useColorUtils.ts       # 색상 매핑 유틸
│   └── useUiUtils.ts          # UI 헬퍼 함수
└── validation/
    └── useValidation.ts       # 입력 유효성 검사
```

### 📋 타입 시스템
```typescript
// 도메인 주도 설계(DDD) 적용
app/types/
├── weather.d.ts               # 날씨 관련 타입
├── portfolio.d.ts             # 포트폴리오 타입
├── ui.d.ts                    # UI 공통 타입
├── utils.d.ts                 # 제네릭 유틸리티 타입
└── global.d.ts                # 글로벌 타입 선언
```

---

## 🌟 주요 기능

### 🏠 **메인 페이지**
- **실시간 날씨**: 사용자 위치 기반 날씨 정보 표시
- **타이핑 애니메이션**: TypeIt으로 동적 텍스트 효과
- **반응형 레이아웃**: 데스크톱/모바일 최적화

### 🎨 **프로젝트 섹션**
- **Color Translate**: 실시간 색상 변환 도구
- **EyeDropper API**: 브라우저 네이티브 색상 선택
- **클립보드 연동**: 원클릭 색상 복사

### 💼 **포트폴리오**
- **동적 썸네일**: 자동 이미지 최적화
- **다국어 설명**: 한/영 자동 전환
- **필터링**: 기술별 프로젝트 분류

### 📝 **블로그**
- **Nuxt Content**: 마크다운 기반 CMS
- **문법 강조**: Shiki 코드 하이라이팅
- **댓글 시스템**: Supabase 기반 실시간 댓글
- **좋아요 기능**: 실시간 반응 시스템

### 📸 **아카이브**
- **사진 갤러리**: Masonry 레이아웃
- **무한 스크롤**: 성능 최적화된 이미지 로딩
- **메타데이터**: EXIF 정보 표시

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
git clone https://github.com/dewdew/dewdew_v4.git
cd dewdew_v4

# Node.js 버전 설정
nvm use

# 의존성 설치
bun install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행
bun dev
```

🌐 **브라우저에서 http://localhost:4500 접속**

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
- **업그레이드**: Nuxt 3 → Nuxt 4.0.3
- **개선**: i18n v10, Node.js 24.5 지원
- **최적화**: 빌드 성능 20% 향상

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

### 🔄 **자동 언어 감지**
- 브라우저 언어 설정 기반 자동 감지
- URL 기반 언어 라우팅 (`/en/about`)
- 쿠키를 통한 사용자 선택 기억

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
- **Vercel Analytics**: 실시간 방문자 분석
- **Speed Insights**: 성능 모니터링
- **Core Web Vitals**: 사용자 경험 지표

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