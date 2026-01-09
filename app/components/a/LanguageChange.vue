<script setup lang="ts">
import { track } from '@vercel/analytics'

const { locale, setLocale } = useI18n()

withDefaults(
  defineProps<{
    customClass?: string
    iconLeadClass?: string
    buttonVariant?: 'solid' | 'link' | 'outline' | 'soft' | 'subtle' | 'ghost'
    ariaLabel?: string
  }>(),
  {
    customClass: '',
    iconLeadClass: 'w-8 h-8',
    buttonVariant: 'ghost',
    ariaLabel: '',
  },
)

const selectLocale = computed({
  get() {
    return locale.value
  },
  set(value) {
    setLocale(value)
    track('language_change', { locale: value })
  },
})
</script>

<template>
  <DdButton
    size="xl"
    :variant="buttonVariant"
    :icon="selectLocale === 'ko' ? 'i-circle-flags-kr' : 'i-circle-flags-us'"
    :icon-class="iconLeadClass"
    :aria-label="ariaLabel"
    @click="selectLocale = selectLocale === 'ko' ? 'en' : 'ko'"
  />
</template>
