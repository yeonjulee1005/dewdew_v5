<script setup lang="ts">
import { track } from '@vercel/analytics'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

const { data: threejsData } = await useFetch('/api/resume/threejs', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const loadingStates = ref<Record<string, boolean>>({})
const hoveredWork = ref<string | null>(null)
const loadTimeouts = ref<Record<string, ReturnType<typeof setTimeout> | undefined>>({})

// 작업물 고유 키 생성 (order_index와 title 조합)
const getWorkKey = (work: { order_index: number | null, title: string }) => {
  return `threejs-${work.order_index ?? 'null'}-${work.title}`
}

// 작업물 클릭 핸들러
const handleWorkClick = (work: { url: string | null, title: string }) => {
  if (!work.url) return
  track('threejs_work_click', { work: work.title, url: work.url })
  window.open(work.url, '_blank', 'noopener,noreferrer')
}

// 타임아웃 클리어 헬퍼
const clearLoadTimeout = (workKey: string) => {
  const timeout = loadTimeouts.value[workKey]
  if (timeout) {
    clearTimeout(timeout)
    loadTimeouts.value[workKey] = undefined
  }
}

// iframe 로드 완료 처리
const completeIframeLoad = (workKey: string) => {
  clearLoadTimeout(workKey)
  loadingStates.value[workKey] = false
}

// 작업물별 타임아웃 설정
const setupLoadTimeout = (workKey: string) => {
  const TIMEOUT_DURATION = 10000 // 10초

  loadTimeouts.value[workKey] = setTimeout(() => {
    if (loadingStates.value[workKey] !== false) {
      console.warn(`Iframe load timeout for ${workKey}`)
      completeIframeLoad(workKey)
    }
  }, TIMEOUT_DURATION)
}

// 작업물 데이터가 로드되면 초기화
watch(threejsData, (newWorks) => {
  if (newWorks && newWorks.length > 0) {
    newWorks.forEach((work) => {
      const workKey = getWorkKey(work)
      if (!loadingStates.value[workKey]) {
        loadingStates.value[workKey] = true
        setupLoadTimeout(workKey)
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
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.threejs.title', 'Three.js 작업물') }}
        </h3>

        <div
          v-if="threejsData && threejsData.length > 0"
          class="w-full"
        >
          <DdCarousel
            v-slot="{ item: work }"
            :items="threejsData"
            arrows
            loop
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 -translate-y-1/4 w-20 h-10', prev: '!left-0', next: '!right-0' }"
            :aria-label="$t('dynamic.threejs.carousel', 'Three.js 작업물 캐러셀')"
          >
            <div class="flex flex-col gap-y-4 p-3 rounded-md border border-neutral-200 dark:border-neutral-700">
              <!-- Preview Canvas Container -->
              <div
                class="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 group cursor-pointer"
                @click="handleWorkClick(work)"
                @mouseenter="hoveredWork = getWorkKey(work)"
                @mouseleave="hoveredWork = null"
              >
                <!-- 로딩 상태 -->
                <div
                  v-if="loadingStates[getWorkKey(work)] !== false"
                  class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 z-10"
                >
                  <Icon
                    name="i-svg-spinners-dot-revolve"
                    class="w-12 h-12 text-primary-500"
                  />
                </div>

                <!-- iframe Preview (Vercel 스타일) -->
                <iframe
                  v-if="work.url"
                  :src="work.url"
                  class="absolute inset-0 w-full h-full border-0 transform scale-[0.25] origin-top-left"
                  :style="{
                    width: '400%',
                    height: '400%',
                    pointerEvents: hoveredWork === getWorkKey(work) ? 'auto' : 'none',
                  }"
                  :aria-label="`Preview of ${work.title}`"
                  @load="() => completeIframeLoad(getWorkKey(work))"
                  @error="() => completeIframeLoad(getWorkKey(work))"
                />

                <!-- Visit 버튼 (호버 시 표시) -->
                <DdButton
                  v-if="work.url"
                  class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30 cursor-pointer"
                  color="primary"
                  size="xl"
                  variant="subtle"
                  icon="i-lucide-external-link"
                  label="Visit"
                  @click.stop="handleWorkClick(work)"
                />
              </div>

              <!-- 작업물 정보 -->
              <div class="flex flex-col gap-y-1">
                <h4 class="font-bold text-xl break-keep">
                  {{ work.title }}
                </h4>
                <p
                  v-if="work.description"
                  class="text-md text-neutral-600 dark:text-neutral-400 line-clamp-3 break-keep"
                >
                  {{ work.description }}
                </p>
              </div>
            </div>
          </DdCarousel>
        </div>

        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.threejs.empty', 'Three.js 작업물 정보가 없습니다.') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
