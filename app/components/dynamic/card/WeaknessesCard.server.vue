<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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
    <DdCard :ui="{ body: 'p-2 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.weaknesses.title') }}
        </h3>
        <div
          v-if="profileData?.profile?.weaknesses && profileData.profile.weaknesses.length > 0"
          class="flex flex-col gap-y-3"
        >
          <div
            v-for="(weakness, index) in profileData.profile.weaknesses"
            :key="index"
            class="flex items-start gap-x-3 p-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
          >
            <div class="shrink-0 mt-0.5">
              <Icon
                name="i-lucide-alert-circle"
                class="w-5 h-5 text-amber-500 dark:text-amber-400"
              />
            </div>
            <p class="text-base break-keep text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {{ weakness }}
            </p>
          </div>
        </div>
        <div
          v-else
          class="text-md text-neutral-500 dark:text-neutral-500"
        >
          {{ $t('dynamic.weaknesses.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
