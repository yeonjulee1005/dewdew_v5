<script setup lang="ts">
// i18n이 초기화되지 않았을 수 있으므로 안전하게 처리
let errorTitle = '404'
let errorDescription = '페이지를 찾을 수 없습니다!'
let errorButton = '홈으로 이동'

try {
  const { t } = useI18n()
  errorTitle = t('error.title')
  errorDescription = t('error.description')
  errorButton = t('error.button')
}
catch {
  // i18n이 초기화되지 않은 경우 기본값 사용
}
</script>

<template>
  <div class="w-dvw max-w-[1024px] h-dvh flex flex-col items-center justify-center gap-6">
    <div class="w-4/5 flex flex-col gap-y-1 border-2 px-8 py-6 rounded-lg">
      <div class="text-5xl sm:text-8xl font-bold">
        {{ errorTitle }}
      </div>
      <p class="text-md sm:text-lg font-bold">
        {{ errorDescription }}
      </p>
      <NuxtLink
        class="flex items-center justify-center w-full mx-auto mt-6 text-xl font-bold border-2 px-4 py-2 hover:border-neutral-300 hover:bg-neutral-200/50 hover:text-neutral-900 rounded-lg transition ease-in-out"
        to="/"
      >
        {{ errorButton }}
      </NuxtLink>
    </div>
  </div>
</template>
