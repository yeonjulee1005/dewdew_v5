<script setup lang="ts">
import ChatContent from './Content.vue'
import ChatSkeleton from './Skeleton.server.vue'
import ChatError from './Error.server.vue'

const { initError, loadGreeting } = useChat()
</script>

<template>
  <div class="h-fit">
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
