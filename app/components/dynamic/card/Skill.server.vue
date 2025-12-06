<script setup lang="ts">
const { getSkillIcon } = useSkillIcon()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

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
          {{ $t('dynamic.skill.title') }}
        </h3>

        <div v-if="skills && skills.length > 0">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex flex-col gap-y-2 mb-4 last:mb-0"
          >
            <DdSeparator v-if="index > 0" />
            <h4 class="text-lg font-semibold break-keep truncate text-neutral-500 uppercase tracking-wider">
              {{ category }}
            </h4>
            <div class="flex flex-wrap gap-2.5">
              <DdBadge
                v-for="skill in groupedSkills[category]"
                :key="skill.id"
                :label="skill.name"
                variant="outline"
                :color="categoryColor(category)"
                size="xl"
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
          {{ $t('dynamic.skill.empty') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
