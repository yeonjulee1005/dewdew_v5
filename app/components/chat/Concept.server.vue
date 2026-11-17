<script setup lang="ts">
// 아키텍처 다이어그램은 ChatArchitectureDiagram(SVG 원본)을 locale × 테마별 webp로 렌더링한 이미지다.
// 모바일에서도 탭 → 원본 크기로 열어 확대할 수 있도록 이미지 + 링크로 노출한다.
// 다이어그램 수정 시: ArchitectureDiagram.vue 수정 → 페이지에 임시 마운트 후 1200px 폭 × 2배율로 재렌더링
//   → public/image/concept/architecture-{ko,en}-{light,dark}.webp 교체
const { locale, t } = useI18n()

const diagramLocale = computed(() => (locale.value === 'en' ? 'en' : 'ko'))
const diagramImages = computed(() => [
  { theme: 'light', class: 'block dark:hidden' },
  { theme: 'dark', class: 'hidden dark:block' },
].map(image => ({
  ...image,
  src: `/image/concept/architecture-${diagramLocale.value}-${image.theme}.webp`,
})))
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-5xl mx-auto">
    <h3 class="text-2xl font-bold break-keep">
      {{ $t('aiComponents.concept.title') }}
    </h3>
    <figure class="w-full">
      <a
        v-for="image in diagramImages"
        :key="image.theme"
        :href="image.src"
        target="_blank"
        rel="noopener"
        :class="image.class"
        :aria-label="t('aiComponents.concept.diagram.openFull')"
      >
        <img
          :src="image.src"
          :alt="t('aiComponents.concept.title')"
          width="2400"
          height="1500"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="w-full h-auto rounded-md border border-neutral-200 dark:border-neutral-800"
        >
      </a>
      <figcaption class="mt-2 text-sm text-neutral-500 dark:text-neutral-400 break-keep">
        {{ t('aiComponents.concept.diagram.caption') }}
        <span class="block mt-0.5">{{ t('aiComponents.concept.diagram.openFull') }}</span>
      </figcaption>
    </figure>
    <div class="space-y-1.5">
      <p
        v-for="item in $tm('aiComponents.concept.description')"
        :key="item"
        class="text-lg text-neutral-500 dark:text-neutral-400 break-keep"
      >
        {{ $rt(item) }}
      </p>
    </div>
  </div>
</template>
