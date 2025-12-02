<script setup lang="ts">
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
        v-if="experienceData && experienceData.length > 0"
        class="flex flex-col gap-y-4"
      >
        <div
          v-for="(experience, index) in experienceData"
          :key="index"
          class="flex flex-col gap-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex flex-col gap-y-1">
            <div class="flex items-center gap-x-2">
              <span class="text-lg font-bold">
                {{ experience.company_name }}
              </span>
              <span
                v-if="experience.is_current"
                class="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {{ $t('dynamic.experience.current') }}
              </span>
            </div>
            <span class="text-md font-semibold text-neutral-600 dark:text-neutral-400">
              {{ experience.position }}
            </span>
          </div>
          <div class="flex items-center gap-x-2 text-sm text-neutral-500 dark:text-neutral-500">
            <span>{{ formatDate(experience.start_date) }}</span>
            <span>~</span>
            <span>{{ experience.end_date ? formatDate(experience.end_date) : $t('dynamic.experience.present') }}</span>
          </div>
          <p
            v-if="experience.description"
            class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
          >
            {{ experience.description }}
          </p>
        </div>
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
