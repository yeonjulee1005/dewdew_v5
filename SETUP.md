# 🚀 Dewdew Portfolio 설정 가이드

> **Nuxt 4 + Supabase 기반 포트폴리오 프로젝트 설정 가이드**

## 📋 요구사항

- **Node.js**: 24.5.0+ (`.nvmrc` 파일 참조)
- **Bun**: 1.2.0+ (권장 패키지 매니저)
- **Supabase 계정**: 데이터베이스 및 인증용

---

## ⚡ 빠른 시작

### 1️⃣ **기본 설정**

```bash
# Node.js 버전 설정 (nvm 사용 시)
nvm use

# 의존성 설치
bun install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 Supabase 키 등 필수 값 입력
```

### 2️⃣ **개발 서버 실행**

```bash
# 로컬 개발 서버 (포트 4500)
bun dev

# 네트워크 접근 가능한 개발 서버
bun run dev:host
```

🌐 **브라우저에서 http://localhost:4500 접속**

---

## 🔧 주요 명령어

### **개발**
```bash
bun dev                    # 개발 서버 시작
bun run dev:host          # 네트워크 접근 가능한 개발 서버
```

### **빌드 & 배포**
```bash
bun run build             # 프로덕션 빌드
bun run generate          # 정적 사이트 생성 (SSG)
bun run preview           # 빌드 미리보기
bun run analyze           # 번들 사이즈 분석
```

### **코드 품질**
```bash
bun run lint              # ESLint 검사
bun run lint:fix          # ESLint 자동 수정
bun run test              # Vitest 테스트 실행
```

### **유틸리티**
```bash
bun run cleanup           # .nuxt 파일 정리
bun run delete:modules    # node_modules & .nuxt 완전 삭제
bun run upgrade:force     # Nuxt 강제 업그레이드
npx nuxi info            # Nuxt 환경 정보 확인
```

---

## 🗄️ Supabase 설정

### **1. CLI 설치 및 로그인**
```bash
# Supabase CLI 설치
bun add supabase@">=1.8.1" --dev

# Supabase 로그인 (토큰 필요)
bun supabase login
```

💡 **토큰 발급**: [Supabase Dashboard → Account → Access Tokens](https://supabase.com/dashboard/account/tokens)

### **2. TypeScript 타입 생성**
```bash
# 데이터베이스 스키마 타입 생성
bun run supabase:type

# 메뉴 스키마 타입 생성
bun run supabase:type-menu

# 데이터 스키마 타입 생성  
bun run supabase:type-data
```

---

## 🔐 환경 변수 설정

### **필수 환경 변수** (`.env` 파일)
```bash
# Supabase 설정
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 사이트 URL
NUXT_PUBLIC_SITE_URL=http://localhost:4500

# EmailJS (연락 폼용)
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# 공공 API 키 (날씨 정보용)
DATA_PORTAL_API_KEY=your_api_key
```

---

## 🛠️ 문제 해결

### **설치 오류 시**
```bash
# 완전한 재설치
rm -rf node_modules
rm -rf bun.lockb
rm -rf .nuxt
bun pm cache rm
bun install
```

### **빌드 오류 시**
```bash
# Nuxt 캐시 정리
bun run cleanup

# TypeScript 타입 재생성
bun run supabase:type

# 의존성 재설치
bun run delete:modules
bun install
```

### **Node.js 버전 문제**
```bash
# 올바른 Node.js 버전 사용
nvm install 24.5.0
nvm use 24.5.0

# 현재 버전 확인
node --version  # v24.5.0이어야 함
```

---

## 🎯 개발 환경 최적화

### **VS Code 확장 프로그램 권장**
- **Vue Language Features (Volar)**
- **TypeScript Vue Plugin (Volar)**
- **ESLint**
- **Stylelint**
- **Tailwind CSS IntelliSense**

### **Code Server 설정** (선택사항)
```bash
# Code Server 설치
brew install code-server

# 특정 포트로 실행
PORT=3080 code-server
```

---

## 📦 버전 관리

### **패키지 버전 업데이트**
```bash
# 패치 버전 (0.0.x)
npm version patch

# 마이너 버전 (0.x.0)  
npm version minor

# 메이저 버전 (x.0.0)
npm version major
```

### **의존성 업데이트**
```bash
# 의존성 업데이트 확인
bun update --dry-run

# 실제 업데이트 실행
bun update
```

---

## 📊 성능 모니터링

### **개발 중 성능 확인**
```bash
# 번들 분석
bun run analyze

# 빌드 크기 확인
bun run build
```

### **Production 성능 테스트**
```bash
# 프로덕션 빌드 후 미리보기
bun run build
bun run preview

# Lighthouse 점수 확인 (Chrome DevTools)
```

---

## 🐛 디버깅 팁

### **일반적인 문제들**

1. **포트 충돌**: 다른 포트 사용 `PORT=3000 bun dev`
2. **캐시 문제**: `rm -rf .nuxt` 후 재시작
3. **타입 오류**: `bun run supabase:type` 실행
4. **모듈 충돌**: `bun run delete:modules` 후 재설치

### **로그 확인**
```bash
# 상세 로그로 개발 서버 실행
DEBUG=nuxt:* bun dev

# 빌드 상세 로그
NITRO_PRESET=node bun run build
```

---

**🎉 설정 완료! 이제 개발을 시작할 수 있습니다.**

문제가 발생하면 [GitHub Issues](https://github.com/dewdew/dewdew_v4/issues)에서 확인하거나 문의해주세요.