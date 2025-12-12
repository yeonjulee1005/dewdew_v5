<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-xl font-bold">
          {{ $t('dynamic.experience.title') }}
        </h3>
        <div
          v-if="experienceData && experienceData.length > 0"
          class="w-full"
        >
          <DdCarousel
            v-slot="{ item: experience }"
            :items="experienceData"
            arrows
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 -translate-y-1/4 w-20 h-10', prev: '!left-0', next: '!right-0' }"
          >
            <div class="flex flex-col h-[300px] overflow-y-auto p-3 rounded-md border border-neutral-200 dark:border-neutral-700 [scrollbar-width:thin] [-ms-overflow-style:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div class="flex flex-col gap-y-3 shrink-0">
                <div class="flex flex-col">
                  <div class="flex items-center gap-x-2">
                    <span class="text-2xl font-bold">
                      {{ experience.company_name }}
                    </span>
                    <DdBadge
                      v-if="experience.is_current"
                      variant="outline"
                      color="info"
                      size="lg"
                      :label="$t('dynamic.experience.current')"
                    />
                  </div>
                  <div class="flex items-center gap-x-2">
                    <span class="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                      {{ experience.position }}
                    </span>
                    <DdSeparator
                      orientation="vertical"
                      class="h-4"
                    />
                    <div class="flex items-center gap-x-2 text-sm text-neutral-500 dark:text-neutral-500">
                      <span>{{ formatDate(experience.start_date) }}</span>
                      <span>~</span>
                      <span>{{ experience.end_date ? formatDate(experience.end_date) : $t('dynamic.experience.present') }}</span>
                    </div>
                  </div>
                </div>
                <DdSeparator />
                <p
                  v-if="experience.description"
                  class="text-md text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
                >
                  {{ experience.description }}
                </p>
              </div>
            </div>
          </DdCarousel>
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
