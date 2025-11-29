<script setup lang="ts">
const props = defineProps<{
  helloList: string[]
}>()

const INTERVAL_MS = 3000

const isMounted = ref(false)
const currentHelloIndex = ref(0)
const timeoutId = ref<number | undefined>(undefined)

const currentHello = computed(() => {
  return props.helloList[currentHelloIndex.value] || props.helloList[0] || ''
})

const getRandomIndex = (): number => {
  return Math.floor(Math.random() * props.helloList.length)
}

const updateHello = () => {
  currentHelloIndex.value = getRandomIndex()
  timeoutId.value = window.setTimeout(updateHello, INTERVAL_MS)
}

const startRotation = () => {
  if (props.helloList.length > 0) {
    updateHello()
  }
}

const stopRotation = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = undefined
  }
}

onMounted(() => {
  isMounted.value = true
  startRotation()
})

onUnmounted(() => {
  stopRotation()
})
</script>

<template>
  <div class="text-6xl sm:text-8xl font-black break-keep">
    <Transition
      name="intro"
      mode="out-in"
    >
      <span
        v-if="isMounted"
        :key="currentHelloIndex"
      >
        {{ currentHello }}
      </span>
      <span
        v-else
        key="loading"
        class="opacity-0"
      >
        {{ props.helloList[0] || '' }}
      </span>
    </Transition>
  </div>
</template>
