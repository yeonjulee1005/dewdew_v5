<script setup lang="ts">
const { path } = useRoute()
const { isDesktopOrTablet, isMobileOrTablet } = useDevice()
const { url } = useImageStorage()
const { t } = useI18n()

const slideoverTrigger = ref(false)

const handlePagination = (path: string, external: boolean = false) => {
  external
    ? navigateTo(path, { external: true, open: { target: '_blank' } })
    : navigateTo(path)

  slideoverTrigger.value = false
}
</script>

<template>
  <div
    class="w-dvw xl:w-[1024px]"
    :class="path === '/ai' ? 'h-screen' : 'h-full'"
  >
    <header class="h-20 flex items-center justify-between gap-x-4 px-4">
      <NuxtImg
        class="cursor-pointer rounded-full ring-2 ring-amber-500 hover:ring-amber-500/50 transition-all duration-200 ease-in-out m-1.5"
        :src="url(true, '/assets/logo/dewdew_v4_logo.webp')"
        format="webp"
        sizes="48px"
        :width="48"
        :height="48"
        loading="eager"
        :quality="80"
        :alt="t('texts.logo')"
        @click="navigateTo('/ai')"
      />
      <div class="flex-auto" />
      <AForecast v-if="isDesktopOrTablet" />
      <DdSeparator
        v-if="isDesktopOrTablet"
        orientation="vertical"
        class="h-6"
        :ui="{
          border: 'border-amber-500',
        }"
      />
      <nav aria-label="메인 네비게이션">
        <DdSlideover
          v-model:open="slideoverTrigger"
          :overlay="false"
          :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full h-12 w-12 flex items-center justify-center',
          }"
          :ui="{
            header: 'h-20 flex items-center',
            close: 'top-6 right-6',
          }"
        >
          <ATooltipButton
            button-variant="ghost"
            use-leading
            use-icon
            icon-lead-name="i-lucide-menu"
            :tooltip-text="$t('menu.openMenu')"
          />
          <template #header>
            <div class="w-full flex items-center justify-end">
              <ATooltipButton
                button-variant="ghost"
                use-leading
                use-icon
                icon-lead-name="i-lucide-x"
                :tooltip-text="$t('menu.closeMenu')"
                @click="slideoverTrigger = false"
              />
            </div>
          </template>
          <template #body>
            <div class="h-full flex flex-col space-y-4">
              <AForecast
                v-if="isMobileOrTablet"
                class="my-4"
              />
              <DdSeparator v-if="isMobileOrTablet" />
              <div class="space-y-2">
                <ATooltipButton
                  custom-class="w-full cursor-pointer"
                  use-leading
                  use-icon
                  icon-lead-name="i-lucide-home"
                  icon-lead-class="w-6 h-6"
                  button-size="xl"
                  button-variant="ghost"
                  button-color="neutral"
                  button-label-class="text-xl font-bold truncate"
                  :button-text="$t('menu.home')"
                  @click:button="handlePagination('/', false)"
                />
                <ATooltipButton
                  custom-class="w-full cursor-pointer"
                  use-leading
                  use-icon
                  icon-lead-name="i-lucide-bot"
                  icon-lead-class="w-6 h-6"
                  button-size="xl"
                  button-variant="ghost"
                  button-color="neutral"
                  button-label-class="text-xl font-bold truncate"
                  :button-text="$t('menu.ai')"
                  @click:button="handlePagination('/ai', false)"
                />
                <ATooltipButton
                  custom-class="w-full cursor-pointer"
                  use-leading
                  use-icon
                  icon-lead-name="i-lucide-shapes"
                  icon-lead-class="w-6 h-6"
                  button-size="xl"
                  button-variant="ghost"
                  button-color="neutral"
                  button-label-class="text-xl font-bold truncate"
                  :button-text="$t('menu.aiComponents')"
                  @click:button="handlePagination('/ai/components', false)"
                />
                <ATooltipButton
                  custom-class="w-full cursor-pointer"
                  use-leading
                  use-icon
                  icon-lead-name="i-lucide-chess-knight"
                  icon-lead-class="w-6 h-6"
                  button-size="xl"
                  button-variant="ghost"
                  button-color="neutral"
                  button-label-class="text-xl font-bold truncate"
                  :button-text="$t('menu.v4')"
                  @click:button="handlePagination('https://v4.dewdew.dev', true)"
                />
              </div>
              <DdSeparator />
              <div class="flex items-center gap-x-2">
                <AThemeChange
                  custom-class="gap-0"
                  icon-lead-class="w-7 h-7"
                  button-variant="ghost"
                />
                <ALanguageChange
                  custom-class="gap-0"
                  icon-lead-class="w-8 h-8"
                />
              </div>
            </div>
          </template>
        </DdSlideover>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <AFooterGroup />
    </footer>
  </div>
</template>
