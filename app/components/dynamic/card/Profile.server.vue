<script setup lang="ts">
const { isDesktopOrTablet } = useDevice()
const { url } = useImageStorage()

withDefaults(defineProps<{
  title?: string
}>(), {
  title: '',
})

const { data: profilesData } = await useFetch('/api/resume/profile', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const personalityData = computed(() => {
  if (!profilesData.value?.profile?.ai_personality_data) return null
  try {
    const data = profilesData.value.profile.ai_personality_data
    return typeof data === 'string' ? JSON.parse(data) : data
  }
  catch {
    return null
  }
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
      <div class="flex flex-wrap items-start gap-y-4 gap-x-8">
        <NuxtImg
          :src="url(true, profilesData?.profile?.avatar_url?.split('/public')[1] ?? '')"
          class="w-fit h-full object-contain max-h-100 rounded-md"
          format="webp"
          :quality="80"
          :width="400"
          :height="400"
          sizes="(max-width: 1024px) 200px, 400px"
          :alt="profilesData?.profile?.full_name || 'Profile image'"
          loading="lazy"
        />
        <div
          class="flex flex-col items-start gap-y-2"
          :class="[isDesktopOrTablet ? 'max-w-[380px]' : 'max-w-full']"
        >
          <h3 class="flex flex-wrap justify-start items-end gap-x-2">
            <span class="text-2xl font-bold">
              {{ profilesData?.profile?.full_name }}
            </span>
            <span class="text-md font-normal text-neutral-400">
              {{ profilesData?.profile?.title }}
            </span>
          </h3>
          <h3 class="flex flex-wrap justify-start items-end gap-x-2">
            <span class="text-lg font-bold">
              재직중:
            </span>
            <span class="text-lg">
              {{ profilesData?.experience?.company_name }}
            </span>
            <span class="text-lg text-amber-300 dark:text-amber-700">
              {{ profilesData?.experience?.position }}
            </span>
          </h3>
          <DdSeparator class="my-2" />
          <AIconText
            use-icon
            icon-name="i-lucide-map-pin"
            icon-class="w-4 h-4"
            custom-class="text-neutral-400"
            :text="profilesData?.profile?.location ?? ''"
          />
          <AIconText
            use-icon
            use-link
            icon-name="i-lucide-mail"
            icon-class="w-4 h-4"
            custom-class="text-neutral-400"
            :text="profilesData?.profile?.email ?? ''"
            :link-url="`mailto:${profilesData?.profile?.email ?? ''}`"
          />
          <DdSeparator class="my-2" />
          <div class="flex flex-col gap-y-2">
            <div class="flex flex-wrap items-center gap-x-2">
              <DdBadge
                :label="personalityData.type"
                variant="solid"
                color="primary"
                size="xl"
              />
            </div>
            <div
              v-if="personalityData.keywords && personalityData.keywords.length > 0"
              class="flex flex-wrap gap-2"
            >
              <DdBadge
                v-for="(keyword, index) in personalityData.keywords"
                :key="index"
                :label="keyword"
                variant="outline"
                color="secondary"
                size="lg"
              />
            </div>
          </div>
          <div
            v-if="personalityData.soft_skills && personalityData.soft_skills.length > 0"
            class="flex flex-col gap-y-2"
          >
            <h5 class="text-md font-semibold text-neutral-700 dark:text-neutral-300">
              {{ $t('dynamic.profile.softSkills') }}
            </h5>
            <div class="flex flex-wrap gap-2">
              <DdBadge
                v-for="(skill, index) in personalityData.soft_skills"
                :key="index"
                :label="skill"
                variant="outline"
                color="primary"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="personalityData"
        class="flex flex-col gap-y-4 mt-4"
      >
        <div class="flex flex-col gap-y-3">
          <p
            v-if="personalityData.description"
            class="text-base break-keep text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {{ personalityData.description }}
          </p>
        </div>
        <DdSeparator />
        <div
          v-if="personalityData.strengths && personalityData.strengths.length > 0"
          class="flex flex-col gap-y-2"
        >
          <h5 class="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            {{ $t('dynamic.profile.strengths') }}
          </h5>
          <div class="flex flex-col gap-y-3">
            <div
              v-for="(strength, index) in personalityData.strengths"
              :key="index"
              class="flex flex-col gap-y-1"
            >
              <div class="flex items-center justify-between gap-x-2">
                <div class="flex items-center gap-x-2">
                  <span class="text-lg font-semibold">
                    {{ strength.name }}
                  </span>
                </div>
                <span class="text-lg font-semibold text-primary-500">
                  {{ strength.score }}점
                </span>
              </div>
              <p class="text-sm break-keep text-neutral-600 dark:text-neutral-400">
                {{ strength.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DdCard>
  </div>
</template>
