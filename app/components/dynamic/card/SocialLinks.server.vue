<script setup lang="ts">
import { track } from '@vercel/analytics/server'

const { isMobile } = useDevice()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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
        <div
          v-if="socialLinksData && socialLinksData.length > 0"
          class="flex flex-wrap gap-4"
          :class="isMobile ? 'justify-start' : 'justify-center'"
        >
          <ATooltipButton
            v-for="(link, index) in socialLinksData"
            :key="index"
            use-leading
            use-icon
            :icon-lead-name="link.icon_url ?? `i-logos-${link.platform.toLowerCase()}-icon`"
            icon-lead-class="w-8 h-8 text-primary-500 dark:text-primary-400"
            :button-text="link.platform"
            :button-url="link.url"
            button-variant="outline"
            button-color="primary"
            button-size="xl"
            custom-class="cursor-pointer"
            @click:button="clickSocialLink(link.url)"
          />
        </div>
        <div
          v-else
          class="text-md text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.social.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
