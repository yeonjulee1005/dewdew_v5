<script setup lang="ts">
const { count, isConnected } = usePresence()

const displayCount = computed(() => {
  if (!isConnected.value) {
    return '0'
  }
  return count.value
})
</script>

<template>
  <!-- Badge에는 ghost variant가 없어 soft + 투명 배경으로 ghost 스타일 적용 -->
  <DdBadge
    variant="soft"
    class="bg-transparent"
    :color="isConnected ? 'success' : 'warning'"
    size="xl"
    :title="$t('texts.liveVisitors')"
  >
    <template #leading>
      <!-- 연결됨: 초록 / 연결 전·끊김: 노랑 -->
      <span class="relative flex size-2.5">
        <span
          class="absolute inline-flex size-full animate-ping rounded-full opacity-60"
          :class="isConnected ? 'bg-green-500' : 'bg-yellow-500'"
        />
        <span
          class="relative inline-flex size-2.5 rounded-full"
          :class="isConnected ? 'bg-green-500' : 'bg-yellow-500'"
        />
      </span>
    </template>
    {{ displayCount }}
  </DdBadge>
</template>
