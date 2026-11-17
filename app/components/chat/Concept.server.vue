<template>
  <div class="flex flex-col gap-y-4 max-w-5xl mx-auto">
    <h3 class="text-2xl font-bold break-keep">
      {{ $t('aiComponents.concept.title') }}
    </h3>
    <!-- 아키텍처 다이어그램 (인라인 SVG, 라이트/다크 테마 대응) -->
    <ChatArchitectureDiagram />
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
