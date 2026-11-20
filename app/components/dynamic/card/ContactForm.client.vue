<script setup lang="ts">
import { track } from '@vercel/analytics'

import { object, string, type InferType } from 'yup'
import { send } from '@emailjs/browser'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const config = useRuntimeConfig()
const { patterns } = useValidation()
const emailRegex = patterns.email

const props = withDefaults(
  defineProps<{
    title?: string
    // AI 응답 언어 (ISO 639-1). 없으면 사이트 locale
    lang?: string
  }>(),
  {
    title: '',
  },
)

const { ct } = await useContentLocale(() => props.lang)

const schema = object({
  name: string()
    .min(2, ct('messages.nameFormat'))
    .max(20, ct('messages.nameFormat'))
    .required(ct('messages.nameRequire')),
  email: string()
    .required(ct('messages.emailRequire'))
    .matches(emailRegex, ct('messages.emailFormat')),
  message: string()
    .min(20, ct('messages.contentFormat'))
    .required(ct('messages.contentRequire')),
})

type Schema = InferType<typeof schema>

const formData = reactive({
  name: '',
  email: '',
  message: '',
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!event.isTrusted) {
    return
  }

  track('contact_form_submit', { name: event.data.name, email: event.data.email, message: event.data.message })

  try {
    await send(
      'dewdew',
      config.public.emailJSsTemplate,
      event.data,
      config.public.emailJsKey,
    )
    toast.add({ title: ct('messages.successEmailSend'), color: 'success' })
    // 폼 초기화
    formData.name = ''
    formData.email = ''
    formData.message = ''
  }
  catch (error) {
    console.error('Email send error:', error)
    toast.add({ title: ct('messages.failEmailSend'), color: 'error' })
  }
}
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <h3
      v-if="title"
      class="text-xl font-bold"
    >
      {{ title }}
    </h3>
    <DdCard :ui="{ body: 'p-2.5 sm:p-4' }">
      <div class="flex flex-col gap-y-4">
        <h3 class="text-2xl font-bold">
          {{ ct('dynamic.contact.title') }}
        </h3>

        <DdForm
          class="max-w-2xl flex flex-col gap-y-4"
          :schema="schema"
          :state="formData"
          @submit="onSubmit"
        >
          <DdFormField
            name="name"
            size="xl"
            :label="ct('texts.name')"
            required
          >
            <DdInput
              v-model="formData.name"
              class="w-full"
              size="xl"
              :placeholder="ct('placeholder.inputName')"
            />
          </DdFormField>

          <DdFormField
            name="email"
            size="xl"
            :label="ct('texts.email')"
            required
          >
            <DdInput
              v-model="formData.email"
              type="email"
              class="w-full"
              size="xl"
              :placeholder="ct('placeholder.inputEmail')"
            />
          </DdFormField>

          <DdFormField
            name="message"
            size="xl"
            :label="ct('texts.message')"
            required
          >
            <DdTextarea
              v-model="formData.message"
              class="w-full"
              size="xl"
              :rows="5"
              autoresize
              :placeholder="ct('placeholder.inputContent')"
            />
          </DdFormField>

          <div class="w-fit">
            <DdButton
              class="min-w-24"
              block
              type="submit"
              size="xl"
              variant="solid"
              color="primary"
            >
              {{ ct('texts.send') }}
            </DdButton>
          </div>
        </DdForm>
      </div>
    </DdCard>
  </div>
</template>
