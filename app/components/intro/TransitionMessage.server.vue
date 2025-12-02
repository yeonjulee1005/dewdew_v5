<script setup lang="ts">
import IntroTransitionMessageClient from './TransitionMessage.client.vue'

const { helloList } = useHelloList()
</script>

<template>
  <IntroTransitionMessageClient :hello-list="helloList" />
</template>
