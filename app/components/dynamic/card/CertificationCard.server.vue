<script setup lang="ts">
const { isDesktopOrTablet } = useDevice()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: '',
  },
)

const { data: certificationData } = await useFetch('/api/resume/certification', {
  method: 'GET',
  headers: useRequestHeaders(['cookie']),
  immediate: true,
  dedupe: 'defer',
})

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

const handleCertificationClick = (url: string | null | undefined) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ $t('dynamic.certification.title', '인증서') }}
        </h3>
        <DdPageGrid
          v-if="certificationData && certificationData.length > 0"
          class="grid-cols-1 sm:grid-cols-1 lg:grid-cols-2"
        >
          <DdPageCard
            v-for="(certification, index) in certificationData"
            :key="index"
            :title="certification.title"
            icon="i-lucide-external-link"
            orientation="vertical"
            variant="outline"
            :to="certification.credential_url || undefined"
            target="_blank"
            :ui="{
              title: 'text-xl font-bold',
              description: 'text-sm text-neutral-600 dark:text-neutral-400',
            }"
            @click="certification.credential_url && handleCertificationClick(certification.credential_url)"
          >
            <template #description>
              <div class="flex flex-col gap-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <p
                    v-if="certification.description"
                    class="text-lg text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed break-keep"
                  >
                    {{ certification.description }}
                  </p>
                  <DdSeparator
                    v-if="certification.issuer && (certification.issue_date || certification.expiry_date) && isDesktopOrTablet"
                    orientation="vertical"
                    class="h-4"
                  />
                  <div
                    v-if="certification.issue_date || certification.expiry_date"
                    class="flex flex-wrap items-center gap-2 text-md text-neutral-700 dark:text-neutral-300"
                  >
                    <span v-if="certification.issue_date">
                      발급일: {{ formatDate(certification.issue_date) }}
                    </span>
                    <span
                      v-if="certification.issue_date && certification.expiry_date"
                      class="text-neutral-500 dark:text-neutral-400"
                    >
                      ~
                    </span>
                    <span v-if="certification.expiry_date">
                      만료일: {{ formatDate(certification.expiry_date) }}
                    </span>
                  </div>
                </div>
                <DdSeparator v-if="certification.description" />
                <span
                  v-if="certification.issuer"
                  class="text-md text-neutral-600 dark:text-neutral-400"
                >
                  {{ certification.issuer }}
                </span>
              </div>
            </template>
          </DdPageCard>
        </DdPageGrid>
        <div
          v-else
          class="text-sm text-neutral-500 dark:text-neutral-400"
        >
          {{ $t('dynamic.certification.empty', '인증서가 없습니다.') }}
        </div>
      </div>
    </DdCard>
  </div>
</template>
