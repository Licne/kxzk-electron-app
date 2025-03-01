import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// element 
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@views': resolve('src/renderer/src/views'),
        '@store': resolve('src/renderer/src/store'),
        '@router': resolve('src/renderer/src/router'),
        '@components': resolve('src/renderer/src/components'),
        '@utils': resolve('src/renderer/src/utils'),
        '@api': resolve('src/renderer/src/api'),
        '@interface': resolve('src/renderer/src/interface'),
        '@layout':resolve('src/renderer/src/layout'),
        '@hooks':resolve('src/renderer/src/hooks'),
        '@mixins':resolve('src/renderer/src/mixins'),
        '@directives':resolve('src/renderer/src/directives'),
      }
    },
    server:{
      "proxy":{
        "/api":{
          target:'http://uat.crm.xuexiluxian.cn',
          changeOrigin:true,
          rewrite: path =>  path.replace(/^\/api/,'')
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ]
  }
})

