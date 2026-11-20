<script setup lang="ts">
// 블로그 홈의 기술 블로그 바로가기 카드 (content/blog/index.md 의 ::blog-tech-link)
const { t } = useI18n()
</script>

<template>
  <ProseCard
    :title="t('blog.techBlog')"
    color="primary"
    icon="i-lucide-globe"
    to="https://www.dewdew.world/tech"
    target="_blank"
  />
</template>
