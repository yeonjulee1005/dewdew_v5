<script setup lang="ts">
// 동적 컴포넌트 로딩 (코드 스플리팅)
const Concept = defineAsyncComponent(() => import('~/components/chat/Concept.server.vue'))
const Greeting = defineAsyncComponent(() => import('~/components/dynamic/card/Greeting.server.vue'))
const Profile = defineAsyncComponent(() => import('~/components/dynamic/card/Profile.server.vue'))
const ExperienceCarousel = defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceCarousel.server.vue'))
const ExperienceTimeline = defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceTimeline.server.vue'))
const Skill = defineAsyncComponent(() => import('~/components/dynamic/card/Skill.server.vue'))
const SkillRadar = defineAsyncComponent(() => import('~/components/dynamic/card/SkillRadar.server.vue'))
const ProjectCarousel = defineAsyncComponent(() => import('~/components/dynamic/card/ProjectCarousel.server.vue'))
const EducationCard = defineAsyncComponent(() => import('~/components/dynamic/card/EducationCard.server.vue'))
const CertificationCard = defineAsyncComponent(() => import('~/components/dynamic/card/CertificationCard.server.vue'))
const WeaknessesCard = defineAsyncComponent(() => import('~/components/dynamic/card/WeaknessesCard.server.vue'))
const HobbyCarousel = defineAsyncComponent(() => import('~/components/dynamic/card/HobbyCarousel.server.vue'))
const SocialLinks = defineAsyncComponent(() => import('~/components/dynamic/card/SocialLinks.server.vue'))
const ImageCarousel = defineAsyncComponent(() => import('~/components/dynamic/card/ImageCarousel.server.vue'))
const ThreejsCarousel = defineAsyncComponent(() => import('~/components/dynamic/card/ThreejsCarousel.server.vue'))
const ContactForm = defineAsyncComponent(() => import('~/components/dynamic/card/ContactForm.client.vue'))

const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('pageTitle.aiComponents'),
  meta: [
    { name: 'description', content: t('seoDescription.aiComponents') },
    { name: 'og:title', content: t('seoTitle.aiComponents') },
    { name: 'og:description', content: t('seoDescription.aiComponents') },
    { name: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

definePageMeta({
  layout: 'default',
})

useSchemaFaq({
  mainEntity: [
    {
      name: 'What is Dewdew AI Components?',
      acceptedAnswer: {
        text: 'Dewdew AI Components is a list of server components displayed when answering Dewdew AI.',
      },
    },
    {
      name: 'How to make Dewdew AI Components?',
      acceptedAnswer: {
        text: 'Dewdew AI Components is a list of server components displayed when answering Dewdew AI.',
      },
    },
  ],
})
</script>

<template>
  <div class="h-fit bg-white dark:bg-neutral-900 p-4 space-y-8 mb-16">
    <Concept />
    <DdSeparator />
    <h1 class="max-w-4xl mx-auto text-2xl font-bold break-keep">
      {{ $t('seoDescription.aiComponents') }}
    </h1>
    <div class="max-w-4xl mx-auto space-y-8">
      <Greeting :title="$t('aiComponents.greetingCard')" />
      <Profile :title="$t('aiComponents.profileCard')" />
      <ExperienceCarousel :title="$t('aiComponents.experienceCard')" />
      <ExperienceTimeline :title="$t('aiComponents.experienceTimeline')" />
      <SkillRadar :title="$t('aiComponents.skillRadar')" />
      <Skill :title="$t('aiComponents.skillCard')" />
      <ProjectCarousel :title="$t('aiComponents.projectCarousel')" />
      <ThreejsCarousel :title="$t('aiComponents.threejsCarousel')" />
      <EducationCard :title="$t('aiComponents.educationCard')" />
      <CertificationCard :title="$t('aiComponents.certificationCard')" />
      <WeaknessesCard :title="$t('aiComponents.weaknessesCard')" />
      <HobbyCarousel :title="$t('aiComponents.hobbyCarousel')" />
      <SocialLinks :title="$t('aiComponents.socialLinks')" />
      <ImageCarousel :title="$t('aiComponents.imageCarousel')" />
      <ContactForm :title="$t('aiComponents.contactForm')" />
    </div>
  </div>
</template>
