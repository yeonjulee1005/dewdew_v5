<script setup lang="ts">
import Flicking from '@egjs/vue3-flicking'
import { AutoPlay } from '@egjs/flicking-plugins'
import '@egjs/vue3-flicking/dist/flicking.css'

const { uvData, airDiffusionData, weatherFirstData, weatherSecondData } = storeToRefs(useLocWeatherStore())

const { airDiffusionColor, uvColor, humidityColor, weatherColor, temperatureColor } = useColorUtils()

const plugin = [
  new AutoPlay({
    animationDuration: 2000,
    direction: 'NEXT',
    stopOnHover: true,
  }),
]

const option = {
  inputType: ['touch', 'mouse'],
  circular: true,
  horizontal: false,
  deceleration: 0.004,
}
</script>

<template>
  <Flicking
    class="h-10 w-full max-w-fit"
    :plugins="plugin"
    :options="option"
  >
    <div
      :key="1"
      class="h-10 w-full flex items-center"
    >
      <div
        v-if="uvData"
        class="flex gap-4"
      >
        <AIconText
          :use-icon="false"
          :text="uvData.location"
        />
        <AIconText
          :use-icon="false"
          :text="$t('texts.uv')"
        />
        <AIconText
          :custom-class="uvColor(uvData.uvIndex)"
          :icon-name="uvData.uv.split(',')[1]"
          :text-class="uvColor(uvData.uvIndex)"
          :text="uvData.uv.split(',')[0]"
        />
      </div>
    </div>
    <div
      :key="2"
      class="h-10 w-full flex items-center"
    >
      <div
        v-if="airDiffusionData"
        class="flex gap-4"
      >
        <AIconText
          :use-icon="false"
          :text="airDiffusionData.location"
        />
        <AIconText
          :use-icon="false"
          :text="$t('texts.diffusion')"
        />
        <AIconText
          :custom-class="airDiffusionColor(airDiffusionData.diffusionIndex)"
          :icon-name="airDiffusionData.diffusion.split(',')[1]"
          :text-class="airDiffusionColor(airDiffusionData.diffusionIndex)"
          :text="airDiffusionData.diffusion.split(',')[0]"
        />
      </div>
    </div>
    <div
      :key="3"
      class="h-10 w-full flex items-center"
    >
      <div
        v-if="weatherFirstData"
        class="flex gap-4"
      >
        <AIconText
          :custom-class="weatherColor(weatherFirstData.sky.split(',')[0] ?? '')"
          :icon-name="weatherFirstData.sky.split(',')[1]"
          :text="weatherFirstData.sky.split(',')[0]"
        />
        <AIconText
          :use-icon="false"
          :text-class="temperatureColor(weatherFirstData.t1h)"
          :text="`${weatherFirstData.t1h} ℃`"
        />
        <AIconText
          custom-class="gap-2"
          :icon-name="weatherFirstData.vec.split(',')[1]"
          :text="weatherFirstData.wsd"
        />
      </div>
    </div>
    <div
      key="4"
      class="h-10 w-full flex items-center"
    >
      <div
        v-if="weatherSecondData"
        class="flex gap-4"
      >
        <AIconText
          :icon-name="weatherSecondData.pty.split(',')[1]"
          :text="weatherSecondData.pty.split(',')[0]"
        />
        <AIconText
          :use-icon="false"
          :text="weatherSecondData.r1n"
        />
        <AIconText
          :custom-class="humidityColor(parseInt(weatherSecondData.reh))"
          icon-name="wi:humidity"
          :text-class="humidityColor(parseInt(weatherSecondData.reh))"
          :text="weatherSecondData.reh"
        />
      </div>
    </div>
  </Flicking>
</template>
