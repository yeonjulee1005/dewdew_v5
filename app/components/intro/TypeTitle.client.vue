<script setup lang="ts">
import TypeIt from 'typeit'

const props = defineProps<{
  title: string[]
}>()

const helloIntroTitle = ref<HTMLElement | null>(null)
const isMounted = ref(false)

const typeItHello = () => {
  if (helloIntroTitle.value) {
    new TypeIt(helloIntroTitle.value, {
      strings: props.title,
      lifeLike: true,
      speed: 50,
      deleteSpeed: 30,
      loop: true,
    }).go()
  }
}

onMounted(() => {
  isMounted.value = true
  nextTick(() => {
    typeItHello()
  })
})
</script>

<template>
  <h1
    v-if="isMounted"
    ref="helloIntroTitle"
    class="text-2xl sm:text-4xl font-bold break-keep py-2"
  />
  <span
    v-else
    class="text-2xl sm:text-4xl font-bold break-keep py-2 opacity-0"
  >
    {{ title[0] }}
  </span>
</template>
