<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="w-dvw max-w-[1024px] h-dvh flex flex-col items-center justify-center gap-6">
    <div class="w-4/5 flex flex-col gap-y-1 border-2 px-8 py-6 rounded-lg">
      <div class="text-5xl sm:text-8xl font-bold">
        {{ t('error.title') }}
      </div>
      <p class="text-md sm:text-lg font-bold">
        {{ t('error.description') }}
      </p>
      <NuxtLink
        class="flex items-center justify-center w-full mx-auto mt-6 text-xl font-bold border-2 px-4 py-2 hover:border-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900 rounded-lg transition ease-in-out"
        to="/"
      >
        {{ t('error.button') }}
      </NuxtLink>
    </div>
  </div>
</template>
