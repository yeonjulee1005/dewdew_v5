<script setup lang="ts">
const { isDesktopOrTablet, isMobileOrTablet } = useDevice()
const { url } = useImageStorage()

const slideoverTrigger = ref(false)

// const moveToNavigation = (url: string, isExternal: boolean) => {
//   isExternal
//     ? navigateTo(url, { external: true, open: { target: '_blank' } })
//     : navigateTo(url)

//   slideoverTrigger.value = false
// }
</script>

<template>
  <div class="w-dvw xl:w-[1024px] h-screen">
    <div class="h-20 flex items-center justify-between gap-x-4 px-4">
      <NuxtImg
        class="cursor-pointer rounded-full ring-2 ring-amber-500 hover:ring-amber-500/50 transition-all duration-200 ease-in-out m-1.5"
        :src="url(true, '/assets/logo/dewdew_v4_logo.webp')"
        format="webp"
        sizes="100px sm:100px md:100px lg:100px xl:100px xxl:100px 2xl:100px"
        :width="48"
        :height="48"
        loading="eager"
        :quality="80"
        alt="logo"
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
        />
        <template #header>
          <div class="w-full flex items-center justify-end">
            <ATooltipButton
              button-variant="ghost"
              use-leading
              use-icon
              icon-lead-name="i-lucide-x"
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
                @click:button="navigateTo('/')"
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
                @click:button="navigateTo('/ai')"
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
                @click:button="navigateTo('/ai')"
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
    </div>
    <slot />
    <AFooterGroup />
  </div>
</template>
