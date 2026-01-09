<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
  }>(), {
    title: '',
  },
)

const { data: profileData } = await useFetch('/api/resume/profile', {
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
          {{ $t('dynamic.weaknesses.title') }}
        </h3>
        <DdPageGrid
          v-if="profileData?.profile?.weaknesses && profileData.profile.weaknesses.length > 0"
          class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <DdPageCard
            v-for="(weakness, index) in profileData.profile.weaknesses"
            :key="index"
            icon="i-lucide-alert-circle"
            :title="`단점 및 개선 영역 ${index + 1}`"
            :description="weakness"
            variant="soft"
            :ui="{
              leadingIcon: 'w-5 h-5 text-rose-600 dark:text-rose-400',
              title: 'text-xl font-bold text-neutral-800 dark:text-neutral-200',
              description: 'text-md break-keep text-neutral-800 dark:text-neutral-200 leading-relaxed',
            }"
          />
        </DdPageGrid>
        <div
          v-else
          class="text-md text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.weaknesses.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
