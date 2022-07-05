import router from "@/router";
import NProgress from 'nprogress'
router.beforeEach((to, form, next) => {
    // 判断是否已登录
    NProgress.start()
    const userToken = localStorage.getItem("userToken")
    if(to.path == '/login' ){
        next()
    }else{
        //未登录禁入系统
        userToken ? next():next('/login')         
    }
})
router.afterEach((to, form, next) => {
    NProgress.done()
})