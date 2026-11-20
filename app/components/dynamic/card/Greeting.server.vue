<script setup lang="ts">
const { isDesktop } = useDevice()

const props = withDefaults(
  defineProps<{
    title?: string
    // AI 응답 언어 (ISO 639-1). 없으면 사이트 locale
    lang?: string
  }>(),
  {
    title: '',
  },
)

const { ct } = await useContentLocale(() => props.lang)
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h2
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h2>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="relative w-full flex flex-col gap-y-2">
        <NuxtImg
          provider="supabase"
          src="/assets/banner/main_banner_v5.webp"
          class="w-full h-full object-cover rounded-md max-h-[300px] min-h-[100px]"
          format="webp"
          :quality="60"
          :width="1024"
          :height="270"
          sizes="100vw lg:1024px"
          loading="eager"
          fetchpriority="high"
          :alt="ct('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
          role="img"
          :aria-label="ct('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
        />
        <span
          class="w-fit font-anton text-2xl sm:text-5xl md:text-6xl bg-linear-to-tl from-amber-900 via-amber-400/90 to-orange-700 bg-clip-text text-transparent transform"
          :class="[isDesktop ? 'absolute bottom-20 -left-18 max-w-66 rotate-270' : 'absolute bottom-1 left-1 w-full rotate-0']"
          :aria-label="ct('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
        >
          {{ ct('dynamic.greeting.title') }}
        </span>
      </div>
    </DdCard>
  </div>
</template>
