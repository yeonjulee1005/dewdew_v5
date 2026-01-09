<script setup lang="ts">
const { url } = useImageStorage()
const { isDesktop } = useDevice()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)
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
          :src="url(true, '/assets/banner/main_banner_v5.webp')"
          class="w-full h-full object-cover rounded-md max-h-[300px] min-h-[100px]"
          format="webp"
          :quality="60"
          :width="1024"
          :height="270"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1024px"
          loading="lazy"
          :alt="$t('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
          role="img"
          :aria-label="$t('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
        />
        <span
          class="w-fit font-anton text-2xl sm:text-5xl md:text-6xl bg-linear-to-tl from-amber-900 via-amber-400/90 to-orange-700 bg-clip-text text-transparent transform"
          :class="[isDesktop ? 'absolute bottom-20 -left-18 max-w-66 rotate-270' : 'absolute bottom-1 left-1 w-full rotate-0']"
          :aria-label="$t('dynamic.greeting.title', 'SOFTWARE ENGINEER')"
        >
          {{ $t('dynamic.greeting.title') }}
        </span>
      </div>
    </DdCard>
  </div>
</template>
