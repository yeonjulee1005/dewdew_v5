<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

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
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
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
            loop
            :ui="{ item: 'basis-full', arrows: 'absolute bottom-0 right-8 w-20 h-10', prev: '!left-0', next: '!right-0' }"
            :aria-label="$t('dynamic.hobby.carousel', '취미 및 관심사 캐러셀')"
          >
            <DdPageCard
              :title="hobby.title"
              :description="hobby.description || undefined"
              :icon="hobby.icon_url"
              variant="soft"
              orientation="vertical"
              :ui="{
                title: 'text-xl font-bold',
                description: 'text-md break-keep whitespace-pre-line leading-relaxed',
                leadingIcon: 'w-8 h-8 text-primary-500 dark:text-primary-400',
              }"
            />
          </DdCarousel>
        </div>

        <div
          v-else
          class="text-md text-neutral-700 dark:text-neutral-300"
        >
          {{ $t('dynamic.hobby.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
