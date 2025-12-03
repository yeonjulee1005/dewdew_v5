<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import { send } from '@emailjs/browser'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const config = useRuntimeConfig()
const { t } = useI18n()
const { patterns } = useValidation()
const emailRegex = patterns.email

const schema = object({
  name: string()
    .min(2, t('messages.nameFormat'))
    .max(20, t('messages.nameFormat'))
    .required(t('messages.nameRequire')),
  email: string()
    .required(t('messages.emailRequire'))
    .matches(emailRegex, t('messages.emailFormat')),
  message: string()
    .min(20, t('messages.contentFormat'))
    .required(t('messages.contentRequire')),
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

  try {
    await send(
      'dewdew',
      config.public.emailJSsTemplate,
      event.data,
      config.public.emailJsKey,
    )
    toast.add({ title: t('messages.successEmailSend'), color: 'success' })
    // 폼 초기화
    formData.name = ''
    formData.email = ''
    formData.message = ''
  }
  catch (error) {
    console.error('Email send error:', error)
    toast.add({ title: t('messages.failEmailSend'), color: 'error' })
  }
}
</script>

<template>
  <DdCard :ui="{ body: 'p-2 sm:p-4' }">
    <div class="flex flex-col gap-y-4">
      <p class="text-lg text-neutral-600 dark:text-neutral-400">
        {{ $t('dynamic.contact.description', '이메일을 통해 연락해주세요!') }}
      </p>

      <DdForm
        class="flex flex-col gap-y-4"
        :schema="schema"
        :state="formData"
        @submit="onSubmit"
      >
        <DdFormField
          name="name"
          size="lg"
          :label="$t('texts.name', '이름')"
          required
        >
          <DdInput
            v-model="formData.name"
            class="w-full"
            size="xl"
            :placeholder="$t('placeholder.inputName', '성함을 입력해주세요.')"
          />
        </DdFormField>

        <DdFormField
          name="email"
          size="lg"
          :label="$t('texts.email', '이메일')"
          required
        >
          <DdInput
            v-model="formData.email"
            type="email"
            class="w-full"
            size="xl"
            :placeholder="$t('placeholder.inputEmail', '이메일을 적어주세요!')"
          />
        </DdFormField>

        <DdFormField
          name="message"
          size="lg"
          :label="$t('texts.message', '메시지')"
          required
        >
          <DdTextarea
            v-model="formData.message"
            class="w-full"
            size="xl"
            :rows="5"
            autoresize
            :placeholder="$t('placeholder.inputContent', '내용을 입력해주세요.')"
          />
        </DdFormField>

        <DdButton
          type="submit"
          block
          size="xl"
          variant="solid"
          color="primary"
        >
          {{ $t('texts.send', '보내기') }}
        </DdButton>
      </DdForm>
    </div>
  </DdCard>
</template>
