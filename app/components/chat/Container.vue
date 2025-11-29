<script setup lang="ts">
import ChatContent from './Content.vue'
import ChatSkeleton from './Skeleton.vue'
import ChatError from './Error.vue'

const { initError, loadGreeting } = useChat()
</script>

<template>
  <div class="h-full">
    <!-- 에러 상태 -->
    <ChatError
      v-if="initError"
      :error="initError"
      @retry="loadGreeting"
    />

    <!-- 정상 상태 -->
    <Suspense v-else>
      <ChatContent />

      <template #fallback>
        <ChatSkeleton />
      </template>
    </Suspense>
  </div>
</template>
