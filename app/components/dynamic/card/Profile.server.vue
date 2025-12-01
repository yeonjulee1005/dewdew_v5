<script setup lang="ts">
const { url } = useImageStorage()

const { data: profilesData } = await useFetch('/api/resume/profile', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})
</script>

<template>
  <DdCard
    variant="subtle"
    :ui="{ body: 'p-2 sm:p-4' }"
  >
    <div class="flex flex-col items-start gap-y-4">
      <NuxtImg
        :src="url(true, profilesData?.profile?.avatar_url?.split('/public')[1] ?? '')"
        class="w-fit h-full object-contain max-h-100 rounded-md"
        format="webp"
        :quality="80"
        alt="greeting"
      />
      <div class="flex flex-col items-start gap-y-1">
        <h3 class="flex items-end gap-x-2">
          <span class="text-xl font-bold">
            {{ profilesData?.profile?.full_name }}
          </span>
          <span class="text-md font-normal text-neutral-400">
            {{ profilesData?.profile?.title }}
          </span>
        </h3>
        <h3 class="flex items-end gap-x-2">
          <span class="text-md font-bold">
            재직중:
          </span>
          <span class="text-md">
            {{ profilesData?.experience?.company_name }}
          </span>
          <span class="text-md">
            {{ profilesData?.experience?.position }}
          </span>
        </h3>
        <AIconText
          use-icon
          icon-name="i-lucide-map-pin"
          icon-class="w-4 h-4"
          custom-class="text-neutral-400"
          :text="profilesData?.profile?.location ?? ''"
        />
        <AIconText
          use-icon
          use-link
          icon-name="i-lucide-mail"
          icon-class="w-4 h-4"
          custom-class="text-neutral-400"
          :text="profilesData?.profile?.email ?? ''"
          :link-url="`mailto:${profilesData?.profile?.email ?? ''}`"
        />
      </div>
    </div>
  </DdCard>
</template>
