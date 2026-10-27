<script setup lang="ts">
usePageSeo('ai')

definePageMeta({
  layout: 'default',
})

// LCP 이미지(인사 카드 배너)는 채팅 응답 이후 렌더링되어 늦게 발견되므로 미리 요청
// (Greeting.server.vue의 NuxtImg 옵션과 동일해야 같은 URL로 캐시 재사용)
const img = useImage()
// getSizes 옵션 타입이 기본 provider(ipx)로 고정되어 있어 단언 처리
const banner = img.getSizes('/assets/banner/main_banner_v5.webp', {
  provider: 'supabase',
  sizes: '100vw lg:1024px',
  modifiers: { width: 1024, height: 270, format: 'webp', quality: 60 },
} as unknown as Parameters<typeof img.getSizes>[1])

useHead({
  link: [{
    rel: 'preload',
    as: 'image',
    href: banner.src,
    imagesrcset: banner.srcset,
    imagesizes: banner.sizes,
    fetchpriority: 'high',
  }],
})

useSchemaFaq({
  mainEntity: [
    {
      name: 'What is Dewdew AI?',
      acceptedAnswer: {
        text: 'Dewdew AI is a chatbot that answers questions about her resume data.',
      },
    },
    {
      name: 'How to make Dewdew AI?',
      acceptedAnswer: {
        text: 'Dewdew AI is made of Nuxt4, Tailwind CSS, and TypeScript. And it is hosted on Vercel. And it is powered by OpenAI API. With RAG and Embedding Vector Search.',
      },
    },
  ],
})
</script>

<template>
  <div class="h-fit bg-white dark:bg-neutral-900">
    <h1 class="sr-only">
      {{ $t('pageTitle.ai') }}
    </h1>
    <ChatContainer />
  </div>
</template>
