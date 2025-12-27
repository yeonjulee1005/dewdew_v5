<script setup lang="ts">
import type { UvData, AirDiffusionData, WeatherFirstData, WeatherSecondData } from '@/types/weather'

const { uvData, airDiffusionData, weatherFirstData, weatherSecondData } = storeToRefs(useLocWeatherStore())
const { airDiffusionColor, uvColor, humidityColor, weatherColor, temperatureColor } = useColorUtils()

// 캐러셀 아이템 배열 생성
const carouselItems = computed(() => {
  const items: Array<{ type: string, data: UvData | AirDiffusionData | WeatherFirstData | WeatherSecondData }> = []

  if (uvData.value) {
    items.push({ type: 'uv', data: uvData.value })
  }

  if (airDiffusionData.value) {
    items.push({ type: 'airDiffusion', data: airDiffusionData.value })
  }

  if (weatherFirstData.value) {
    items.push({ type: 'weatherFirst', data: weatherFirstData.value })
  }

  if (weatherSecondData.value) {
    items.push({ type: 'weatherSecond', data: weatherSecondData.value })
  }

  return items
})
</script>

<template>
  <DdCarousel
    v-if="carouselItems.length > 0"
    v-slot="{ item }"
    :items="carouselItems"
    orientation="vertical"
    loop
    :autoplay="{ delay: 2000 }"
    :ui="{
      container: 'h-14',
      item: 'basis-full h-14',
    }"
    class="h-10 w-full max-w-fit"
  >
    <!-- UV 데이터 -->
    <div
      v-if="item.type === 'uv'"
      class="h-10 w-full flex items-center"
    >
      <div class="flex gap-4">
        <AIconText
          :use-icon="false"
          :text="(item.data as UvData).location"
        />
        <AIconText
          :use-icon="false"
          :text="$t('texts.uv')"
        />
        <AIconText
          :custom-class="uvColor((item.data as UvData).uvIndex)"
          :icon-name="(item.data as UvData).uv.split(',')[1]"
          :text-class="uvColor((item.data as UvData).uvIndex)"
          :text="(item.data as UvData).uv.split(',')[0]"
        />
      </div>
    </div>

    <!-- 대기정체 데이터 -->
    <div
      v-else-if="item.type === 'airDiffusion'"
      class="h-10 w-full flex items-center"
    >
      <div class="flex gap-4">
        <AIconText
          :use-icon="false"
          :text="(item.data as AirDiffusionData).location"
        />
        <AIconText
          :use-icon="false"
          :text="$t('texts.diffusion')"
        />
        <AIconText
          :custom-class="airDiffusionColor((item.data as AirDiffusionData).diffusionIndex)"
          :icon-name="(item.data as AirDiffusionData).diffusion.split(',')[1]"
          :text-class="airDiffusionColor((item.data as AirDiffusionData).diffusionIndex)"
          :text="(item.data as AirDiffusionData).diffusion.split(',')[0]"
        />
      </div>
    </div>

    <!-- 날씨 첫 번째 데이터 -->
    <div
      v-else-if="item.type === 'weatherFirst'"
      class="h-10 w-full flex items-center"
    >
      <div class="flex gap-4">
        <AIconText
          :custom-class="weatherColor((item.data as WeatherFirstData).sky.split(',')[0] ?? '')"
          :icon-name="(item.data as WeatherFirstData).sky.split(',')[1]"
          :text="(item.data as WeatherFirstData).sky.split(',')[0]"
        />
        <AIconText
          :use-icon="false"
          :text-class="temperatureColor((item.data as WeatherFirstData).t1h)"
          :text="`${(item.data as WeatherFirstData).t1h} ℃`"
        />
        <AIconText
          custom-class="gap-2"
          :icon-name="(item.data as WeatherFirstData).vec.split(',')[1]"
          :text="(item.data as WeatherFirstData).wsd"
        />
      </div>
    </div>

    <!-- 날씨 두 번째 데이터 -->
    <div
      v-else-if="item.type === 'weatherSecond'"
      class="h-10 w-full flex items-center"
    >
      <div class="flex gap-4">
        <AIconText
          :icon-name="(item.data as WeatherSecondData).pty.split(',')[1]"
          :text="(item.data as WeatherSecondData).pty.split(',')[0]"
        />
        <AIconText
          :use-icon="false"
          :text="(item.data as WeatherSecondData).r1n"
        />
        <AIconText
          :custom-class="humidityColor(parseInt((item.data as WeatherSecondData).reh))"
          icon-name="wi:humidity"
          :text-class="humidityColor(parseInt((item.data as WeatherSecondData).reh))"
          :text="(item.data as WeatherSecondData).reh"
        />
      </div>
    </div>
  </DdCarousel>
</template>
