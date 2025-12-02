<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

const { t } = useI18n()

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

const timelineItems = computed<TimelineItem[]>(() => {
  if (!experienceData.value || experienceData.value.length === 0) {
    return []
  }

  return experienceData.value.map((experience, index) => ({
    date: formatDateRange(experience.start_date, experience.end_date, index === 0),
    title: experience.company_name,
    description: `${experience.position}${experience.is_current ? ` • ${t('dynamic.experience.current')}` : ''}${experience.description ? `\n\n${experience.description}` : ''}`,
    icon: experience.is_current ? 'i-lucide-briefcase' : 'i-lucide-building',
    value: experience.id ?? experience.order_index ?? undefined,
  }))
})
</script>

<template>
  <DdCard
    variant="subtle"
    :ui="{ body: 'p-2 sm:p-4' }"
  >
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.experience.title') }}
      </h3>
      <div
        v-if="timelineItems.length > 0"
        class="w-full"
      >
        <DdTimeline
          :items="timelineItems"
          color="primary"
          orientation="vertical"
        />
      </div>
      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.experience.empty') }}
      </div>
    </div>
  </DdCard>
</template>
