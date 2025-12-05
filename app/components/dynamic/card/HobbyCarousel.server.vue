<script setup lang="ts">
const { url } = useImageStorage()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const { data: hobbiesData } = await useFetch('/api/resume/hobbies', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
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
          {{ $t('dynamic.hobby.title') }}
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
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 w-20 h-10', prev: '!left-0', next: '!right-0' }"
          >
            <div class="min-h-[220px] flex flex-col gap-y-3">
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
                <h4 class="text-xl font-bold text-center">
                  {{ hobby.title }}
                </h4>
              </div>

              <p
                v-if="hobby.description"
                class="text-base break-keep text-neutral-600 dark:text-neutral-400 whitespace-pre-line text-center leading-relaxed"
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
          {{ $t('dynamic.hobby.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
