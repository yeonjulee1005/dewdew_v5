<script setup lang="ts">
const { helloList } = useHelloList()

const INTERVAL_MS = 3000

// SSR·하이드레이션은 첫 인사말(index 0)로 동일하게 그리고, 마운트 후 일정 간격으로 무작위 교체
const currentHelloIndex = ref(0)
const timeoutId = ref<number | undefined>(undefined)

const currentHello = computed(() => {
  return helloList[currentHelloIndex.value] || helloList[0] || ''
})

const getRandomIndex = (): number => {
  return Math.floor(Math.random() * helloList.length)
}

const updateHello = () => {
  currentHelloIndex.value = getRandomIndex()
  timeoutId.value = window.setTimeout(updateHello, INTERVAL_MS)
}

const startRotation = () => {
  if (helloList.length > 0) {
    timeoutId.value = window.setTimeout(updateHello, INTERVAL_MS)
  }
}

const stopRotation = () => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = undefined
  }
}

onMounted(() => {
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
      <span :key="currentHelloIndex">
        {{ currentHello }}
      </span>
    </Transition>
  </div>
</template>
