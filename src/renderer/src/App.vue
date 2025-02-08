<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

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
