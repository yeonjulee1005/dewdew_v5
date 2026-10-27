<script setup lang="ts">
/**
 * 블로그 본문 이미지 (Nuxt UI ProseImg 대체)
 * - Supabase Storage 이미지는 원본(수 MB) 대신 표시 크기에 맞춘 변환 이미지(webp)를 받음
 * - 확대 보기는 클릭 시에만 모달을 불러와 motion-v 등 애니메이션 번들을 초기 로딩에서 제외
 * - 마크다운에서 {loading="eager" fetchpriority="high"} 로 LCP 이미지 우선 로딩 지정
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: string | number
    height?: string | number
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
  }>(),
  {
    alt: '',
    width: undefined,
    height: undefined,
    loading: 'lazy',
    fetchpriority: 'auto',
  },
)

const { toStoragePath } = useImageStorage()

const storagePath = computed(() => toStoragePath(props.src))
const displayHeight = computed(() => (props.height ? Number(props.height) : undefined))
// 블로그 본문 CSS(height: auto)로 로딩 전 높이가 0이 되어 생기는 레이아웃 이동(CLS) 방지
const sizeStyle = computed(() => (displayHeight.value ? { height: `${displayHeight.value}px` } : undefined))

// 확대 모달은 첫 클릭 이후에만 렌더링 (Lazy 컴포넌트 청크 지연 로딩)
const isZoomLoaded = ref(false)
const isZoomed = ref(false)

const openZoom = () => {
  isZoomLoaded.value = true
  isZoomed.value = true
}
</script>

<template>
  <NuxtImg
    v-if="storagePath"
    provider="supabase"
    :src="storagePath"
    :alt="alt"
    :width="width"
    :height="displayHeight"
    :sizes="displayHeight ? undefined : '100vw md:768px'"
    :densities="displayHeight ? 'x1 x2' : undefined"
    format="webp"
    :quality="65"
    :loading="loading"
    :fetchpriority="fetchpriority"
    v-bind="$attrs"
    class="cursor-zoom-in rounded-md"
    :style="sizeStyle"
    @click="openZoom"
  />
  <img
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    v-bind="$attrs"
    class="cursor-zoom-in rounded-md"
    :style="sizeStyle"
    @click="openZoom"
  >
  <LazyDdModal
    v-if="isZoomLoaded"
    v-model:open="isZoomed"
    :title="alt"
    :ui="{ content: 'max-w-5xl' }"
  >
    <template #body>
      <NuxtImg
        v-if="storagePath"
        provider="supabase"
        :src="storagePath"
        :alt="alt"
        sizes="100vw lg:1024px"
        format="webp"
        :quality="85"
        class="w-full h-auto rounded-md cursor-zoom-out"
        @click="isZoomed = false"
      />
      <img
        v-else
        :src="src"
        :alt="alt"
        class="w-full h-auto rounded-md cursor-zoom-out"
        @click="isZoomed = false"
      >
    </template>
  </LazyDdModal>
</template>
