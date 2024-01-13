import { defineStore } from 'pinia'


export const useBaseStore = defineStore('base', {
  state: () => {
    return {
      w: null,
      h: null,
      isShowAppStyle: false
    }
  }
})

