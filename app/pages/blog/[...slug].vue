<script setup lang="ts">
import { track } from '@vercel/analytics'
import Giscus from '@giscus/vue'

const { t } = useI18n()
const route = useRoute()

useHead({
  title: t('pageTitle.blog'),
  meta: [
    { name: 'description', content: t('seoDescription.blog') },
    { name: 'og:title', content: t('seoTitle.blog') },
    { name: 'og:description', content: t('seoDescription.blog') },
    { name: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

useSchemaFaq({
  mainEntity: [
    {
      name: 'What is Dewdew Blog?',
      acceptedAnswer: {
        text: 'Dewdew Blog is an Development Tech retrospective blog.',
      },
    },
  ],
})

const { data: blog } = await useAsyncData(route.path, async () => {
  // /blog 경로일 때 index.md를 찾기 위해 경로 정규화
  // Nuxt Content에서 blog/index.md는 /blog/index 또는 /blog 경로로 매핑될 수 있음
  let searchPath = route.path

  if (route.path === '/blog' || route.path === '/blog/') {
    // 먼저 /blog/index 시도
    const indexResult = await queryCollection('blog')
      .path('/blog/index')
      .first()
    if (indexResult) return indexResult

    // 없으면 /blog 시도
    searchPath = '/blog'
  }

  return queryCollection('blog')
    .path(searchPath)
    .first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, async () => {
  // /blog 경로일 때 index.md를 찾기 위해 경로 정규화
  let searchPath = route.path
  if (route.path === '/blog' || route.path === '/blog/') {
    // 먼저 /blog/index 시도
    const indexResult = await queryCollection('blog')
      .path('/blog/index')
      .first()
    if (indexResult) {
      searchPath = '/blog/index'
    }
    else {
      searchPath = '/blog'
    }
  }

  return queryCollectionItemSurroundings('blog', searchPath, {
    fields: ['title'],
  }).order('date', 'DESC')
})

const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('blog')
    .order('date', 'DESC')
})
</script>

<template>
  <DdPage class="mx-2">
    <template #right>
      <DdContentToc
        v-if="blog?.title !== 'Blog Home'"
        title="목차"
        :links="(blog?.body?.toc as any)?.links"
        highlight
        highlight-color="neutral"
        class="sticky top-0"
        @click:link="track('toc_click', { link: $event.target.href })"
      />
      <ul v-if="navigation && blog?.id.includes('index')">
        <li
          v-for="link in navigation"
          :key="link.path"
          class="w-fit"
        >
          <div class="min-w-fit w-48 h-fit flex flex-col gap-2 px-2 py-1 mt-2 mx-2 my-4 border-l-2 border-amber-300/50">
            <span
              v-if="navigation.length"
              class="text-xl font-semibold"
            >
              {{ $t('blog.recentPost') }}
            </span>
            <NuxtLink
              v-for="(child, index) of link.children"
              :key="index"
              class="text-lg break-keep cursor-pointer hover:text-amber-600 hover:dark:text-amber-400 transition-colors duration-200 ease-in-out"
              :to="child.path"
              @click="track('recent_post_click', { post: child.title })"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </li>
      </ul>
    </template>
    <div class="w-full flex flex-col gap-y-4 px-4">
      <h1
        v-if="!blog?.id.includes('index')"
        class="text-4xl font-bold text-amber-500 break-keep mt-2"
      >
        {{ blog?.title }}
      </h1>
      <NuxtTime
        v-if="blog?.date"
        :datetime="blog.date"
        class="text-lg text-right"
      />
      <ContentRenderer
        v-if="blog"
        :value="blog"
      />
      <DdContentSurround :surround="(surround as any)" />
      <Giscus
        v-if="blog?.path !== '/blog'"
        id="comments"
        repo="yeonjulee1005/dewdew_v5"
        repo-id="R_kgDOQcC63w"
        category="General"
        category-id="DIC_kwDOQcC6384Czn_h"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        theme="transparent_dark"
        lang="ko"
        loading="lazy"
        crossorigin="anonymous"
        async
        class="mt-8"
      />
    </div>
  </DdPage>
</template>
