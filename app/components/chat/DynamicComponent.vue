<script setup lang="ts">
import type { ComponentType } from '~/types/chat'

defineProps<{
  componentType: ComponentType | null | undefined
  componentData: Record<string, any> | null | undefined
}>()

// 동적 컴포넌트 (Lazy Loading)
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'greeting-card': defineAsyncComponent(() => import('~/components/dynamic/card/Greeting.server.vue')),
  'profile-card': defineAsyncComponent(() => import('~/components/dynamic/card/Profile.server.vue')),
  'experience-list': defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceList.server.vue')),
  'experience-timeline': defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceTimeline.server.vue')),
  // 'skill-card': defineAsyncComponent(() => import('~/components/portfolio/SkillCard.server.vue')),
  // 'skill-radar': defineAsyncComponent(() => import('~/components/portfolio/SkillRadar.server.vue')),
  // 'project-carousel': defineAsyncComponent(() => import('~/components/portfolio/ProjectCarousel.server.vue')),
  // 'project-list': defineAsyncComponent(() => import('~/components/portfolio/ProjectList.server.vue')),
  // 'project-card': defineAsyncComponent(() => import('~/components/portfolio/ProjectCard.server.vue')),
  // 'education-card': defineAsyncComponent(() => import('~/components/portfolio/EducationCard.server.vue')),
  // 'hobby-list': defineAsyncComponent(() => import('~/components/portfolio/HobbyList.server.vue')),
  // 'social-links': defineAsyncComponent(() => import('~/components/portfolio/SocialLinks.server.vue')),
  // 'image-carousel': defineAsyncComponent(() => import('~/components/portfolio/ImageCarousel.server.vue')),
  // 'image-grid': defineAsyncComponent(() => import('~/components/portfolio/ImageGrid.server.vue')),
  // 'image-timeline': defineAsyncComponent(() => import('~/components/portfolio/ImageTimeline.server.vue')),
  // 'contact-form': defineAsyncComponent(() => import('~/components/portfolio/ContactForm.server.vue')),
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="componentType && componentType !== 'chat-response' && componentMap[componentType]"
      class="my-3 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700"
    >
      <component
        :is="componentMap[componentType]"
        :data="componentData"
      />
    </div>
  </Transition>
</template>
