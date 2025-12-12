<script setup lang="ts">
import type { ResumeDatabase } from '~/types/supabase-resume'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const { data: skills } = await useFetch<ResumeDatabase['resume']['Tables']['skills']['Row'][]>('/api/resume/skills', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

// 중요 스킬 상위 10개만 추출 (레이더 차트 대신 핵심 역량 시각화)
const coreSkills = computed(() => {
  if (!skills.value) return []
  // 숙련도 4 이상인 것들만 추려서 상위 8개
  return skills.value
    .filter(s => (s.proficiency || 0) >= 4)
    .slice(0, 8)
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
          {{ $t('dynamic.skill.core') }}
        </h3>

        <div
          v-if="coreSkills.length > 0"
          class="flex flex-wrap gap-3"
        >
          <DdBadge
            v-for="skill in coreSkills"
            :key="skill.id"
            :label="skill.name"
            variant="subtle"
            :color="skill.proficiency ? 'primary' : 'neutral'"
            size="lg"
            class="px-3 py-1.5"
          >
            <template #leading>
              <NuxtImg
                v-if="skill.icon_url"
                :src="skill.icon_url"
                class="w-4 h-4 mr-1"
                :alt="skill.name"
              />
            </template>
            <template #trailing>
              <Icon
                name="i-lucide-star"
                class="w-4 h-4 mr-1 text-amber-500 dark:text-amber-400"
              />
              <span class="text-sm text-neutral-600 dark:text-neutral-300">{{ skill.proficiency }} / 5</span>
            </template>
          </DdBadge>
        </div>

        <div
          v-else
          class="text-sm text-neutral-500"
        >
          {{ $t('dynamic.skill.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
