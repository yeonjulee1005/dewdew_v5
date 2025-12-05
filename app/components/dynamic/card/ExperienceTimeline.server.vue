<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const { t } = useI18n()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const activeItem = ref(0)
const isAutoPlaying = ref(true)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const { data: experienceData } = await useFetch('/api/resume/experience', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

const formatDateRange = (startDate: string | null, endDate: string | null, isFirst: boolean = false) => {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : (isFirst ? t('dynamic.experience.present') : ' ')
  return end ? `${start} ~ ${end}` : start
}

const timelineItems = computed(() => {
  if (!experienceData.value || experienceData.value.length === 0) {
    return []
  }

  return experienceData.value.map((experience, index) => ({
    date: formatDateRange(experience.start_date, experience.end_date, index === 0),
    title: experience.company_name,
    description: experience.description,
    icon: experience.is_current ? 'i-lucide-briefcase' : 'i-lucide-building',
    value: experience.id ?? experience.order_index ?? undefined,
    is_current: experience.is_current,
  }))
})

const startAutoPlay = () => {
  if (timelineItems.value.length < 2) {
    return
  }

  if (autoPlayInterval) {
    return
  }

  isAutoPlaying.value = true
  autoPlayInterval = setInterval(() => {
    activeItem.value = (activeItem.value + 1) % timelineItems.value.length
  }, 1000)
}

// 자동 순환 중지
const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
  isAutoPlaying.value = false
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-xl font-bold">
          {{ $t('dynamic.experience.title') }}
        </h3>
        <div
          v-if="timelineItems.length > 0"
          class="w-full"
        >
          <DdTimeline
            :model-value="activeItem"
            :items="(timelineItems as TimelineItem[])"
            color="primary"
            size="3xl"
            orientation="vertical"
            :ui="{
              title: 'text-xl font-bold',
              date: 'text-md float-end ms-1',
              description: 'mt-2 text-md break-keep',
            }"
          >
            <template #title="{ item }">
              <div class="flex items-center gap-x-2">
                <span>
                  {{ item.title }}
                </span>
                <DdBadge
                  v-if="item.is_current"
                  variant="outline"
                  color="info"
                  size="lg"
                  :label="$t('dynamic.experience.current')"
                />
              </div>
            </template>
            <template #description="{ item }">
              <div
                v-if="item.description"
                v-dompurify-html="item.description"
                class="mt-2 ring rounded-md py-2 px-3 text-md text-neutral-600 dark:text-neutral-400 whitespace-pre-line [&_p]:mb-2 [&_p]:last:mb-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1"
              />
            </template>
          </DdTimeline>
        </div>
        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.experience.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
