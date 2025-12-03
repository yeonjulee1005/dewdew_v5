<script setup lang="ts">
const { data: educationData } = await useFetch('/api/resume/education', {
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
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.education.title', '학력') }}
      </h3>
      <div
        v-if="educationData && educationData.length > 0"
        class="flex flex-col gap-y-4"
      >
        <div
          v-for="(education, index) in educationData"
          :key="index"
          class="flex flex-col gap-y-2 p-3 rounded-md border border-neutral-200 dark:border-neutral-700"
        >
          <div class="flex flex-col gap-y-1">
            <div class="flex items-center gap-x-2">
              <span class="text-lg font-bold">
                {{ education.school_name }}
              </span>
            </div>
            <div class="flex flex-col gap-y-0.5">
              <span
                v-if="education.degree"
                class="text-md font-semibold text-neutral-600 dark:text-neutral-400"
              >
                {{ education.degree }}
              </span>
              <span
                v-if="education.major"
                class="text-sm text-neutral-500 dark:text-neutral-500"
              >
                {{ education.major }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-x-2 text-sm text-neutral-500 dark:text-neutral-500">
            <span>{{ formatDate(education.start_date) }}</span>
            <span>~</span>
            <span>{{ education.end_date ? formatDate(education.end_date) : $t('dynamic.education.present', '재학중') }}</span>
          </div>
          <p
            v-if="education.description"
            class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
          >
            {{ education.description }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.education.empty', '학력 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
