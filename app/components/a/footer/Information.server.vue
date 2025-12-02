<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
  <div class="w-full flex flex-col items-center gap-y-0.5">
    <span class="text-center text-xs break-keep">
      {{ $t('texts.copyright') }}
    </span>
    <div class="flex items-center gap-x-2">
      <NuxtLink
        class="text-center text-xs break-keep text-amber-500 cursor-pointer hover:text-amber-400"
        to="https://www.dewdew.world"
        external
      >
        {{ $t('texts.dewdewWorld') }}
      </NuxtLink>
      <span class="text-center text-xs break-keep">
        {{ $t('texts.designed') }}
      </span>
    </div>
    <span class="text-center text-xs break-keep">
      {{ $t('texts.version', { version: config.public.appVersion.replaceAll('"', '') }) }}
    </span>
  </div>
</template>
