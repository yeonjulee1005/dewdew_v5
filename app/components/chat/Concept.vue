<script setup lang="ts">
// AI 채팅 시스템 구조 소개 — 인터랙티브 아키텍처 다이어그램 + 단계별 설명
// 단계 선택·블록 클릭 등 클라이언트 상호작용이 필요하므로 server component(.server.vue)가 아닌 일반 컴포넌트로 둔다.
// 다이어그램·설명 수정: ChatArchitectureDiagram + i18n aiComponents.concept.{overview,stages,diagram}
</script>

<template>
  <div class="flex flex-col gap-y-4 max-w-5xl mx-auto">
    <h3 class="text-2xl font-bold break-keep">
      {{ $t('aiComponents.concept.title') }}
    </h3>
    <ChatArchitectureDiagram />
  </div>
</template>
