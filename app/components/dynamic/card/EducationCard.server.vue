<script setup lang="ts">
const { isDesktopOrTablet } = useDevice()
const { url } = useImageStorage()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

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
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.education.title') }}
        </h3>
        <DdPageGrid
          v-if="educationData && educationData.length > 0"
          class="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2"
        >
          <DdPageCard
            v-for="(education, index) in educationData"
            :key="index"
            :title="education.school_name"
            orientation="vertical"
            variant="outline"
            :ui="{
              title: 'text-xl font-bold',
              description: 'text-sm text-neutral-600 dark:text-neutral-400',
            }"
          >
            <template #description>
              <div class="flex flex-col gap-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    v-if="education.major"
                    class="text-lg font-semibold text-neutral-600 dark:text-neutral-400"
                  >
                    {{ education.major }}
                  </span>
                  <span
                    v-if="education.degree"
                    class="text-lg font-semibold text-neutral-600 dark:text-neutral-400"
                  >
                    {{ education.degree }}
                  </span>
                  <DdSeparator
                    v-if="education.degree && isDesktopOrTablet"
                    orientation="vertical"
                    class="h-4"
                  />
                  <div class="flex flex-wrap items-center gap-2 text-md text-neutral-700 dark:text-neutral-300">
                    <span>{{ formatDate(education.start_date) }}</span>
                    <span>~</span>
                    <span>{{ education.end_date ? formatDate(education.end_date) : $t('dynamic.education.present') }}</span>
                  </div>
                </div>
                <DdSeparator v-if="education.description" />
                <p
                  v-if="education.description"
                  class="text-md text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed break-keep"
                >
                  {{ education.description }}
                </p>
              </div>
            </template>
            <NuxtImg
              v-if="education.image_url"
              :src="url(true, education.image_url.split('/public')[1] ?? '')"
              class="w-full h-full object-contain rounded-md"
              format="webp"
              :quality="60"
              :width="200"
              :height="200"
              sizes="96px"
              :alt="education.school_name"
              loading="lazy"
            />
          </DdPageCard>
        </DdPageGrid>
        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.education.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
