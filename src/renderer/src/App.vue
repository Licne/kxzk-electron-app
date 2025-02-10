<template>
    <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import {  ref , onBeforeMount , computed , getCurrentInstance , ComponentInternalInstance } from 'vue';

// 分页国际化组件
import { VueI18n } from 'vue-i18n';
let { proxy } = getCurrentInstance() as ComponentInternalInstance;
let locale = computed(()=>{
  let i18n = proxy?.$i18n as VueI18n;
  return i18n.messages[i18n.locale].el;
})

// 换肤 初始化
onBeforeMount(()=>{
  const dark = ref<string | null>(localStorage.getItem('dark'));
  const element = document.querySelector('html') as HTMLElement | null;
  if (element) {
        if( dark.value == 'dark'  ){
            element.className = 'dark';
        }else{
            element.className = '';
        }
        dark.value = element.className;
        localStorage.setItem('dark', element.className);
    }
})

</script>

<style>
*{margin: 0;padding:0;}
a{
  text-decoration: none;
  color:#333;
}
/* // @import './assets/css/style.scss';

// *,
// *::after,
// *::before{
//     margin: 0;
//     padding: 0;
//     box-sizing: inherit;
// }

// a {
//   color:#333;
//   text-decoration: none;
// } */

</style>
