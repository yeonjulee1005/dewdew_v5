<script setup lang="ts">
import type { ResumeDatabase } from '~/types/supabase-resume'

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
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold flex items-center gap-2">
        <Icon
          name="i-lucide-radar"
          class="w-6 h-6 text-primary-500"
        />
        {{ $t('dynamic.skill.core', '핵심 역량') }}
      </h3>

      <div
        v-if="coreSkills.length > 0"
        class="flex flex-col gap-y-3"
      >
        <div
          v-for="skill in coreSkills"
          :key="skill.id"
          class="flex flex-col gap-1"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold flex items-center gap-1.5">
              <NuxtImg
                v-if="skill.icon_url"
                :src="skill.icon_url"
                class="w-4 h-4"
                :alt="skill.name"
              />
              {{ skill.name }}
            </span>
            <span class="text-xs text-neutral-500">{{ skill.proficiency }} / 5</span>
          </div>

          <DdMeter
            :value="skill.proficiency || 0"
            :min="0"
            :max="5"
            color="primary"
            size="md"
            indicator
          />
        </div>
      </div>

      <div
        v-else
        class="text-sm text-neutral-500"
      >
        {{ $t('dynamic.skill.empty', '스킬 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
