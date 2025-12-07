<script setup lang="ts">
import AFooterMenu from './Menu.vue'
import AFooterSns from './Sns.server.vue'
import AFooterInformation from './Information.server.vue'

const { isMobile } = useDevice()

const colorMode = useColorMode()
const { t } = useI18n()

const accordionItems = [
  {
    label: t('texts.designed'),
  },
]
</script>

<template>
  <footer
    class="w-full h-fit flex flex-col gap-y-2 items-center justify-center mb-4"
    :class="[isMobile ? 'absolute bottom-0 mt-2 px-4' : 'mt-6 px-4']"
  >
    <DdAccordion
      v-if="isMobile"
      :items="accordionItems"
      type="single"
      trailing-icon="i-lucide-chevron-up"
      class="accordion-reverse"
      :ui="{
        root: 'w-full',
        item: 'border-none',
        trigger: 'justify-center',
        body: 'flex flex-col gap-y-2 items-center w-full',
      }"
    >
      <template #content>
        <div class="flex flex-col gap-y-4 bg-white dark:bg-neutral-900">
          <AFooterMenu />
          <AFooterSns />
          <AFooterInformation />
        </div>
      </template>
    </DdAccordion>

    <template v-else>
      <div :class="colorMode.value === 'dark' ? 'footer-dark-zigzag' : 'footer-zigzag'" />
      <AFooterMenu />
      <AFooterSns />
      <AFooterInformation />
    </template>
  </footer>
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

// 아코디언이 위쪽으로 펼쳐지도록
:deep(.accordion-reverse) {
  // 아이템 컨테이너를 역순으로 배치
  > div {
    display: flex;
    flex-direction: column-reverse;
  }

  // header와 content의 순서를 바꿈
  [data-header],
  [data-radix-accordion-header],
  button[data-state] {
    order: 2;
  }

  [data-content],
  [data-radix-accordion-content],
  div[data-state] {
    order: 1;
  }
}
</style>
