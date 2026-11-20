<script setup lang="ts">
// 블로그 홈 제목 + 소개 callout (content/blog/index.md 의 ::blog-intro)
// 고정 문구라 마크다운 대신 i18n(blog.*)으로 사이트 언어에 맞춰 표시한다
const { t } = useI18n()
</script>

<template>
  <ProseH1 id="blog-home">
    {{ t('blog.title') }}
  </ProseH1>
  <ProseCallout
    icon="i-lucide-notebook-pen"
    color="primary"
  >
    {{ t('blog.introLine1') }}<br>
    <i18n-t
      keypath="blog.introLine2"
      tag="span"
      scope="global"
    >
      <template #nuxtContent>
        <ProseA
          href="https://content.nuxt.com/"
          target="_blank"
        >
          Nuxt Content
        </ProseA>
      </template>
      <template #markdown>
        <ProseCode>markdown</ProseCode>
      </template>
    </i18n-t>
  </ProseCallout>
</template>
