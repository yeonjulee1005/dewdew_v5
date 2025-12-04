<script setup lang="ts">
import Greeting from '~/components/dynamic/card/Greeting.server.vue'
import Profile from '~/components/dynamic/card/Profile.server.vue'
import ExperienceList from '~/components/dynamic/card/ExperienceList.server.vue'
import ExperienceTimeline from '~/components/dynamic/card/ExperienceTimeline.server.vue'
import Skill from '~/components/dynamic/card/Skill.server.vue'
import SkillRadar from '~/components/dynamic/card/SkillRadar.server.vue'
import ProjectList from '~/components/dynamic/card/ProjectList.server.vue'
import ProjectCarousel from '~/components/dynamic/card/ProjectCarousel.server.vue'
import ProjectCard from '~/components/dynamic/card/ProjectCard.server.vue'
import EducationCard from '~/components/dynamic/card/EducationCard.server.vue'
import WeaknessesCard from '~/components/dynamic/card/WeaknessesCard.server.vue'
import HobbyCarousel from '~/components/dynamic/card/HobbyCarousel.server.vue'
import SocialLinks from '~/components/dynamic/card/SocialLinks.server.vue'
import ImageCarousel from '~/components/dynamic/card/ImageCarousel.server.vue'

const { t } = useI18n()

useHead({
  title: t('pageTitle.aiComponents'),
  meta: [
    { name: 'description', content: t('seoDescription.aiComponents') },
  ],
})

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="h-fit bg-neutral-50 dark:bg-neutral-900 p-4">
    <div class="max-w-4xl mx-auto space-y-4">
      <!-- Greeting Card -->
      <Greeting />

      <!-- Profile Card -->
      <Profile />

      <!-- Experience List -->
      <ExperienceList />

      <!-- Experience Timeline -->
      <ExperienceTimeline />

      <!-- Skill Card -->
      <Skill />

      <!-- Skill Radar -->
      <SkillRadar />

      <!-- Project List -->
      <ProjectList />

      <!-- Project Carousel -->
      <ProjectCarousel />

      <!-- Project Card -->
      <ProjectCard />

      <!-- Education Card -->
      <EducationCard />

      <!-- Weaknesses Card -->
      <WeaknessesCard />

      <!-- Hobby Carousel -->
      <HobbyCarousel />

      <!-- Social Links -->
      <SocialLinks />

      <!-- Image Carousel -->
      <ImageCarousel />
    </div>
  </div>
</template>
