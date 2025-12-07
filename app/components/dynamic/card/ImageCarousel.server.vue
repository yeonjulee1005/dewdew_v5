<script setup lang="ts">
const { isMobile } = useDevice()
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

// 년도별 이미지 가져오기 헬퍼 함수
const getYearImages = (year: number | string) => {
  return imagesByYear.value[Number(year)] ?? []
}

// 이미지 로딩 상태 추적 (이미지 URL을 키로 사용)
const imageLoadingStates = ref<Record<string, boolean>>({})

// 이미지가 처음 표시될 때 로딩 상태로 시작
const getImageKey = (imageUrl: string) => imageUrl

// 이미지 로딩 완료 핸들러
const handleImageLoad = (imageUrl: string) => {
  imageLoadingStates.value[getImageKey(imageUrl)] = false
}

// 이미지 로딩 에러 핸들러
const handleImageError = (imageUrl: string) => {
  imageLoadingStates.value[getImageKey(imageUrl)] = false
}

// 이미지 로딩 중인지 확인 (없으면 true 반환 - 초기 로딩 상태)
const isImageLoading = (imageUrl: string) => {
  const key = getImageKey(imageUrl)
  // 상태가 명시적으로 false가 아니면 로딩 중으로 간주
  return imageLoadingStates.value[key] !== false
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
            :orientation="isMobile ? 'vertical' : 'horizontal'"
            :ui="{
              root: 'flex-col',
              list: isMobile ? 'relative w-full flex p-1 group' : 'relative flex p-1 group',
            }"
          >
            <template #content="{ item }">
              <!-- 선택된 년도의 이미지 Carousel -->
              <div
                v-if="getYearImages(item.value).length > 0"
                class="flex flex-col gap-y-4"
              >
                <DdCarousel
                  ref="carousel"
                  v-slot="{ item: image }"
                  :items="getYearImages(item.value)"
                  :ui="{ item: 'basis-full' }"
                  @select="onSelect"
                >
                  <div class="flex flex-col gap-y-2">
                    <div
                      v-if="image.image_url"
                      class="relative w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 min-h-[200px] flex items-center justify-center bg-neutral-100 dark:bg-neutral-800"
                    >
                      <!-- 로딩 아이콘 -->
                      <div
                        v-if="isImageLoading(image.image_url)"
                        class="absolute inset-0 flex items-center justify-center bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm z-10"
                      >
                        <Icon
                          name="i-svg-spinners-dot-revolve"
                          class="w-12 h-12 text-primary-500"
                        />
                      </div>
                      <!-- 이미지 -->
                      <NuxtImg
                        v-if="image.image_url.split('/public')[1]"
                        :src="url(true, image.image_url.split('/public')[1] ?? '')"
                        class="w-full h-full object-contain"
                        :class="[
                          {
                            'opacity-0': isImageLoading(image.image_url),
                            'opacity-100': !isImageLoading(image.image_url),
                          },
                          isMobile ? 'max-h-[300px]' : 'max-h-[600px]',
                        ]"
                        format="webp"
                        :quality="60"
                        :alt="image.title || 'Image'"
                        loading="lazy"
                        @load="handleImageLoad(image.image_url)"
                        @error="handleImageError(image.image_url)"
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
                    v-for="(image, index) in getYearImages(item.value)"
                    :key="index"
                    class="size-16 min-w-16 shrink-0 opacity-25 hover:opacity-100 transition-opacity cursor-pointer rounded-lg overflow-hidden"
                    :class="{ 'opacity-100 border-primary-500': activeIndex === index, 'border-transparent': activeIndex !== index }"
                    @click="selectThumbnail(index)"
                  >
                    <NuxtImg
                      v-if="image.image_url && image.image_url.split('/public')[1]"
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
            </template>
          </DdTabs>
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
