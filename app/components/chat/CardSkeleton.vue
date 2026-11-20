<script setup lang="ts">
// 다이나믹 카드 로딩 스켈레톤 — DynamicComponent 의 <Suspense #fallback> 으로 표시
// size: 실제 카드 높이에 맞춰 레이아웃 점프를 줄인다 (sm: 그리팅·링크, md: 일반 카드, lg: 캐러셀·프로필)
// translating: 한국어 외 언어 → 최초 1회 번역이 수 초 걸릴 수 있어 안내 문구 표시
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    translating?: boolean
  }>(),
  {
    size: 'md',
    translating: false,
  },
)
</script>

<template>
  <DdCard
    :ui="{ body: 'p-2.5 sm:p-4' }"
    role="status"
    aria-busy="true"
    :aria-label="$t('ai.cardLoading')"
  >
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center justify-between gap-x-3">
        <DdSkeleton class="h-6 w-32" />
        <span class="flex items-center gap-x-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <DdIcon
            :name="translating ? 'i-lucide-languages' : 'i-lucide-loader-circle'"
            class="size-3.5"
            :class="{ 'animate-spin': !translating, 'animate-pulse': translating }"
          />
          {{ translating ? $t('ai.cardTranslating') : $t('ai.cardLoading') }}
        </span>
      </div>

      <div
        v-if="size === 'sm'"
        class="flex flex-wrap gap-2"
      >
        <DdSkeleton
          v-for="index in 4"
          :key="index"
          class="h-9 w-24 rounded-md"
        />
      </div>

      <div
        v-else
        class="flex flex-col gap-y-3 rounded-md border border-neutral-200 dark:border-neutral-700 p-3"
        :class="size === 'lg' ? 'h-[300px]' : 'h-[180px]'"
      >
        <div class="flex items-center gap-x-3">
          <DdSkeleton class="size-10 rounded-md shrink-0" />
          <div class="flex flex-col gap-y-2 flex-1">
            <DdSkeleton class="h-5 w-1/2" />
            <DdSkeleton class="h-4 w-1/3" />
          </div>
        </div>
        <DdSkeleton class="h-px w-full" />
        <DdSkeleton class="h-4 w-full" />
        <DdSkeleton class="h-4 w-11/12" />
        <DdSkeleton class="h-4 w-4/5" />
        <template v-if="size === 'lg'">
          <DdSkeleton class="h-4 w-full" />
          <DdSkeleton class="h-4 w-3/4" />
          <DdSkeleton class="h-4 w-5/6" />
        </template>
      </div>
    </div>
  </DdCard>
</template>
