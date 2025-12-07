<script setup lang="ts">
const { isMobile } = useDevice()

withDefaults(
  defineProps<{
    hideTooltip?: boolean
    useFlexAuto?: boolean
    customClass?: string
    labelClass?: string
    customStyle?: { [key: string]: string } | string
    buttonCustomPadding?: string
    roundButton?: boolean
    buttonDisabled?: boolean
    buttonPadding?: boolean
    buttonBlock?: boolean
    buttonTruncate?: boolean
    buttonLoading?: boolean
    buttonType?: 'button' | 'submit' | 'reset'
    buttonColor?: 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | undefined
    buttonSize?: 'md' | 'sm' | 'xs' | 'lg' | 'xl' | undefined
    buttonVariant?: 'solid' | 'link' | 'outline' | 'soft' | 'subtle' | 'ghost' | undefined
    useLeading?: boolean
    useTrailing?: boolean
    useIcon?: boolean
    useImage?: boolean
    useLeadingCircleCount?: boolean
    leadingCircleCount?: number
    leadingCircleClass?: string
    iconLeadName?: string
    iconLeadClass?: string
    iconTrailName?: string
    iconTrailClass?: string
    imageUrl?: string
    imageSize?: number
    imageClass?: string
    imageTrailUrl?: string
    imageTrailSize?: number
    imageTrailClass?: string
    buttonText?: string
    tooltipText?: string
    tooltipArrow?: boolean
    tooltipSide?: 'bottom' | 'top' | 'right' | 'left' | undefined
    tooltipDefaultOpen?: boolean
    tooltipAlwaysOpen?: boolean
    shortcutsText?: Array<string>
  }>(),
  {
    hideTooltip: false,
    useFlexAuto: false,
    customClass: 'flex items-center justify-center gap-0 w-11 h-11',
    customStyle: '',
    buttonCustomPadding: '',
    labelClass: '',
    roundButton: false,
    buttonDisabled: false,
    buttonPadding: true,
    buttonBlock: false,
    buttonTruncate: false,
    buttonLoading: false,
    buttonColor: 'neutral',
    buttonSize: 'lg',
    buttonType: 'button',
    buttonVariant: 'solid',
    useLeading: false,
    useTrailing: false,
    useLeadingCircleCount: false,
    leadingCircleCount: 0,
    leadingCircleClass: 'w-4 h-4',
    useIcon: false,
    useImage: false,
    iconLeadName: '',
    iconLeadClass: 'w-6 h-6',
    iconTrailName: '',
    iconTrailClass: 'w-6 h-6',
    imageUrl: '',
    imageSize: 30,
    imageClass: '',
    imageTrailUrl: '',
    imageTrailSize: 30,
    imageTrailClass: '',
    buttonText: '',
    tooltipText: '',
    tooltipArrow: false,
    tooltipSide: 'bottom',
    tooltipDefaultOpen: false,
    tooltipAlwaysOpen: false,
    shortcutsText: () => [],
  },
)

defineEmits([
  'click:button',
  'mouseenter:button',
  'mouseleave:button',
])
</script>

<template>
  <DdTooltip
    :text="tooltipText ? tooltipText : buttonText"
    :style="customStyle"
    :shortcuts="shortcutsText"
    :arrow="tooltipArrow"
    :default-open="tooltipDefaultOpen"
    :v-model:open="tooltipAlwaysOpen"
    :portal="false"
    :content="{
      align: 'center',
      side: tooltipSide,
    }"
    :ui="{
      content: (!tooltipText && !buttonText) || hideTooltip ? 'hidden' : 'pointer-coarse:hidden h-6 px-2 py-1 text-xs font-normal truncate relative z-10',
    }"
  >
    <DdButton
      :class="[
        customClass,
        roundButton ? 'rounded-full' : 'rounded-md',
        buttonVariant === 'outline' ? 'text-neutral-500 dark:text-neutral-500 ring-neutral-300 dark:ring-neutral-300 focus:ring-neutral-400 dark:focus:ring-neutral-400' : '',
        buttonSize === 'xl' && isMobile ? 'text-sm' : buttonSize === 'xl' ? 'text-base' : '',
        buttonCustomPadding || '',
        'cursor-pointer',
      ]"
      :disabled="buttonDisabled"
      :block="buttonBlock"
      :truncate="buttonTruncate"
      :padded="buttonPadding"
      :color="buttonColor"
      :type="buttonType"
      :loading="buttonLoading"
      :size="buttonSize"
      :variant="buttonVariant"
      :aria-label="buttonText"
      @click="$emit('click:button')"
      @mouseenter="$emit('mouseenter:button')"
      @mouseleave="$emit('mouseleave:button')"
    >
      <span
        v-if="buttonText"
        :class="labelClass"
      >
        {{ buttonText }}
      </span>
      <div
        v-if="useLeading && useTrailing && useFlexAuto"
        class="flex-auto"
      />
      <template
        v-if="useLeading && !buttonLoading"
        #leading
      >
        <Icon
          v-if="useIcon"
          :name="iconLeadName"
          :class="iconLeadClass"
        />
        <NuxtImg
          v-if="useImage"
          :class="imageClass"
          :src="imageUrl"
          :width="imageSize"
          :height="imageSize"
          :sizes="`${imageSize}px`"
          format="webp"
          :quality="80"
          :alt="buttonText || 'Button image'"
          loading="lazy"
        />
        <span
          v-if="useLeadingCircleCount"
          class="text-sm rounded-full bg-amber-500 text-white w-6 h-6 flex items-center justify-center"
          :class="leadingCircleClass"
        >
          {{ leadingCircleCount }}
        </span>
      </template>
      <template
        v-if="useTrailing"
        #trailing
      >
        <Icon
          v-if="useIcon"
          :class="iconTrailClass"
          :name="iconTrailName"
        />
        <NuxtImg
          v-if="useImage"
          :class="imageTrailClass"
          :src="imageTrailUrl"
          :width="imageTrailSize"
          :height="imageTrailSize"
          :sizes="`${imageTrailSize}px`"
          format="webp"
          :quality="80"
          :alt="buttonText || 'Button image'"
          loading="lazy"
        />
      </template>
    </DdButton>
  </DdTooltip>
</template>
