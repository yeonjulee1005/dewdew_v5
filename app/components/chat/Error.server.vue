<script setup lang="ts">
const { t } = useI18n()

withDefaults(
  defineProps<{
    error?: Error | null
  }>(),
  {
    error: null,
  },
)

defineEmits([
  'retry',
])
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-8 text-center">
    <DdIcon
      name="i-lucide-message-circle-warning"
      class="w-16 h-16 text-red-500 mb-4"
    />

    <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
      {{ t('ai.error.title') }}
    </h3>

    <p class="text-neutral-500 mb-4">
      {{ error?.message || t('ai.error.description') }}
    </p>

    <DdButton
      color="primary"
      size="xl"
      variant="subtle"
      icon="i-lucide-refresh-cw"
      @click="$emit('retry')"
    >
      {{ t('ai.error.tryAgain') }}
    </DdButton>
  </div>
</template>
