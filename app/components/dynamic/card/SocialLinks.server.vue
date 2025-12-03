<script setup lang="ts">
const { data: socialLinksData } = await useFetch('/api/resume/socialLinks', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})
</script>

<template>
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">
        {{ $t('dynamic.social.title', '소셜 링크') }}
      </h3>
      <div
        v-if="socialLinksData && socialLinksData.length > 0"
        class="flex flex-wrap gap-3 justify-center"
      >
        <DdButton
          v-for="(link, index) in socialLinksData"
          :key="index"
          :to="link.url"
          target="_blank"
          variant="outline"
          size="lg"
          color="primary"
          class="flex items-center gap-x-2"
        >
          <template #leading>
            <Icon
              v-if="link.icon_url"
              :name="link.icon_url"
              class="w-8 h-8 text-primary-500 dark:text-primary-400"
            />
            <Icon
              v-else
              :name="`i-logos-${link.platform.toLowerCase()}-icon`"
              class="w-8 h-8 text-primary-500 dark:text-primary-400"
            />
          </template>
          <span class="text-lg font-medium">
            {{ link.platform }}
          </span>
        </DdButton>
      </div>
      <div
        v-else
        class="text-sm text-neutral-500 dark:text-neutral-500"
      >
        {{ $t('dynamic.social.empty', '소셜 링크 정보가 없습니다.') }}
      </div>
    </div>
  </DdCard>
</template>
