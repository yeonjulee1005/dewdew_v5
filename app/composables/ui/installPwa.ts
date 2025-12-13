export const useInstallPwa = () => {
  const { t } = useI18n()

  const pwa = usePWA()
  const toast = useToast()

  const readyToUsePwaToast = () => {
    toast.add({
      title: t('pwa.readyPwa'),
      description: 'PWA 설치 완료',
      color: 'success',
      duration: 3000,
      actions: [
        {
          size: 'md' as const,
          variant: 'outline' as const,
          color: 'warning' as const,
          label: t('pwa.close'),
          onClick: () => {
            pwa?.cancelPrompt()
          },
        },
      ],
      ui: {
        actions: 'gap-3',
      },
    })
  }

  const reloadPwaToast = () => {
    toast.add({
      title: t('pwa.newContent'),
      description: 'PWA 설치 완료',
      color: 'info',
      duration: 3000,
      actions: [
        {
          size: 'md' as const,
          variant: 'solid' as const,
          color: 'warning' as const,
          label: t('pwa.reload'),
          onClick: () => {
            pwa?.updateServiceWorker()
          },
        },
        {
          size: 'md' as const,
          variant: 'outline' as const,
          color: 'warning' as const,
          label: t('pwa.close'),
          onClick: () => {
            pwa?.cancelPrompt()
          },
        },
      ],
      ui: {
        actions: 'gap-3',
      },
    })
  }

  const installPwaToast = () => {
    toast.add({
      title: t('pwa.installPwa'),
      description: 'PWA 설치 완료',
      color: 'info',
      duration: 3000,
      actions: [
        {
          size: 'md' as const,
          variant: 'solid' as const,
          color: 'warning' as const,
          label: t('pwa.install'),
          onClick: () => {
            pwa?.install()
          },
        },
        {
          size: 'md' as const,
          variant: 'outline' as const,
          color: 'warning' as const,
          label: t('pwa.cancel'),
          onClick: () => {
            pwa?.cancelPrompt()
          },
        },
      ],
      ui: {
        actions: 'gap-3',
      },
    })
  }

  // PWA 상태 감시 헬퍼 함수
  const watchPwaState = (
    getValue: () => boolean | Ref<boolean> | undefined,
    onTrue: () => void,
  ) => {
    if (!import.meta.client) {
      return
    }

    const hasShown = ref(false)

    watch(() => {
      if (!pwa) {
        return false
      }

      const value = getValue()
      if (value === undefined) {
        return false
      }

      return typeof value === 'object' && 'value' in value
        ? (value as Ref<boolean>).value
        : (value as boolean)
    }, (newVal) => {
      if (newVal && !hasShown.value) {
        hasShown.value = true
        onTrue()
      }
      else if (!newVal) {
        hasShown.value = false
      }
    }, { immediate: true })
  }

  // PWA 상태 감시 초기화
  const watchPwaStates = () => {
    watchPwaState(
      () => pwa?.needRefresh,
      reloadPwaToast,
    )

    watchPwaState(
      () => pwa?.offlineReady,
      readyToUsePwaToast,
    )

    watchPwaState(
      () => pwa?.showInstallPrompt,
      installPwaToast,
    )
  }

  return {
    readyToUsePwaToast,
    reloadPwaToast,
    installPwaToast,
    watchPwaStates,
  }
}
