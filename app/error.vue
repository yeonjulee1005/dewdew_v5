<script setup lang="ts">
const staticTexts = reactive({
  largeText: '404',
  title: 'Not Found!',
  description: '페이지를 찾을 수 없어요!',
  button: 'Home',
})
</script>

<template>
  <div class="w-dvw max-w-[1024px] h-dvh flex flex-col items-center justify-center gap-6">
    <div class="w-4/5 flex flex-col gap-y-1 border-2 px-8 py-6 rounded-lg">
      <div class="text-5xl sm:text-8xl font-bold">
        {{ staticTexts.largeText }}
      </div>
      <p class="text-2xl sm:text-2xl font-bold">
        {{ staticTexts.title }}
      </p>
      <p class="text-md sm:text-lg font-bold">
        {{ staticTexts.description }}
      </p>
      <NuxtLink
        class="flex items-center justify-center w-full mx-auto mt-6 text-xl font-bold border-2 px-4 py-2 hover:border-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900 rounded-lg transition ease-in-out"
        to="/"
      >
        {{ staticTexts.button }}
      </NuxtLink>
    </div>
  </div>
</template>
