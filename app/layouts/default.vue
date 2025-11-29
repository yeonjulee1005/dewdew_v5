<script setup lang="ts">
const { width } = useWindowSize()
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
  <div class="w-dvw xl:w-[1024px] h-auto">
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
      <AForecast v-if="width > 1024" />
      <DdSeparator
        v-if="width > 1024"
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
          <div class="h-full flex flex-col gap-y-2 px-3 py-4">
            <!-- <div
              v-for="(menu, index) in viewMenuData"
              :key="index"
              class="h-14"
              :class="{ hidden: menu.code === 'MNC001' }"
            >
              <ATooltipButton
                class="cursor-pointer"
                use-leading
                :icon-lead-name="menu.icon ?? ''"
                icon-lead-class="w-6 h-6"
                button-size="xl"
                button-variant="ghost"
                button-color="neutral"
                button-label-class="text-xl font-bold truncate"
                :tooltip-text="$t(`menu.${menu.code}`)"
                :button-text="$t(`menu.${menu.code}`)"
                @click:button="moveToNavigation(menu.url ?? '', false)"
              />
            </div> -->
            <DdSeparator />
            <AForecast
              v-if="width < 1023"
              class="my-4"
            />
            <DdSeparator v-if="width < 1023" />
            <div class="flex items-center gap-x-2">
              <!-- <div
                v-for="(subMenu, index) in viewMenuData?.[0]?.subMenuList as MenuDatabase['menu']['Tables']['subMenu']['Row'][]"
                :key="index"
                :class="{ hidden: subMenu.code !== 'SMC007' && subMenu.code !== 'SMC008' && subMenu.code !== 'SMC009' }"
              >
                <ATooltipButton
                  v-if="subMenu.code === 'SMC007' || subMenu.code === 'SMC008'"
                  custom-class="gap-0"
                  button-variant="ghost"
                  use-leading
                  :icon-lead-name="subMenu.icon ?? ''"
                  icon-lead-class="w-8 h-8"
                  @click="moveToNavigation(subMenu.url ?? '', true)"
                />
                <div
                  v-if="subMenu.code === 'SMC009'"
                  class="w-11 h-11 flex items-center justify-center p-1.5 cursor-pointer"
                  @click="navigateTo(subMenu.url ?? '', { external: true, open: { target: '_blank' } })"
                >
                  <NuxtImg
                    class="h-[32px] w-[32px] rounded-lg bg-stone-50 hover:ring-4 hover:ring-indigo-600 dark:hover:ring-indigo-400 transition-all duration-200 ease-in-out"
                    :src="url(true, subMenu.image_url ?? '')"
                    sizes="32px sm:32px md:32px lg:32px xl:32px"
                    format="webp"
                    :width="32"
                    :height="32"
                    loading="eager"
                    :quality="80"
                    alt="logo"
                  />
                </div>
              </div> -->
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
