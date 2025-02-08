import { defineStore } from "pinia";
import { useUserStore } from "./useUserStore";
import { useMenuStore } from "./useMenuStore";
import { useTagStore } from "./useTagStore";
export const useStore = defineStore('storeId', {
    state: () => {
      return {
        user:useUserStore(),//用户
        menu:useMenuStore(),//菜单
        tag:useTagStore(),//标签
      }
    },
    getters:{},
    actions:{}
  })