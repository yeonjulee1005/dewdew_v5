<script setup lang="ts">
const { url } = useImageStorage()

const { data: hobbiesData } = await useFetch('/api/resume/hobbies', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})
</script>

<template>
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.hobby.title', '취미 및 관심사') }}
      </h3>

      <div
        v-if="hobbiesData && hobbiesData.length > 0"
        class="w-full"
      >
        <DdCarousel
          v-slot="{ item: hobby }"
          :items="hobbiesData"
          arrows
          dots
          :ui="{ item: 'basis-full' }"
        >
          <div class="flex flex-col gap-y-3">
            <div class="flex flex-col items-center gap-y-3">
              <DdAvatar
                v-if="hobby.icon_url"
                :src="url(true, hobby.icon_url.split('/public')[1] ?? '')"
                :alt="hobby.title"
                :text="hobby.icon_url"
                size="xl"
                class="w-20 h-20 text-4xl"
              />
              <Icon
                v-else
                name="i-lucide-heart"
                class="w-16 h-16 text-primary-500 dark:text-primary-400"
              />
              <h4 class="text-lg font-bold text-center">
                {{ hobby.title }}
              </h4>
            </div>

            <p
              v-if="hobby.description"
              class="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line text-center leading-relaxed"
            >
              {{ hobby.description }}
            </p>
          </div>
        </DdCarousel>
      </div>

      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.hobby.empty', '취미 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
