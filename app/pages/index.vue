<script setup lang="ts">
import IntroTypeTitle from '../components/intro/TypeTitle.server.vue'
import IntroTransitionMessage from '../components/intro/TransitionMessage.server.vue'
import IntroController from '../components/intro/Controller.client.vue'

const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('seoTitle.intro'),
  meta: [
    { name: 'description', content: t('seoDescription.intro') },
    { name: 'og:title', content: t('seoTitle.intro') },
    { name: 'og:description', content: t('seoDescription.intro') },
    { name: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

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

let redirectTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  redirectTimer = setTimeout(() => {
    navigateTo('/ai')
  }, 20000)
})

onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
  }
})
</script>

<template>
  <div class="w-full h-dvh flex flex-col items-center justify-center gap-y-5">
    <Suspense>
      <IntroTypeTitle />
      <template #fallback>
        <div class="w-dvw sm:w-[600px] h-40 sm:min-h-30 flex items-center gap-x-2 animate-pulse px-6">
          <Icon
            name="i-svg-spinners-pulse-rings-2"
            class="w-8 h-8"
          />
          <span class="text-2xl sm:text-4xl font-bold break-keep py-2">
            로딩중...
          </span>
        </div>
      </template>
    </Suspense>
    <Suspense>
      <IntroTransitionMessage />
      <template #fallback>
        <div class="w-dvw sm:w-[600px] h-40 sm:min-h-30 flex items-center gap-x-2 animate-pulse px-6">
          <Icon
            name="i-svg-spinners-pulse-rings-2"
            class="w-12 h-12"
          />
          <span class="text-6xl sm:text-8xl font-black break-keep py-2">
            로딩중...
          </span>
        </div>
      </template>
    </Suspense>
    <Suspense>
      <IntroController />
      <template #fallback>
        <div class="flex items-center gap-6 mt-10 animate-pulse">
          <div class="w-32 h-12 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div class="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
      </template>
    </Suspense>
  </div>
</template>
