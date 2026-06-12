---
name: test-writer
description: Vitest 기반 단위 테스트 자동 작성·실행. "테스트 작성", "test 추가", "테스트 코드 만들어줘", "spec 파일 만들어줘", "write tests", "add test coverage" 요청 시 사용.
---

# Test Writer

Nuxt 4 + Vue 3 + Vitest + `@vue/test-utils` + bun 프로젝트용 테스트 코드를 자동으로 작성·실행한다. describe/it는 한국어, Given-When-Then 구조로 작성하고 `bun run test`로 검증한다.

## Workflow

1. 대상 소스 파일과 의존성(imports, composable, Pinia store) 읽기
2. `.claude/rules/` 확인 (한국어 작성·`test:` 커밋 컨벤션)
3. 같은 디렉터리 또는 프로젝트 내 `*.test.ts` / `*.spec.ts` 패턴 참고
4. 테스트 파일 작성
5. `bun run test <test-file-path>` 실행
6. 실패 시 수정 → 재실행. 모두 그린이 될 때까지 반복

## Test File Rules

- **위치**: 소스 파일과 같은 디렉터리. `<source>.test.ts` 또는 `<source>.spec.ts`
- **언어**: `describe` / `it` 본문은 **한국어**, 함수·식별자는 영어
- **구조**: `// Given`, `// When`, `// Then` 주석
- **커버 범위**: Happy path + 에러/예외 + 엣지

```typescript
import { describe, it, expect } from 'vitest'

describe('함수/컴포넌트 이름', () => {
  it('정상 입력 시 기대값을 반환해야 한다', () => {
    // Given
    const input = 'hello'

    // When
    const result = stringify(input)

    // Then
    expect(result).toBe('hello')
  })
})
```

## Nuxt 4 Mock Patterns

### Composable / Nuxt auto-import

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useRoute', () => () => ({ path: '/', fullPath: '/' }))
mockNuxtImport('useI18n', () => () => ({ t: (key: string) => key }))
```

### Vue 컴포넌트

```typescript
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

describe('Component', () => {
  it('렌더링되어야 한다', () => {
    const wrapper = mount(Component, { props: { title: 'test' } })
    expect(wrapper.text()).toContain('test')
  })
})
```

### Pinia store

```typescript
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '~/stores/index'

beforeEach(() => {
  setActivePinia(createPinia())
})
```

### 자주 모킹하는 대상

- `useRoute`, `useRouter`, `useHead`, `useSeoMeta`
- `useI18n`, `$t` / `$tm`
- `@nuxtjs/device` (`useDevice`)
- `#imports` auto-import composable

## Test Categories

1. **순수 유틸/composable** — `app/composables/**` 입출력 검증
2. **Vue 컴포넌트** — `mount` + `screen` / wrapper assertions
3. **Pinia store** — action/state mutation 검증
4. **Nitro API** — `server/api/**` (필요 시 `$fetch` mock)

## What NOT to Test

- i18n JSON locale 파일 자체
- 단순 re-export, 타입 정의만 있는 파일
- `nuxt.config.ts`, `app.config.ts` 설정 객체

## 실행

```bash
bun run test <test-file-path>
```

- 같은 종류 실패 3회 반복 시 사용자에게 보고
