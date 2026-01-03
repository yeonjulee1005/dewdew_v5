<script setup lang="ts">
import { track } from '@vercel/analytics'
import Giscus from '@giscus/vue'

const { t } = useI18n()
const route = useRoute()

// 블로그 포스트의 첫 번째 이미지 URL 추출
const extractFirstImage = (blog: any): string | null => {
  if (!blog) return null

  // frontmatter에 image 필드가 있으면 우선 사용
  if (blog.image && typeof blog.image === 'string') {
    // 절대 URL이 아니면 절대 URL로 변환
    if (blog.image.startsWith('http')) {
      return blog.image
    }
    if (blog.image.startsWith('/')) {
      return `https://www.dewdew.dev${blog.image}`
    }
    return `https://www.dewdew.dev/${blog.image}`
  }

  // body에서 첫 번째 이미지 찾기
  if (blog.body?.children) {
    const findImageInChildren = (children: any[]): string | null => {
      for (const child of children) {
        if (child.type === 'element' && child.tag === 'img' && child.props?.src) {
          const src = child.props.src
          // 절대 URL이 아니면 절대 URL로 변환
          if (src.startsWith('http')) {
            return src
          }
          if (src.startsWith('/')) {
            return `https://www.dewdew.dev${src}`
          }
          return `https://www.dewdew.dev/${src}`
        }
        if (child.children && Array.isArray(child.children)) {
          const found = findImageInChildren(child.children)
          if (found) return found
        }
      }
      return null
    }
    return findImageInChildren(blog.body.children)
  }

  // content에서 정규식으로 이미지 URL 추출 (fallback)
  if (blog.content) {
    const imageMatch = blog.content.match(/!\[.*?\]\((.*?)\)/)
    if (imageMatch && imageMatch[1]) {
      const src = imageMatch[1]
      if (src.startsWith('http')) {
        return src
      }
      if (src.startsWith('/')) {
        return `https://www.dewdew.dev${src}`
      }
      return `https://www.dewdew.dev/${src}`
    }
  }

  return null
}

const { data: blog } = await useAsyncData(route.path, async () => {
  let searchPath = route.path

  // /blog 경로일 때는 index.md를 찾아야 함
  if (route.path === '/blog' || route.path === '/blog/') {
    // 먼저 /blog/index로 시도
    const indexResult = await queryCollection('blog')
      .path('/blog/index')
      .first()
    if (indexResult) return indexResult

    // /blog/index로 찾지 못하면 /blog로 시도
    const blogResult = await queryCollection('blog')
      .path('/blog')
      .first()
    if (blogResult) return blogResult

    // 여전히 찾지 못하면 모든 포스트를 가져와서 index.md 찾기
    const allPosts = await queryCollection('blog').all()
    const foundIndex = allPosts.find((post: any) => {
      const postId = post.id || ''
      const postPath = post.path || ''
      return postId === 'blog/index'
        || postId === 'index'
        || postPath === '/blog/index'
        || postPath === '/blog'
        || post.title === 'Blog Home'
    })
    if (foundIndex) return foundIndex

    searchPath = '/blog'
  }

  // 일반 경로로 검색 (예: /blog/20260102)
  const result = await queryCollection('blog')
    .path(searchPath)
    .first()
  if (result) return result

  // 경로로 찾지 못한 경우, where 절로 파일명으로 검색 시도
  if (searchPath.startsWith('/blog/') && searchPath !== '/blog' && searchPath !== '/blog/index') {
    const fileName = searchPath.replace('/blog/', '')

    // id 필드로 검색 시도 (blog/20260102 형식)
    const foundById = await queryCollection('blog')
      .where('id', '=', `blog/${fileName}`)
      .first()
    if (foundById) return foundById

    // path 필드로 검색 시도
    const foundByPath = await queryCollection('blog')
      .where('path', '=', searchPath)
      .first()
    if (foundByPath) return foundByPath

    // 모든 포스트를 가져와서 수동 검색
    const allPosts = await queryCollection('blog').all()
    const foundPost = allPosts.find((post: any) => {
      const postId = post.id || ''
      const postPath = post.path || ''
      return postId === `blog/${fileName}`
        || postId === fileName
        || postPath === searchPath
        || postPath === `/blog/${fileName}`
        || postId.includes(fileName)
    })
    if (foundPost) return foundPost
  }

  // 블로그 포스트를 찾을 수 없으면 404 에러 발생
  if (searchPath !== '/blog' && searchPath !== '/blog/index') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Blog post not found',
    })
  }

  // /blog 경로인데 index.md를 찾지 못한 경우 null 반환
  return null
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

// og:image URL 계산
const ogImage = computed(() => {
  const imageUrl = extractFirstImage(blog.value)
  return imageUrl || 'https://www.dewdew.dev/assets/dewdew.webp'
})

// SEO 메타 태그 설정 (blog가 로드된 후에 호출)
useHead({
  title: computed(() => blog.value?.title || t('pageTitle.blog')),
  meta: computed(() => {
    const baseMeta = [
      { name: 'description', content: blog.value?.description || t('seoDescription.blog') },
      { property: 'og:title', content: blog.value?.title || t('seoTitle.blog') },
      { property: 'og:description', content: blog.value?.description || t('seoDescription.blog') },
      { property: 'og:url', content: `https://www.dewdew.dev${route.path}` },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: ogImage.value },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/webp' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: ogImage.value },
    ]

    // 블로그 포스트인 경우 추가 메타 태그
    if (blog.value && !blog.value.id?.includes('index')) {
      baseMeta.push(
        { property: 'article:published_time', content: blog.value.date ? new Date(blog.value.date).toISOString() : '' },
        { property: 'article:author', content: blog.value.author || '이연주' },
      )
      if (blog.value.tags && Array.isArray(blog.value.tags)) {
        blog.value.tags.forEach((tag: string) => {
          baseMeta.push({ property: 'article:tag', content: tag })
        })
      }
    }

    return baseMeta
  }),
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

// Accordion items 생성
const accordionItems = computed(() => {
  if (!navigation.value || navigation.value.length === 0) {
    return []
  }

  return navigation.value.map(link => ({
    label: t('blog.recentPost'),
    value: link.path,
    trailingIcon: 'i-lucide-chevron-down',
    children: link.children || [],
  }))
})

// ContentRenderer가 렌더링한 후 이미지에 blog-image 클래스 추가
const blogContentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    if (blogContentRef.value) {
      const images = blogContentRef.value.querySelectorAll('img')
      images.forEach((img) => {
        if (!img.classList.contains('blog-image')) {
          img.classList.add('blog-image')
        }
        // width, height 속성을 style로 적용 (CSS가 속성을 오버라이드하는 경우 대비)
        if (img.hasAttribute('width') && !img.style.width) {
          const width = img.getAttribute('width')
          if (width) {
            img.style.width = width.includes('px') ? width : `${width}px`
          }
        }
        if (img.hasAttribute('height') && !img.style.height) {
          const height = img.getAttribute('height')
          if (height) {
            img.style.height = height.includes('px') ? height : `${height}px`
          }
        }
      })
    }
  })
})

watch(() => blog.value, () => {
  nextTick(() => {
    if (blogContentRef.value) {
      const images = blogContentRef.value.querySelectorAll('img')
      images.forEach((img) => {
        if (!img.classList.contains('blog-image')) {
          img.classList.add('blog-image')
        }
        // width, height 속성을 style로 적용 (CSS가 속성을 오버라이드하는 경우 대비)
        if (img.hasAttribute('width') && !img.style.width) {
          const width = img.getAttribute('width')
          if (width) {
            img.style.width = width.includes('px') ? width : `${width}px`
          }
        }
        if (img.hasAttribute('height') && !img.style.height) {
          const height = img.getAttribute('height')
          if (height) {
            img.style.height = height.includes('px') ? height : `${height}px`
          }
        }
      })
    }
  })
})
</script>

<template>
  <DdPage>
    <template #right>
      <DdContentToc
        v-if="blog?.title !== 'Blog Home'"
        title="목차"
        :links="(blog?.body?.toc as any)?.links"
        highlight
        highlight-color="neutral"
        :ui="{
          root: 'mx-4 sticky top-0',
        }"
        @click:link="track('toc_click', { link: $event.target.href })"
      />
      <DdAccordion
        v-if="navigation && blog?.id.includes('index') && navigation.length > 0"
        :items="accordionItems"
        :ui="{
          root: 'px-4',
          item: 'border-l-2 border-amber-300/50 pl-2',
          trigger: 'py-1.5 text-lg font-semibold',
          body: 'flex flex-col gap-2 pt-2',
        }"
      >
        <template #body="{ item }">
          <NuxtLink
            v-for="(child, index) in item.children"
            :key="index"
            class="text-sm cursor-pointer hover:text-amber-600 hover:dark:text-amber-400 transition-colors duration-200 ease-in-out break-keep"
            :to="child.path"
            @click="track('recent_post_click', { post: child.title })"
          >
            {{ child.title }}
          </NuxtLink>
        </template>
      </DdAccordion>
    </template>
    <div class="w-full flex flex-col gap-y-4 px-4">
      <h1
        v-if="blog && !blog.id?.includes('index')"
        class="text-4xl font-bold text-amber-500 break-keep mt-2"
      >
        {{ blog.title }}
      </h1>
      <NuxtTime
        v-if="blog?.date"
        :datetime="blog.date"
        class="text-lg text-right"
      />
      <div
        ref="blogContentRef"
        class="blog-content"
      >
        <ContentRenderer
          v-if="blog"
          :value="blog"
        />
        <div
          v-else
          class="text-center py-8"
        >
          <p class="text-lg text-neutral-600 dark:text-neutral-400">
            블로그 포스트를 찾을 수 없습니다.
          </p>
        </div>
      </div>
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

<style scoped>
/* 블로그 콘텐츠 내의 이미지 스타일 */
.blog-content :deep(img) {
  /* 기본 스타일: 최대 높이 제한 */
  max-height: 680px;
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
