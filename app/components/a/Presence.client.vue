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
  <DdBadge
    variant="subtle"
    color="success"
    size="xl"
  >
    <template #leading>
      <Icon
        name="i-lucide-circle-user-round"
        class="w-4 h-4 text-green-500"
      />
    </template>
    {{ displayCount }}
  </DdBadge>
</template>
