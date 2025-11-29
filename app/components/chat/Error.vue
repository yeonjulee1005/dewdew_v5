<script setup lang="ts">
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
      연결에 문제가 생겼어요
    </h3>

    <p class="text-neutral-500 mb-4">
      {{ error?.message || '채팅을 불러오는 중 오류가 발생했습니다.' }}
    </p>

    <DdButton
      color="primary"
      icon="i-lucide-refresh-cw"
      @click="$emit('retry')"
    >
      다시 시도
    </DdButton>
  </div>
</template>
