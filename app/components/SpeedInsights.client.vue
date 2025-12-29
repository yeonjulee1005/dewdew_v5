<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue'

// Vercel 환경 체크
const isVercel = import.meta.env.VERCEL
</script>

<template>
  <SpeedInsights v-if="isVercel" />
</template>
