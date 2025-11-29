<script setup lang="ts">
import IntroTypeTitleClient from './TypeTitle.client.vue'

const { locale } = useI18n()
const { introTitleKo, introTitleEn } = useHelloList()

const title = computed(() => locale.value === 'ko' ? introTitleKo : introTitleEn)
</script>

<template>
  <div class="w-dvw lg:w-[780px] h-40 sm:min-h-30 px-6">
    <IntroTypeTitleClient :title="title" />
  </div>
</template>
