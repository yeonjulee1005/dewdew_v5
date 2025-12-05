<script setup lang="ts">
const { url } = useImageStorage()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.education.title') }}
        </h3>
        <div
          v-if="educationData && educationData.length > 0"
          class="flex flex-col gap-y-4"
        >
          <div
            v-for="(education, index) in educationData"
            :key="index"
            class="flex items-center gap-x-9 p-4 rounded-md border border-neutral-200 dark:border-neutral-700"
          >
            <NuxtImg
              v-if="education.image_url"
              :src="url(true, education.image_url.split('/public')[1] ?? '')"
              class="w-24 h-auto object-cover rounded-md"
              format="webp"
              :quality="80"
              :alt="education.school_name"
            />
            <div class="flex flex-col gap-y-4">
              <div class="flex flex-col gap-y-1">
                <div class="flex items-center gap-x-2">
                  <span class="text-xl font-bold">
                    {{ education.school_name }}
                  </span>
                  <span
                    v-if="education.degree"
                    class="text-lg font-semibold text-neutral-600 dark:text-neutral-400"
                  >
                    {{ education.degree }}
                  </span>
                  <DdSeparator
                    orientation="vertical"
                    class="h-4"
                  />
                  <div class="flex items-center gap-x-2 text-sm text-neutral-500 dark:text-neutral-500">
                    <span>{{ formatDate(education.start_date) }}</span>
                    <span>~</span>
                    <span>{{ education.end_date ? formatDate(education.end_date) : $t('dynamic.education.present') }}</span>
                  </div>
                </div>
                <span
                  v-if="education.major"
                  class="text-md text-neutral-500 dark:text-neutral-500"
                >
                  {{ education.major }}
                </span>
              </div>
              <DdSeparator />
              <p
                v-if="education.description"
                class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
              >
                {{ education.description }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.education.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
