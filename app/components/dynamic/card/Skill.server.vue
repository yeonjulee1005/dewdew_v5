<script setup lang="ts">
const { getSkillIcon } = useSkillIcon()

const { data: skills } = await useFetch('/api/resume/skills', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

// 카테고리별 그룹화
const groupedSkills = computed(() => {
  if (!skills.value) return {}

  return skills.value.reduce((acc: Record<string, any[]>, skill: any) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})
})

const categories = computed(() => Object.keys(groupedSkills.value))

const categoryColor = (category: string) => {
  switch (category) {
    case 'Contribution':
      return 'info'
    case 'Language/Framework/Library':
      return 'secondary'
    case 'Tools/Workspace/Analytics':
      return 'warning'
    default:
      return 'neutral'
  }
}
</script>

<template>
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.skill.title', '기술 스택') }}
      </h3>

      <div v-if="skills && skills.length > 0">
        <div
          v-for="category in categories"
          :key="category"
          class="flex flex-col gap-y-2 mb-4 last:mb-0"
        >
          <h4 class="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
            {{ category }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <DdBadge
              v-for="skill in groupedSkills[category]"
              :key="skill.id"
              :label="skill.name"
              variant="outline"
              :color="categoryColor(category)"
              size="md"
              class="px-3 py-1.5"
            >
              <template #leading>
                <NuxtImg
                  v-if="skill.icon_url"
                  :src="skill.icon_url"
                  class="w-4 h-4 mr-1"
                  :alt="skill.name"
                />
                <Icon
                  v-else
                  :name="getSkillIcon(skill.name)"
                  class="w-4 h-4 mr-1"
                />
              </template>
            </DdBadge>
          </div>
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
