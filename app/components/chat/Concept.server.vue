<script setup lang="ts">
const { url } = useImageStorage()

const imageModalOpen = ref(false)
const selectedImageSrc = ref(url(true, '/assets/concept/chatbot-architecture.webp'))
</script>

<template>
  <div>
    <div class="flex flex-col gap-y-4 max-w-4xl mx-auto">
      <h3 class="text-2xl font-bold break-keep">
        {{ $t('aiComponents.concept.title') }}
      </h3>
      <NuxtImg
        :src="selectedImageSrc"
        class="w-full h-full object-cover rounded-md"
        format="webp"
        :quality="80"
        alt="chatbot-architecture"
        @click="imageModalOpen = true"
      />
      <div class="space-y-1.5">
        <p
          v-for="item in $tm('aiComponents.concept.description')"
          :key="item"
          class="text-lg text-neutral-500 dark:text-neutral-400 break-keep"
        >
          {{ $rt(item) }}
        </p>
      </div>
    </div>
    <!-- 이미지 모달 -->
    <DdModal
      v-model:open="imageModalOpen"
      :ui="{ content: 'max-w-dvw' }"
    >
      <template #body>
        <div class="flex justify-center items-center p-4">
          <img
            :src="selectedImageSrc"
            alt="확대된 이미지"
            class="max-w-full h-full object-contain"
            @click="imageModalOpen = false"
          >
        </div>
      </template>
    </DdModal>
  </div>
</template>
