//hooks文件

import { useUserStore  } from '@store/useUserStore'
import { useMenuStore } from '@store/useMenuStore'
import { UserRuleForm , PhoneCodeForm , PhoneRuleForm, ILoginRequest } from '@interface/login'


import router from '@router'

const useLogin = async ( token)=>{
   //1. 存储token
   localStorage.setItem('TOKEN', token );
   //2. 获取用户信息 ==> 数据的存储和重构是在别的地方
   await useUserStore().getUserInfo();
   //3. 获取路由 ==> 数据的存储和重构是在别的地方  
   await useMenuStore().getMenu();
   //4. 进入后台管理系统首页
   router.push('/');
}

export default useLogin;