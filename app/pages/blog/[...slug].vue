<script setup lang="ts">
import Giscus from '@giscus/vue'

const { t } = useLocale()
const route = useRoute()

useHead({
  title: t('pageTitle.blog'),
  meta: [
    { property: 'description', content: t('seoDescription.blog') },
    { property: 'og:title', content: t('seoTitle.blog') },
    { property: 'og:description', content: t('seoDescription.blog') },
    { property: 'og:url', content: `https://www.dewdew.dev${route.path}` },
  ],
})

const { data: blog } = await useAsyncData(route.path, () => {
  return queryCollection('blog')
    .path(route.path)
    .first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('blog', route.path, {
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
        :links="blog?.body?.toc?.links"
        highlight
        highlight-color="neutral"
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
        class="text-4xl font-bold text-amber-500 break-keep mt-8"
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
        repo="yeonjulee1005/dewdew_v4"
        repo-id="R_kgDONZHIhA"
        category="Blog"
        category-id="DIC_kwDONZHIhM4Ck7BA"
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
