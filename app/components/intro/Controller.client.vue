<script setup lang="ts">
import AThemeChange from '../a/ThemeChange.vue'
</script>

<template>
  <div class="flex items-center w-40 gap-6 mt-10">
    <DdButton
      class="text-xl cursor-pointer"
      size="xl"
      block
      variant="subtle"
      :label="$t('button.moveMain')"
      @click="navigateTo('/ai')"
    />
    <AThemeChange custom-class="gap-0" />
  </div>
</template>
