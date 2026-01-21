<script setup lang="ts">
import { track } from '@vercel/analytics'

import ChatDynamicComponent from './DynamicComponent.vue'
import type { ChatMessage, ComponentType } from '~/types/chat'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

// UIMessage를 확장한 커스텀 타입
// DdChatMessages의 message 슬롯에서 받는 타입에 componentType과 componentData 추가
type ExtendedUIMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text' | 'reasoning'
    text: string
  }>
  componentType?: ComponentType | null
  componentData?: Record<string, unknown> | null
}

const { isMobile } = useDevice()
const { width } = useWindowSize()
const { url } = useImageStorage()
const { t } = useI18n()
const {
  messages,
  status,
  isStreaming,
  streamingText,
  currentComponent,
  selectedModel,
  availableModels,
  setModel,
  sendMessage,
  stop,
} = useChat()

const inputMessage = ref('')
const imageModalOpen = ref(false)
const selectedImageSrc = ref('')

const suggestions = [
  '자기소개 해줘요!',
  '최근 경력이 어떻게 되요?',
  '어떤 기술적인 고민들을 하고있나요?',
  '앞으로의 커리어 패스를 어떻게 가져가고 싶어요?',
  '최근 진행했던 프로젝트를 알려주세요!',
  'WebGL도 관심이 있나요?',
  '학력이 어떻게 되요?',
  '어떤 기술 스택을 즐겨 사용해요?',
  '보유한 자격증이 있나요?',
  '커피챗 하고싶어요!',
  'Github에서 어떤 오픈소스에 기여했었는지 살펴봐줘!',
  '취미가 뭐에요? 평소에 어떤것을 하면서 리프레쉬 하고 있어요?',
  '소셜 링크들을 알려주세요!',
  '이 웹사이트는 어떻게 만들었어요?',
  '부족한 점이나 단점이 있다면 알려줄 수 있어요?',
  '종합적으로 생각했을때, 듀듀는 어떤 개발자 인가요?',
]

const suggestionItems = computed(() => {
  return suggestions.map((suggestion, index) => ({
    label: suggestion,
    value: String(index),
  }))
})

const selectedSuggestion = ref<string>()

const messagesContainer = ref<HTMLElement>()
const suggestionsContainer = ref<HTMLElement>()
let mutationObserver: MutationObserver | null = null
let enhanceTimeout: ReturnType<typeof setTimeout> | null = null

// Nuxt UI ChatMessages 형식으로 메시지 변환
const uiMessages = computed(() => {
  const converted = messages.value.map((msg: ChatMessage) => {
    const result = {
      id: msg.id,
      role: msg.role,
      parts: [
        {
          type: 'text' as const,
          text: msg.content,
        },
      ],
      componentType: msg.componentType,
      componentData: msg.componentData,
    }
    return result
  })
  return converted
})

// 스트리밍 중일 때 임시 메시지 추가
const displayMessages = computed(() => {
  if (!isStreaming.value || !streamingText.value) {
    return uiMessages.value
  }

  const streamingMessage = {
    id: 'streaming',
    role: 'assistant' as const,
    parts: [
      {
        type: 'text' as const,
        text: streamingText.value,
      },
    ],
    componentType: currentComponent.value?.type,
    componentData: currentComponent.value?.data,
  }

  return [
    ...uiMessages.value,
    streamingMessage,
  ]
})

// 스트리밍 텍스트 변경 감지 (자동 스크롤 트리거)
watch(streamingText, () => {
  // 스트리밍 중일 때만 처리
  if (isStreaming.value) {
    // DOM 업데이트 후 DdChatMessages가 자동 스크롤을 처리하도록 nextTick 사용
    nextTick(() => {
      // DdChatMessages의 should-auto-scroll이 작동하도록 약간의 지연
      // 실제 스크롤은 DdChatMessages 내부에서 처리됨
    })
  }
}, { flush: 'post' })

// 이미지 처리 함수 (클릭 이벤트만 추가, 스타일은 CSS로 처리)
const enhanceImage = (img: HTMLImageElement) => {
  // 이미 처리된 이미지인지 확인
  if (img.hasAttribute('data-enhanced')) {
    return
  }

  img.setAttribute('data-enhanced', 'true')

  // 클릭 이벤트 추가 (중복 방지를 위해 기존 리스너 제거 후 추가)
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    selectedImageSrc.value = img.src
    imageModalOpen.value = true
  }

  // 기존 클릭 이벤트 제거 후 새로 추가
  img.removeEventListener('click', handleClick)
  img.addEventListener('click', handleClick)
}

// MDC 렌더링 후 DOM 조작 (최소한의 조작만 수행)
const enhanceMDCContent = () => {
  if (!messagesContainer.value) return

  // 링크에 target="_blank" 추가
  const links = messagesContainer.value.querySelectorAll('a:not([target])')
  links.forEach((link) => {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })

  // 이미지 클릭 이벤트만 추가 (스타일은 CSS로 처리)
  const images = messagesContainer.value.querySelectorAll('img:not([data-enhanced])')
  images.forEach((imgElement) => {
    enhanceImage(imgElement as HTMLImageElement)
  })
}

// 지연된 DOM 조작 (debounce) - 스트리밍 중에는 실행하지 않음
const scheduleEnhance = () => {
  // 스트리밍 중에는 DOM 조작을 하지 않아 스크롤 방해 방지
  if (isStreaming.value) return

  if (enhanceTimeout) {
    clearTimeout(enhanceTimeout)
  }

  enhanceTimeout = setTimeout(() => {
    nextTick(() => {
      enhanceMDCContent()
    })
  }, 100)
}

const handleSubmit = async () => {
  if (!inputMessage.value.trim() || isStreaming.value) return

  track('message_submit', { message: inputMessage.value })

  const message = inputMessage.value
  inputMessage.value = ''

  await sendMessage(message)
}

const handleSuggestion = (suggestion: string) => {
  track('suggestion_click', { suggestion })

  inputMessage.value = suggestion
  handleSubmit()
}

// 좌우 스크롤 함수
const scrollSuggestions = (direction: 'left' | 'right') => {
  track('scroll_suggestions', { direction })

  if (!suggestionsContainer.value) return
  const scrollAmount = 300 // 스크롤 거리
  const currentScroll = suggestionsContainer.value.scrollLeft
  const targetScroll = direction === 'left'
    ? currentScroll - scrollAmount
    : currentScroll + scrollAmount

  suggestionsContainer.value.scrollTo({
    left: targetScroll,
    behavior: 'smooth',
  })
}

// 스크롤 가능 여부 확인 (반응형 업데이트를 위한 force update)
const scrollUpdateTrigger = ref(0)

const canScrollLeft = computed(() => {
  // 의존성 추가를 위한 참조
  void scrollUpdateTrigger.value
  if (!suggestionsContainer.value) return false
  return suggestionsContainer.value.scrollLeft > 0
})

const canScrollRight = computed(() => {
  // 의존성 추가를 위한 참조
  void scrollUpdateTrigger.value
  if (!suggestionsContainer.value) return false
  const { scrollLeft, scrollWidth, clientWidth } = suggestionsContainer.value
  return scrollLeft < scrollWidth - clientWidth - 1
})

// 스크롤 이벤트 핸들러
const handleSuggestionsScroll = () => {
  scrollUpdateTrigger.value++
}

// Select 변경 핸들러
const handleSelectChange = (value: string) => {
  track('suggestion_click', { suggestion: value })

  const selectedItem = suggestionItems.value.find(item => item.value === value)
  if (selectedItem) {
    handleSuggestion(selectedItem.label)
    selectedSuggestion.value = undefined // 선택 후 초기화
  }
}

// 모델 변경 핸들러
const handleModelChange = (value: string) => {
  const model = availableModels.find(m => m.model === value)
  if (model) {
    track('model_select', { model: model.label })

    setModel(model)
  }
}

// MutationObserver로 DOM 변경 감지 (스트리밍 중에는 비활성화)
const setupMutationObserver = () => {
  if (!messagesContainer.value || mutationObserver) return

  mutationObserver = new MutationObserver(() => {
    // 스트리밍 중에는 관찰하지 않음
    if (!isStreaming.value) {
      scheduleEnhance()
    }
  })

  mutationObserver.observe(messagesContainer.value, {
    childList: true,
    subtree: true,
    attributes: false,
  })
}

// 메시지 변경 시 DOM 조작 (스트리밍 중에는 제외)
watch([displayMessages, isStreaming], () => {
  // 스트리밍 중이 아닐 때만 DOM 조작
  if (!isStreaming.value) {
    scheduleEnhance()
  }
}, { deep: true })

// 스트리밍 완료 시에도 DOM 조작
watch(isStreaming, (newVal, oldVal) => {
  if (oldVal === true && newVal === false) {
    // 스트리밍 완료 후 약간의 지연
    setTimeout(() => {
      scheduleEnhance()
    }, 150)
  }
})

// 컨테이너 마운트 시 Observer 설정
watch(messagesContainer, (container) => {
  if (container) {
    setupMutationObserver()
    // 초기 렌더링 대기
    nextTick(() => {
      setTimeout(() => {
        enhanceMDCContent()
      }, 50)
    })
  }
}, { immediate: true })

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
  if (enhanceTimeout) {
    clearTimeout(enhanceTimeout)
    enhanceTimeout = null
  }
})
</script>

<template>
  <div
    class="flex flex-col overflow-hidden bg-white dark:bg-neutral-900"
    :class="[isMobile ? 'h-[calc(100vh-148px)]' : 'h-[calc(100vh-320px)]']"
  >
    <!-- 메시지 영역 -->
    <div
      ref="messagesContainer"
      class="flex-1 min-h-0 overflow-y-auto"
    >
      <DdChatMessages
        :messages="displayMessages"
        :status="status"
        auto-scroll-icon="i-lucide-arrow-down"
        should-auto-scroll
        :auto-scroll="{
          color: 'primary',
          size: 'xl',
          variant: 'subtle',
        }"
        :user="{
          variant: 'subtle',
          side: 'right',
          ui: {
            content: 'text-lg break-keep bg-neutral-200/50 dark:bg-neutral-800/50 ring-0',
          },
        }"
        :assistant="{
          variant: 'subtle',
          side: 'left',
          ui: {
            root: isMobile ? 'max-w-full ' : 'max-w-[80%]',
            content: 'text-lg break-keep bg-amber-100 dark:bg-amber-600/50 ring-0',
          },
        }"
        :ui="{
          autoScroll: isMobile ? 'bottom-46' : 'bottom-54',
        }"
      >
        <!-- Assistant 메시지 Avatar -->
        <template #leading="{ message }">
          <DdAvatar
            v-if="message.role === 'assistant'"
            :src="url(true, '/assets/logo/dewdew_v4_logo.webp')"
            size="xl"
            :alt="t('texts.logo')"
          />
        </template>
        <!-- 🆕 생각 중 인디케이터 -->
        <template #indicator>
          <div class="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 py-2 px-4">
            <DdAvatar
              :src="url(true, '/assets/logo/dewdew_v4_logo.webp')"
              size="sm"
              :alt="t('texts.logo')"
            />
            <div class="flex items-center gap-1.5">
              <Icon
                name="i-svg-spinners-3-dots-bounce"
                class="w-5 h-5 text-amber-500"
              />
              <span class="text-sm">생각중이에요...</span>
            </div>
          </div>
        </template>
        <template #content="{ message }">
          <div class="flex flex-col gap-2 w-full">
            <!-- 마크다운 메시지 (스트리밍 중에도 MDC 사용) -->
            <div class="break-keep prose prose-sm dark:prose-invert max-w-none *:first:mt-0 *:last:mb-0 [&_img]:max-h-[200px] [&_img]:cursor-pointer [&_img]:object-contain [&_img]:w-auto [&_img]:h-auto">
              <MDC
                :value="getTextFromMessage(message)"
                :cache-key="message.id === 'streaming' ? `streaming-${streamingText.length}` : message.id"
                class="prose"
              />
              <!-- 스트리밍 커서 (스트리밍 중일 때만 표시) -->
              <Icon
                v-if="message.id === 'streaming' && isStreaming"
                name="i-svg-spinners-gooey-balls-1"
                class="inline-block w-4 h-4 text-primary-500 animate-pulse ml-0.5 align-middle"
              />
            </div>
            <ChatDynamicComponent
              v-if="(message as ExtendedUIMessage).componentType"
              :component-type="(message as ExtendedUIMessage).componentType"
              :component-data="(message as ExtendedUIMessage).componentData"
              class="w-full"
            />
          </div>
        </template>
      </DdChatMessages>
    </div>

    <!-- 입력 영역 -->
    <div class="p-4 space-y-4">
      <!-- 추천 질문 -->
      <div
        v-if="!isMobile"
        class="relative -mx-4 px-4"
      >
        <!-- 왼쪽 스크롤 버튼 -->
        <DdButton
          v-if="canScrollLeft"
          icon="i-lucide-chevron-left"
          variant="ghost"
          color="neutral"
          size="lg"
          :aria-label="$t('ai.scrollLeft')"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-90 dark:bg-neutral-900/80 backdrop-blur-sm cursor-pointer"
          @click="scrollSuggestions('left')"
        />
        <!-- 오른쪽 스크롤 버튼 -->
        <DdButton
          v-if="canScrollRight"
          icon="i-lucide-chevron-right"
          variant="ghost"
          color="neutral"
          size="lg"
          :aria-label="$t('ai.scrollRight')"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-90 dark:bg-neutral-900/80 backdrop-blur-sm cursor-pointer"
          @click="scrollSuggestions('right')"
        />
        <!-- 추천 질문 컨테이너 -->
        <div
          ref="suggestionsContainer"
          :class="[
            'flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            canScrollLeft ? 'ml-10' : 'ml-0',
            canScrollRight ? 'mr-10' : 'mr-0',
          ]"
          @scroll="handleSuggestionsScroll"
        >
          <DdButton
            v-for="suggestion in suggestions"
            :key="suggestion"
            variant="soft"
            color="neutral"
            size="xl"
            class="bg-neutral-200/50 dark:bg-neutral-800/50 shrink-0 whitespace-nowrap"
            @click="handleSuggestion(suggestion)"
          >
            {{ suggestion }}
          </DdButton>
        </div>
      </div>

      <!-- 입력창 -->
      <DdChatPrompt
        v-model="inputMessage"
        class="bg-neutral-200/50 dark:bg-neutral-800/50 ring-0"
        :placeholder="$t('ai.placeholder')"
        :disabled="isStreaming"
        :maxrows="3"
        :autoresize="true"
        variant="subtle"
        :ui="{
          root: isMobile ? 'gap-2' : 'gap-0',
          base: width < 360 ? 'text-lg' : 'text-xl',
          body: 'break-keep',
          footer: 'pt-2',
          trailing: 'pe-0',
        }"
        @submit="handleSubmit"
      >
        <template #header>
          <DdSelect
            v-if="isMobile"
            v-model="selectedSuggestion"
            class="w-96"
            :class="[isMobile ? '' : 'hidden']"
            :items="suggestionItems"
            placeholder="Quick 질문"
            value-key="value"
            size="xl"
            variant="outline"
            color="neutral"
            trailing-icon="i-lucide-chevron-up"
            :aria-label="$t('ai.quickQuestion')"
            :content="{
              side: 'top',
              sideOffset: 16,
            }"
            :ui="{
              base: 'bg-neutral-200/50 dark:bg-neutral-800/50 w-fit',
              placeholder: 'text-neutral-500 dark:text-neutral-400',
              value: 'break-keep whitespace-break-spaces',
              itemLabel: 'break-keep whitespace-normal truncate',
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
            }"
            @update:model-value="handleSelectChange"
          >
            <template #item-label="{ item }">
              <span class="break-keep whitespace-normal pe-11">
                {{ item.label }}
              </span>
            </template>
          </DdSelect>
        </template>
        <template #trailing>
          <div class="flex items-center h-full">
            <DdChatPromptSubmit
              :status="status"
              icon="i-lucide-send"
              size="xl"
              @stop="stop"
              @reload="() => {}"
            />
          </div>
        </template>
        <template #footer>
          <div class="flex items-center flex-wrap gap-1.5">
            <DdSelect
              :model-value="selectedModel.model"
              :items="availableModels"
              class="w-42"
              placeholder="모델 선택"
              value-key="model"
              size="md"
              variant="ghost"
              color="neutral"
              :aria-label="$t('ai.selectModel')"
              :ui="{
                base: 'w-fit text-md',
                itemLabel: 'text-md',
              }"
              @update:model-value="handleModelChange"
            >
              <template #leading>
                <Icon
                  :name="selectedModel.icon"
                  class="w-5 h-5"
                />
              </template>
              <template #item-leading="{ item }">
                <Icon
                  :name="item.icon"
                  class="w-5 h-5"
                />
              </template>
            </DdSelect>
            <span
              :class="[
                isMobile ? 'text-sm' : 'text-md',
                'text-neutral-500 dark:text-neutral-400',
              ]"
            >
              {{ selectedModel.label }}
            </span>
          </div>
        </template>
      </DdChatPrompt>
    </div>

    <!-- 이미지 모달 -->
    <DdModal
      v-model:open="imageModalOpen"
      :ui="{ content: 'max-w-4xl' }"
      :title="$t('ai.imageModal', '확대된 이미지')"
    >
      <template #body>
        <div class="flex justify-center items-center p-4">
          <img
            :src="selectedImageSrc"
            alt="확대된 이미지"
            class="max-w-full max-h-[80vh] object-contain"
            @click="imageModalOpen = false"
          >
        </div>
      </template>
    </DdModal>
  </div>
</template>

<style lang="scss" scoped>
:deep(.prose) {
  p {
    margin: 0.5rem 0;
    line-height: 1.5;
  }
}
</style>
