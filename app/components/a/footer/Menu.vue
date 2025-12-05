<script setup lang="ts">
const { externalMenu } = storeToRefs(useMenuStore())
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-x-4">
    <ATooltipButton
      v-for="(menu, index) in externalMenu"
      :key="index"
      use-leading
      :icon-lead-name="menu.icon ?? ''"
      icon-lead-class="w-6 h-6"
      button-size="lg"
      button-variant="ghost"
      button-color="neutral"
      :tooltip-text="$t(`menu.${menu.code}`)"
      :button-text="$t(`menu.${menu.code}`)"
      @click:button="navigateTo(menu.url ?? '')"
    />
  </div>
</template>
