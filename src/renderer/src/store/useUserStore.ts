import { defineStore } from 'pinia'
import { getInfo } from '@api/user'
import { IUserInfo, Role } from '@interface/user'
import { useMenuStore } from '@store/useMenuStore'
export const useUserStore = defineStore('userId', {
  state: ():{
    roles:Role[],
    rolePerm:string,
    userInfo:Partial<IUserInfo>
  } => {
    return {
      roles:[],
      rolePerm:'',
      userInfo:{}
    }
  },
  getters:{},
  actions:{
    async  getUserInfo(){
      let res = await getInfo();
      let { permissions ,roles , units , userInfo } = res.data;
      console.log(res.data);
      // 角色信息
      this.roles = roles;
      this.rolePerm = roles[0].rolePerm;

      // 用户信息
      this.userInfo = userInfo
     
      useMenuStore().getMenu();
    }
  },
  persist: {
    enabled: true, //开启数据缓存
    strategies: [
      {
        storage: localStorage,//默认走session
        paths: ['rolePerm']
      }
    ]
  }
})