<script setup lang="ts">
const { idle, reset } = useIdle(60 * 1000)
usePageSeo('index')

definePageMeta({
  layout: 'center',
})

useSchemaFaq({
  mainEntity: [
    {
      name: 'What is Dewdew Dev?',
      acceptedAnswer: {
        text: 'Dewdew Dev is a website of Software Engineer Yeonju Lee. I am interested in frontend development (Nuxt4) and have contributed to the Nuxt4 framework ecosystem.',
      },
    },
    {
      name: 'What made of this website?',
      acceptedAnswer: {
        text: 'This website is made of Nuxt4, Tailwind CSS, and TypeScript. And it is hosted on Vercel.',
      },
    },
    {
      name: 'Who is Yeonju Lee?',
      acceptedAnswer: {
        text: 'Yeonju Lee is a Software Engineer who is interested in frontend development (Nuxt4) and has contributed to the Nuxt4 framework ecosystem.',
      },
    },
  ],
})

watch(idle, (idleValue) => {
  if (idleValue) {
    navigateTo('/ai')
    reset()
  }
})
</script>

<template>
  <div class="w-full h-dvh flex flex-col items-center justify-center gap-y-5">
    <!-- 인트로 문구는 SSR로 바로 그려 FCP·LCP를 앞당기고, 애니메이션만 마운트 후 시작 -->
    <IntroTypeTitle />
    <IntroTransitionMessage />
    <IntroController />
  </div>
</template>
