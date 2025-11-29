<script setup lang="ts">
import AFooterSns from './Sns.server.vue'
import AFooterInformation from './Information.server.vue'

const colorMode = useColorMode()
</script>

<template>
  <div class="w-full h-fit flex flex-col gap-y-2 items-center justify-center mt-10 mb-4">
    <div :class="colorMode.value === 'dark' ? 'footer-dark-zigzag' : 'footer-zigzag'" />
    <AFooterMenu />
    <AFooterSns />
    <AFooterInformation />
  </div>
</template>

<style lang="scss" scoped>
.footer-zigzag {
  height: 20px;
  width: 100%;
  border: none;
  background-image: var(--zigzag-footer-pattern);
  background-repeat: repeat-x;
}
.footer-dark-zigzag {
  height: 20px;
  width: 100%;
  border: none;
  background-image: var(--zigzag-footer-dark-pattern);
  background-repeat: repeat-x;
}
</style>
