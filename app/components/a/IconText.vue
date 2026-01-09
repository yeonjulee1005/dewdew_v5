<script setup lang="ts">
const props = withDefaults(
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

const containerClass = computed(() => {
  const classes = [props.defaultClass]
  if (props.customClass && props.customClass.trim()) {
    classes.push(props.customClass)
  }
  return classes.join(' ')
})
</script>

<template>
  <div :class="containerClass">
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
      v-else-if="props.textClass && props.textClass.trim()"
      :class="props.textClass"
    >
      {{ text }}
    </span>
    <span v-else>
      {{ text }}
    </span>
  </div>
</template>
