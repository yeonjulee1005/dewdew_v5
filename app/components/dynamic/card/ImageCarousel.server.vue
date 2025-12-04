<script setup lang="ts">
const { url } = useImageStorage()

const { data: imageArchiveData } = await useFetch('/api/resume/imageArchive', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

// 년도별로 그룹화
const imagesByYear = computed(() => {
  if (!imageArchiveData.value || imageArchiveData.value.length === 0) {
    return {} as Record<number, NonNullable<typeof imageArchiveData.value>>
  }

  const grouped: Record<number, NonNullable<typeof imageArchiveData.value>> = {}

  imageArchiveData.value.forEach((image) => {
    const year = image.year
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(image)
  })

  // 년도별로 정렬 (내림차순)
  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  const result: Record<number, NonNullable<typeof imageArchiveData.value>> = {}
  sortedYears.forEach((year) => {
    const yearData = grouped[year]
    if (yearData) {
      result[year] = yearData
    }
  })

  return result
})

// 탭 아이템 생성
const tabs = computed(() => {
  return Object.keys(imagesByYear.value)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({
      label: String(year),
      value: year,
    }))
})

// 기본 선택된 년도 (가장 최근 년도)
const selectedYear = ref<number>(
  tabs.value.length > 0 && tabs.value[0] ? tabs.value[0].value : 0,
)

// 선택된 년도의 이미지 목록
const currentYearImages = computed(() => {
  if (!selectedYear.value) return []
  return imagesByYear.value[selectedYear.value] || []
})
</script>

<template>
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.image.title', '이미지 아카이브') }}
      </h3>

      <div
        v-if="tabs.length > 0"
        class="w-full"
      >
        <!-- 년도별 Tabs -->
        <DdTabs
          v-model="selectedYear"
          :items="tabs"
          class="mb-4"
          :content="false"
        />

        <!-- 선택된 년도의 이미지 Carousel -->
        <DdCarousel
          v-if="currentYearImages.length > 0"
          v-slot="{ item: image }"
          :items="currentYearImages"
          arrows
          dots
          :ui="{ item: 'basis-full' }"
        >
          <div class="flex flex-col gap-y-3">
            <div
              v-if="image.image_url"
              class="w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
            >
              <NuxtImg
                :src="url(true, image.image_url.split('/public')[1] ?? '')"
                class="w-full h-auto max-h-[500px] object-contain"
                format="webp"
                :quality="80"
                :alt="image.title || 'Image'"
                loading="lazy"
              />
            </div>

            <div
              v-if="image.title"
              class="flex flex-col gap-y-1"
            >
              <h4 class="text-lg font-bold">
                {{ image.title }}
              </h4>
              <p
                v-if="image.description"
                class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
              >
                {{ image.description }}
              </p>
              <div
                v-if="image.tags && image.tags.length > 0"
                class="flex flex-wrap gap-2 mt-2"
              >
                <DdBadge
                  v-for="(tag, tagIndex) in image.tags"
                  :key="tagIndex"
                  :label="tag"
                  variant="outline"
                  color="secondary"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </DdCarousel>

        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-500 text-center py-8"
        >
          {{ $t('dynamic.image.empty', '이미지가 없습니다.') }}
        </div>
      </div>

      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.image.empty', '이미지 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
