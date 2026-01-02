<script setup lang="ts">
import { track } from '@vercel/analytics'
import type { ResumeDatabase } from '~/types/supabase-resume'

const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('pageTitle.threejs'),
  meta: [
    { name: 'description', content: t('seoDescription.threejs') },
    { name: 'og:title', content: t('seoTitle.threejs') },
    { name: 'og:description', content: t('seoDescription.threejs') },
    { name: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

definePageMeta({
  layout: 'default',
})

useSchemaFaq({
  mainEntity: [
    {
      name: 'What is Dewdew Three.js?',
      acceptedAnswer: {
        text: 'Dewdew Three.js is a list of WebGL works created with Three.js.',
      },
    },
  ],
})

// API에서 작업물 데이터 가져오기
const { data: threejsData } = await useFetch('/api/resume/threejs', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
  transform: (data: ResumeDatabase['resume']['Tables']['threejs']['Row'][]) => {
    return data
  },
})

const loadingStates = ref<Record<string, boolean>>({})
const hoveredWork = ref<string | null>(null)
const loadTimeouts = ref<Record<string, ReturnType<typeof setTimeout> | undefined>>({})

// 작업물 클릭 핸들러
const handleWorkClick = (work: ResumeDatabase['resume']['Tables']['threejs']['Row']) => {
  track('threejs_work_click', { work: work.title, url: work.url })
  window.open(work.url || '', '_blank', 'noopener,noreferrer')
}

// 타임아웃 클리어 헬퍼
const clearLoadTimeout = (workId: string) => {
  const timeout = loadTimeouts.value[workId]
  if (timeout) {
    clearTimeout(timeout)
    loadTimeouts.value[workId] = undefined
  }
}

// iframe 로드 완료 처리
const completeIframeLoad = (workId: string) => {
  clearLoadTimeout(workId)
  loadingStates.value[workId] = false
}

// 작업물별 타임아웃 설정
const setupLoadTimeout = (workId: string) => {
  const TIMEOUT_DURATION = 10000 // 10초

  loadTimeouts.value[workId] = setTimeout(() => {
    if (loadingStates.value[workId] !== false) {
      console.warn(`Iframe load timeout for ${workId}`)
      completeIframeLoad(workId)
    }
  }, TIMEOUT_DURATION)
}

// 작업물 데이터가 로드되면 초기화
watch(threejsData, (newWorks) => {
  if (newWorks && newWorks.length > 0) {
    newWorks.forEach((work) => {
      if (!loadingStates.value[work.id]) {
        loadingStates.value[work.id] = true
        setupLoadTimeout(work.id)
      }
    })
  }
}, { immediate: true })

// 정리
onUnmounted(() => {
  Object.keys(loadTimeouts.value).forEach((workId) => {
    clearLoadTimeout(workId)
  })
})
</script>

<template>
  <DdPage class="mx-2">
    <div class="w-full flex flex-col gap-y-6 px-4 py-8">
      <h1 class="text-4xl font-bold text-amber-500 break-keep mt-2">
        {{ $t('pageTitle.threejs') }}
      </h1>
      <p>
        {{ $t('seoDescription.threejs') }}
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(work, index) in threejsData"
          :key="index"
          class="group relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
          @click="handleWorkClick(work)"
          @mouseenter="hoveredWork = work.id"
          @mouseleave="hoveredWork = null"
        >
          <!-- Preview Canvas Container -->
          <div class="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            <!-- 로딩 상태 -->
            <div
              v-if="loadingStates[work.id] !== false"
              class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 z-10"
            >
              <Icon
                name="i-svg-spinners-dot-revolve"
                class="w-12 h-12 text-primary-500"
              />
            </div>

            <!-- iframe Preview (Vercel 스타일) -->
            <iframe
              :src="work.url || ''"
              class="absolute inset-0 w-full h-full border-0 transform scale-[0.25] origin-top-left"
              :style="{
                width: '400%',
                height: '400%',
                pointerEvents: hoveredWork === work.id ? 'auto' : 'none',
              }"
              :aria-label="`Preview of ${work.title}`"
              @load="() => completeIframeLoad(work.id)"
              @error="() => completeIframeLoad(work.id)"
            />

            <!-- Visit 버튼 (호버 시 표시) -->
            <DdButton
              class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer"
              color="primary"
              size="xl"
              variant="subtle"
              icon="i-lucide-external-link"
              label="Visit"
              @click="handleWorkClick(work)"
            />
          </div>

          <!-- 작업물 정보 -->
          <div class="flex flex-col gap-y-1 p-4">
            <h3 class="font-bold text-lg break-keep">
              {{ work.title }}
            </h3>
            <p
              v-if="work.description"
              class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 break-keep"
            >
              {{ work.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </DdPage>
</template>
