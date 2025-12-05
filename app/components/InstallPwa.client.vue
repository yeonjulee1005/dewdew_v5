<template>
  <div>
    <div
      v-if="$pwa?.offlineReady || $pwa?.needRefresh"
      class="fixed flex flex-col gap-2 right-0 bottom-32 md:bottom-8 m-4 p-2 border-2 rounded-md z-20 text-left shadow-lg bg-neutral-200/80 dark:bg-neutral-700/80"
      role="alert"
    >
      <span>
        {{ $pwa.offlineReady ? $t('pwa.readyPwa') : $t('pwa.newContent') }}
      </span>
      <AButton
        v-if="$pwa.needRefresh"
        custom-class="w-fit"
        :button-text="$t('pwa.reload')"
        button-variant="outline"
        button-size="md"
        @click="$pwa.updateServiceWorker()"
      />
      <AButton
        custom-class="w-fit"
        :button-text="$t('pwa.close')"
        button-variant="outline"
        button-size="md"
        @click="$pwa.cancelPrompt()"
      />
    </div>
    <div
      v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
      class="fixed right-0 bottom-20 md:bottom-8 m-4 p-2 border-2 rounded-md z-20 text-left shadow-lg bg-neutral-200/80 dark:bg-neutral-700/80"
      role="alert"
    >
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <Icon
            class="w-10 h-10"
            name="i-akar-icons-devices"
          />
          <span>
            {{ $t('pwa.installPwa') }}
          </span>
        </div>
        <div class="flex justify-end gap-2">
          <AButton
            custom-class="gap-0"
            :button-text="$t('pwa.install')"
            button-variant="outline"
            button-size="md"
            @click="$pwa.install()"
          />
          <AButton
            custom-class="gap-0"
            :button-text="$t('pwa.cancel')"
            button-variant="outline"
            button-size="md"
            @click="$pwa.cancelInstall()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
