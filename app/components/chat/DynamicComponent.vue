<script setup lang="ts">
import type { ComponentType } from '~/types/chat'

const props = defineProps<{
  componentType: ComponentType | null | undefined
  componentData: Record<string, any> | null | undefined
  // 응답 언어 (ISO 639-1). 카드가 이 언어로 콘텐츠·라벨·날짜를 표시한다
  lang?: string | null
}>()

// 동적 컴포넌트 (Lazy Loading)
const componentMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'greeting-card': defineAsyncComponent(() => import('~/components/dynamic/card/Greeting.server.vue')),
  'profile-card': defineAsyncComponent(() => import('~/components/dynamic/card/Profile.server.vue')),
  'experience-list': defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceCarousel.server.vue')),
  'experience-timeline': defineAsyncComponent(() => import('~/components/dynamic/card/ExperienceTimeline.server.vue')),
  'skill-card': defineAsyncComponent(() => import('~/components/dynamic/card/Skill.server.vue')),
  'skill-radar': defineAsyncComponent(() => import('~/components/dynamic/card/SkillRadar.server.vue')),
  'certification-card': defineAsyncComponent(() => import('~/components/dynamic/card/CertificationCard.server.vue')),
  'project-carousel': defineAsyncComponent(() => import('~/components/dynamic/card/ProjectCarousel.server.vue')),
  'education-card': defineAsyncComponent(() => import('~/components/dynamic/card/EducationCard.server.vue')),
  'weaknesses-card': defineAsyncComponent(() => import('~/components/dynamic/card/WeaknessesCard.server.vue')),
  'hobby-carousel': defineAsyncComponent(() => import('~/components/dynamic/card/HobbyCarousel.server.vue')),
  'social-links': defineAsyncComponent(() => import('~/components/dynamic/card/SocialLinks.server.vue')),
  'contact-form': defineAsyncComponent(() => import('~/components/dynamic/card/ContactForm.client.vue')),
  'image-carousel': defineAsyncComponent(() => import('~/components/dynamic/card/ImageCarousel.server.vue')),
  'threejs-carousel': defineAsyncComponent(() => import('~/components/dynamic/card/ThreejsCarousel.server.vue')),
}

// 스켈레톤 높이 (실제 카드 높이에 맞춤)
const SKELETON_SIZE: Partial<Record<ComponentType, 'sm' | 'md' | 'lg'>> = {
  'greeting-card': 'sm',
  'social-links': 'sm',
  'profile-card': 'lg',
  'experience-list': 'lg',
  'experience-timeline': 'lg',
  'project-carousel': 'lg',
  'image-carousel': 'lg',
  'threejs-carousel': 'lg',
  'hobby-carousel': 'lg',
}
const skeletonSize = computed(() => (props.componentType && SKELETON_SIZE[props.componentType]) || 'md')
// 한국어 외 언어는 최초 번역이 수 초 걸릴 수 있다
const isTranslating = computed(() => !!props.lang && props.lang !== 'ko')

// 컴포넌트 렌더링 조건 체크
const shouldRender = computed(() => {
  if (!props.componentType || props.componentType === 'chat-response') {
    return false
  }
  if (!componentMap[props.componentType]) {
    return false
  }
  return true
})
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
      v-if="shouldRender"
      class="my-3 rounded-xl overflow-hidden"
    >
      <!-- 카드는 top-level await(useFetch·번역)로 준비되므로 그동안 스켈레톤 표시 -->
      <Suspense>
        <component
          :is="componentMap[componentType!]"
          :data="componentData"
          :lang="lang ?? undefined"
        />
        <template #fallback>
          <ChatCardSkeleton
            :size="skeletonSize"
            :translating="isTranslating"
          />
        </template>
      </Suspense>
    </div>
  </Transition>
</template>
