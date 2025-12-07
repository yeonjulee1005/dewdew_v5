<script setup lang="ts">
import Concept from '~/components/chat/Concept.server.vue'
import Greeting from '~/components/dynamic/card/Greeting.server.vue'
import Profile from '~/components/dynamic/card/Profile.server.vue'
import ExperienceCarousel from '~/components/dynamic/card/ExperienceCarousel.server.vue'
import ExperienceTimeline from '~/components/dynamic/card/ExperienceTimeline.server.vue'
import Skill from '~/components/dynamic/card/Skill.server.vue'
import SkillRadar from '~/components/dynamic/card/SkillRadar.server.vue'
import ProjectCarousel from '~/components/dynamic/card/ProjectCarousel.server.vue'
import EducationCard from '~/components/dynamic/card/EducationCard.server.vue'
import WeaknessesCard from '~/components/dynamic/card/WeaknessesCard.server.vue'
import HobbyCarousel from '~/components/dynamic/card/HobbyCarousel.server.vue'
import SocialLinks from '~/components/dynamic/card/SocialLinks.server.vue'
import ImageCarousel from '~/components/dynamic/card/ImageCarousel.server.vue'
import ContactForm from '~/components/dynamic/card/ContactForm.client.vue'

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
  <div class="h-fit bg-neutral-50 dark:bg-neutral-900 p-4 space-y-8">
    <Concept />
    <DdSeparator />
    <p class="max-w-4xl mx-auto text-2xl font-bold break-keep">
      {{ $t('seoDescription.aiComponents') }}
    </p>
    <div class="max-w-4xl mx-auto space-y-8">
      <Greeting :title="$t('aiComponents.greetingCard')" />
      <Profile :title="$t('aiComponents.profileCard')" />
      <ExperienceCarousel :title="$t('aiComponents.experienceCard')" />
      <ExperienceTimeline :title="$t('aiComponents.experienceTimeline')" />
      <Skill :title="$t('aiComponents.skillCard')" />
      <SkillRadar :title="$t('aiComponents.skillRadar')" />
      <ProjectCarousel :title="$t('aiComponents.projectCarousel')" />
      <EducationCard :title="$t('aiComponents.educationCard')" />
      <WeaknessesCard :title="$t('aiComponents.weaknessesCard')" />
      <HobbyCarousel :title="$t('aiComponents.hobbyCarousel')" />
      <SocialLinks :title="$t('aiComponents.socialLinks')" />
      <ImageCarousel :title="$t('aiComponents.imageCarousel')" />
      <ContactForm :title="$t('aiComponents.contactForm')" />
    </div>
  </div>
</template>
