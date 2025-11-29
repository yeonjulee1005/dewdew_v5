import { defineStore } from 'pinia'
import type { MenuDatabase } from '~/types/database.types'

export const useMenuStore = defineStore('useMenuStore', () => {
  /**
   * ! Pinia State !
   *
   * @param externalMenu 외부 메뉴 데이터
   *
   */

  const externalMenu = ref<MenuDatabase['menu']['Tables']['externalMenu']['Row'][]>()

  return {
    externalMenu,
  }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
