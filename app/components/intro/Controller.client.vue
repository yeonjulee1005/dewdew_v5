<script setup lang="ts">
import { track } from '@vercel/analytics'
import AThemeChange from '../a/ThemeChange.client.vue'

const moveToMain = () => {
  track('move_to_main', { path: '/ai' })
  navigateTo('/ai')
}
</script>

<template>
  <div class="flex items-center w-40 gap-6 mt-10">
    <DdButton
      class="text-xl cursor-pointer"
      size="xl"
      block
      variant="subtle"
      :label="$t('button.moveMain')"
      @click="moveToMain"
    />
    <AThemeChange custom-class="gap-0" />
  </div>
</template>
