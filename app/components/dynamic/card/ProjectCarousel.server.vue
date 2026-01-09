<script setup lang="ts">
import { track } from '@vercel/analytics'

const { url } = useImageStorage()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

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

// 이미지 모달 상태
const imageModalOpen = ref(false)
const selectedImageSrc = ref('')

// 이미지 클릭 핸들러
const handleImageClick = (imageUrl: string | null | undefined) => {
  if (!imageUrl) {
    return
  }

  selectedImageSrc.value = url(true, imageUrl.split('/public')[1] ?? '')
  imageModalOpen.value = true
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
            loop
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 -translate-y-1/4 w-20 h-10', prev: '!left-0', next: '!right-0' }"
            :aria-label="$t('dynamic.project.carousel', '프로젝트 캐러셀')"
          >
            <div
              class="flex flex-col h-[520px] overflow-y-auto p-3 rounded-md border border-neutral-200 dark:border-neutral-700 [scrollbar-width:thin] [-ms-overflow-style:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
              role="region"
              tabindex="0"
              :aria-label="`${$t('dynamic.project.scrollableRegion', '프로젝트 상세 정보 스크롤 영역')} - ${project.title}`"
            >
              <div class="flex flex-col gap-y-4 shrink-0">
                <div
                  v-if="project.description_image_url"
                  class="w-full max-h-[300px] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
                >
                  <NuxtImg
                    :src="url(true, project.description_image_url?.split('/public')[1] ?? '')"
                    class="w-full h-auto object-contain cursor-pointer"
                    format="webp"
                    :quality="80"
                    :alt="project.title"
                    loading="lazy"
                    @click="handleImageClick(project.description_image_url)"
                  />
                </div>

                <div class="flex flex-col gap-y-2">
                  <div class="flex items-center gap-x-4">
                    <h4 class="text-xl font-bold">
                      {{ project.title }}
                    </h4>
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
                    <div class="flex-auto" />
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
                    class="text-md text-neutral-700 dark:text-neutral-300 whitespace-pre-line"
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
                    :ui="{
                      label: 'text-neutral-800 dark:text-neutral-200',
                    }"
                  />
                </div>

                <DdSeparator />

                <div
                  v-if="project.highlights && project.highlights.length > 0"
                  class="flex flex-col gap-y-1"
                >
                  <span class="text-lg font-semibold text-neutral-800 dark:text-neutral-200 uppercase">
                    {{ $t('dynamic.project.highlights', '주요 특징') }}
                  </span>
                  <ul class="list-disc list-inside text-md text-neutral-800 dark:text-neutral-200 space-y-1">
                    <li
                      v-for="(highlight, highlightIndex) in project.highlights"
                      :key="highlightIndex"
                      class="leading-relaxed"
                    >
                      {{ highlight }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </DdCarousel>
        </div>

        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.project.empty') }}
        </div>
      </div>
    </DdCard>
    <DdModal
      v-model:open="imageModalOpen"
      :title="$t('ai.imageModal', '확대된 이미지')"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #body>
        <div class="flex justify-center items-center p-4">
          <img
            :src="selectedImageSrc"
            class="max-w-full max-h-[80vh] object-contain"
            alt="확대된 이미지"
            @click="imageModalOpen = false"
          >
        </div>
      </template>
    </DdModal>
  </div>
</template>
