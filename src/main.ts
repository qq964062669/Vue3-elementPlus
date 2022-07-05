import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from "element-plus/lib/locale/lang/zh-cn";  //引入element 中文包
import '@/utils/route' //路由守卫
import 'font-awesome/css/font-awesome.css'
import '@styles/public.scss'
import 'nprogress/nprogress.css'
import '@styles/base.scss'
import NProgress from 'nprogress'
import App from './App.vue'
import store from '@/store/index'
import router from './router/index'
import axios from "axios"
import VueAxios from 'vue-axios'
//main.ts文件
import * as ElIconModules from '@element-plus/icons'


const app = createApp(App)

for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}
app.use(router).use(store).use(ElementPlus,{locale}).use(NProgress).use(VueAxios,axios)
app.mount('#app')

