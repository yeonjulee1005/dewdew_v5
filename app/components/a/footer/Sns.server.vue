<script setup lang="ts">
import { track } from '@vercel/analytics/server'

const { url } = useImageStorage()

const { data: externalMenu } = await useFetch('/api/menu/externalMenu', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const handleClick = (url: string) => {
  track('sns_click', { sns: url })
  navigateTo(url, { external: true, open: { target: '_blank' } })
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-x-4">
    <ATooltipButton
      v-for="(menu, index) in externalMenu"
      :key="index"
      use-leading
      :use-icon="menu.icon ? true : false"
      :use-image="menu.image_url ? true : false"
      :icon-lead-name="menu.icon ?? ''"
      :image-url="menu.image_url ? url(true, menu.image_url) : ''"
      :image-size="20"
      button-variant="outline"
      button-color="neutral"
      :tooltip-text="$t(`externalMenu.${menu.code}`)"
      @click:button="handleClick(menu.url ?? '')"
    />
  </div>
</template>
