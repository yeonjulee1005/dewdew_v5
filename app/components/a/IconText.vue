<script setup lang="ts">
withDefaults(
  defineProps<{
    useIcon?: boolean
    useLink?: boolean
    linkUrl?: string
    defaultClass?: string
    customClass?: string
    textClass?: string
    iconName?: string
    iconClass?: string
    text?: string
  }>(),
  {
    useIcon: true,
    useLink: false,
    linkUrl: '',
    defaultClass: 'flex items-center gap-1',
    customClass: '',
    textClass: '',
    iconName: '',
    iconClass: 'w-6 h-6',
    text: '',
  },
)
</script>

<template>
  <div :class="`${defaultClass} ${customClass}`">
    <Icon
      v-if="useIcon && iconName"
      :name="iconName"
      :class="iconClass"
    />
    <NuxtLink
      v-if="useLink"
      :to="linkUrl"
      external
      class="hover:text-neutral-500"
    >
      {{ text }}
    </NuxtLink>
    <span
      v-else
      :class="textClass"
    >
      {{ text }}
    </span>
  </div>
</template>
