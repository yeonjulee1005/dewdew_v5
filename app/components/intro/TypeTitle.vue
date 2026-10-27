<script setup lang="ts">
import type TypeIt from 'typeit'

const { locale } = useI18n()
const { introTitleKo, introTitleEn } = useHelloList()

const title = computed(() => locale.value === 'ko' ? introTitleKo : introTitleEn)

const helloIntroTitle = ref<HTMLElement | null>(null)
let typeIt: TypeIt | null = null

// SSR로 첫 문구를 먼저 그려 FCP·LCP를 앞당기고, 마운트 후 해당 문구를 지우며 타이핑 애니메이션 시작
const typeItHello = async () => {
  if (!helloIntroTitle.value) return
  const { default: TypeItClass } = await import('typeit')
  typeIt?.destroy()
  typeIt = new TypeItClass(helloIntroTitle.value, {
    strings: title.value,
    startDelete: true,
    lifeLike: true,
    speed: 50,
    deleteSpeed: 30,
    loop: true,
  }).go()
}

onMounted(() => {
  typeItHello()
})

// 언어 변경 시 h1을 다시 그린 뒤(key) 새 문구로 재시작
watch(locale, () => {
  nextTick(() => {
    typeItHello()
  })
})

onUnmounted(() => {
  typeIt?.destroy()
  typeIt = null
})
</script>

<template>
  <div class="w-dvw lg:w-[780px] h-40 sm:min-h-30 px-6">
    <h1
      :key="locale"
      ref="helloIntroTitle"
      class="text-2xl sm:text-4xl font-bold break-keep py-2"
    >
      {{ title[0] }}
    </h1>
  </div>
</template>
