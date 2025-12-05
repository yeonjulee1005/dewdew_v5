<script setup lang="ts">
const { url } = useImageStorage()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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

// Carousel 참조 및 활성 인덱스
const carousel = useTemplateRef('carousel')
const activeIndex = ref(0)

// 썸네일 클릭 핸들러
function selectThumbnail(index: number) {
  activeIndex.value = index
  carousel.value?.emblaApi?.scrollTo(index)
}

// Carousel 선택 이벤트 핸들러
function onSelect(index: number) {
  activeIndex.value = index
}

// 년도 변경 시 activeIndex 리셋
watch(selectedYear, () => {
  activeIndex.value = 0
})
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
          {{ $t('dynamic.image.archive') }}
        </h3>

        <div
          v-if="tabs.length > 0"
          class="w-full flex flex-col gap-y-4"
        >
          <!-- 년도별 Tabs -->
          <DdTabs
            v-model="selectedYear"
            :items="tabs"
            size="xl"
            :content="false"
          />

          <!-- 선택된 년도의 이미지 Carousel -->
          <div
            v-if="currentYearImages.length > 0"
            class="flex flex-col gap-y-4"
          >
            <DdCarousel
              ref="carousel"
              v-slot="{ item: image }"
              :items="currentYearImages"
              :ui="{ item: 'basis-full' }"
              @select="onSelect"
            >
              <div class="flex flex-col gap-y-2">
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
                  class="flex flex-col gap-y-2"
                >
                  <h4 class="text-lg font-bold">
                    {{ image.title }}
                  </h4>
                  <!-- <p
                    v-if="image.year_description"
                    class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line"
                  >
                    {{ image.year_description }}
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
                  </div> -->
                </div>
              </div>
            </DdCarousel>

            <!-- 썸네일 -->
            <div class="flex gap-1 overflow-x-auto py-2 [scrollbar-width:thin] [-ms-overflow-style:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:dark:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              <div
                v-for="(image, index) in currentYearImages"
                :key="index"
                class="size-16 min-w-16 shrink-0 opacity-25 hover:opacity-100 transition-opacity cursor-pointer rounded-lg overflow-hidden"
                :class="{ 'opacity-100 border-primary-500': activeIndex === index, 'border-transparent': activeIndex !== index }"
                @click="selectThumbnail(index)"
              >
                <NuxtImg
                  v-if="image.image_url"
                  :src="url(true, image.image_url.split('/public')[1] ?? '')"
                  class="w-full h-full object-cover"
                  format="webp"
                  :quality="60"
                  :alt="image.title || 'Thumbnail'"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-md text-neutral-500 dark:text-neutral-500 text-center py-8"
          >
            {{ $t('dynamic.image.empty') }}
          </div>
        </div>

        <div
          v-else
          class="text-md text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.image.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
