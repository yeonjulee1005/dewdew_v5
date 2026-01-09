<script setup lang="ts">
import { track } from '@vercel/analytics/server'

const { isMobile } = useDevice()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

const { data: socialLinksData } = await useFetch('/api/resume/socialLinks', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const clickSocialLink = (url: string) => {
  track('social_link_click', { social: url })
  navigateTo(url, { external: true, open: { target: '_blank' } })
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.social.title') }}
        </h3>
        <DdPageGrid
          v-if="socialLinksData && socialLinksData.length > 0"
          :ui="{ base: `relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isMobile ? 'justify-start' : 'justify-center'}` }"
        >
          <DdPageCard
            v-for="(link, index) in socialLinksData"
            :key="index"
            :title="link.platform"
            :icon="link.icon_url ?? `i-logos-${link.platform.toLowerCase()}-icon`"
            :to="link.url"
            target="_blank"
            variant="outline"
            :ui="{
              leadingIcon: 'w-8 h-8 text-blue-500 dark:text-blue-400',
              title: 'text-lg font-semibold',
            }"
            @click="clickSocialLink(link.url)"
          />
        </DdPageGrid>
        <div
          v-else
          class="text-md text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.social.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
