<script setup lang="ts">
const colorMode = useColorMode()

withDefaults(
  defineProps<{
    customClass?: string
    iconLeadClass?: string
    buttonVariant?: 'solid' | 'link' | 'outline' | 'soft' | 'subtle' | 'ghost'
  }>(),
  {
    customClass: '',
    iconLeadClass: 'w-8 h-8',
    buttonVariant: 'outline',
  },
)

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <DdButton
    :class="customClass"
    :variant="buttonVariant"
    size="xl"
    :icon="isDark ? 'i-lucide-moon-star' : 'i-lucide-sun'"
    :icon-class="iconLeadClass"
    @click="isDark = !isDark"
  />
</template>
