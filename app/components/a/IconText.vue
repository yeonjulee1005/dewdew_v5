<script setup lang="ts">
withDefaults(
  defineProps<{
    useIcon?: boolean
    defaultClass?: string
    customClass?: string
    textClass?: string
    iconName?: string
    iconClass?: string
    text?: string
  }>(),
  {
    useIcon: true,
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
      v-if="useIcon"
      :name="iconName"
      :class="iconClass"
    />
    <span :class="textClass">
      {{ text }}
    </span>
  </div>
</template>
