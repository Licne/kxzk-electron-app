// import './assets/main.css'
import 'element-plus/theme-chalk/index.css'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

// 路由
import router from './router'
// 状态管理 pinia 持久
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const store = createPinia();
store.use(piniaPluginPersist)

// icon 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

import i18n from './locales'

app.use(router).use(store).use(i18n).mount('#app')
