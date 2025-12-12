<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('pageTitle.ai'),
  meta: [
    { name: 'description', content: t('seoDescription.ai') },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="h-fit bg-white dark:bg-neutral-900">
    <ChatContainer />
  </div>
</template>
