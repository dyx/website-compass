import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import router from './router'

createApp(App).use(router).use(ElementPlus, {
  locale: zhCn
}).mount('#app')
