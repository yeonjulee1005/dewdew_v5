<script setup lang="ts">
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
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.project.title', '프로젝트') }}
      </h3>
      <div
        v-if="projectsData && projectsData.length > 0"
        class="flex flex-col gap-y-4"
      >
        <div
          v-for="(project, index) in projectsData"
          :key="index"
          class="flex flex-col gap-y-3 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
        >
          <div class="flex flex-col gap-y-2">
            <div class="flex items-start justify-between gap-x-4">
              <h4 class="text-lg font-bold">
                {{ project.title }}
              </h4>
              <div
                v-if="project.start_date || project.end_date"
                class="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap"
              >
                {{ formatDate(project.start_date) }}
                <span v-if="project.end_date"> ~ {{ formatDate(project.end_date) }}</span>
                <span v-else> ~ {{ $t('dynamic.project.present', '진행중') }}</span>
              </div>
            </div>
            <p
              v-if="project.description"
              class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
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
              size="sm"
            />
          </div>

          <div
            v-if="project.highlights && project.highlights.length > 0"
            class="flex flex-col gap-y-1"
          >
            <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
              {{ $t('dynamic.project.highlights', '주요 특징') }}
            </span>
            <ul class="list-disc list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
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
              size="sm"
              color="primary"
            >
              {{ $t('dynamic.project.viewProject', '프로젝트 보기') }}
            </DdButton>
            <DdButton
              v-if="project.github_url"
              :to="project.github_url"
              target="_blank"
              variant="outline"
              size="sm"
              color="secondary"
            >
              {{ $t('dynamic.project.viewGithub', 'GitHub 보기') }}
            </DdButton>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.project.empty', '프로젝트 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
