<script setup lang="ts">
import { track } from '@vercel/analytics/server'

const { url } = useImageStorage()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const { data: projectsData } = await useFetch('/api/resume/projects', {
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
          {{ $t('dynamic.project.title') }}
        </h3>

        <div
          v-if="projectsData && projectsData.length > 0"
          class="w-full"
        >
          <DdCarousel
            v-slot="{ item: project }"
            :items="projectsData"
            arrows
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 -translate-y-1/4 w-20 h-10', prev: '!left-0', next: '!right-0' }"
          >
            <div class="flex flex-col h-[520px] overflow-y-auto p-3 rounded-md border border-neutral-200 dark:border-neutral-700 [scrollbar-width:thin] [-ms-overflow-style:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div class="flex flex-col gap-y-4 shrink-0">
                <div
                  v-if="project.description_image_url"
                  class="w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
                >
                  <NuxtImg
                    :src="url(true, project.description_image_url?.split('/public')[1] ?? '')"
                    class="w-full h-auto max-h-[300px] object-contain"
                    format="webp"
                    :quality="80"
                    :alt="project.title"
                  />
                </div>

                <div class="flex flex-col">
                  <div class="flex items-start justify-between gap-x-4">
                    <h4 class="text-xl font-bold">
                      {{ project.title }}
                    </h4>
                    <div
                      v-if="project.start_date || project.end_date"
                      class="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap"
                    >
                      {{ formatDate(project.start_date) }}
                      <span v-if="project.end_date"> ~ {{ formatDate(project.end_date) }}</span>
                      <span v-else> ~ {{ $t('dynamic.project.present') }}</span>
                    </div>
                  </div>
                  <p
                    v-if="project.description"
                    class="text-md text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
                  >
                    {{ project.description }}
                  </p>
                </div>

                <div
                  v-if="project.tech_stack && project.tech_stack.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <DdBadge
                    v-for="(tech, techIndex) in project.tech_stack"
                    :key="techIndex"
                    :label="tech"
                    variant="outline"
                    color="secondary"
                    size="xl"
                  />
                </div>

                <DdSeparator />

                <div
                  v-if="project.highlights && project.highlights.length > 0"
                  class="flex flex-col gap-y-1"
                >
                  <span class="text-lg font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                    {{ $t('dynamic.project.highlights', '주요 특징') }}
                  </span>
                  <ul class="list-disc list-inside text-md text-neutral-600 dark:text-neutral-400 space-y-1">
                    <li
                      v-for="(highlight, highlightIndex) in project.highlights"
                      :key="highlightIndex"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </div>

                <div
                  v-if="project.project_url || project.github_url"
                  class="flex gap-x-2"
                >
                  <DdButton
                    v-if="project.project_url"
                    :to="project.project_url"
                    target="_blank"
                    variant="outline"
                    size="xl"
                    color="primary"
                    @click="track('project_view', { project: project.title })"
                  >
                    {{ $t('dynamic.project.viewProject') }}
                  </DdButton>
                  <DdButton
                    v-if="project.github_url"
                    :to="project.github_url"
                    target="_blank"
                    variant="outline"
                    size="xl"
                    color="secondary"
                    @click="track('github_view', { github: project.github_url })"
                  >
                    {{ $t('dynamic.project.viewGithub') }}
                  </DdButton>
                </div>
              </div>
            </div>
          </DdCarousel>
        </div>

        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.project.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
