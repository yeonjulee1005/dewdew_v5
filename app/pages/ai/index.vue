<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('pageTitle.ai'),
  meta: [
    { name: 'description', content: t('seoDescription.ai') },
    { name: 'og:title', content: t('seoTitle.ai') },
    { name: 'og:description', content: t('seoDescription.ai') },
    { name: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

definePageMeta({
  layout: 'default',
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
    <ChatContainer />
  </div>
</template>
