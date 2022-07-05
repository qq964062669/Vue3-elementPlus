<template>
    <div class="main">
        <el-container class="main-content">
            <el-aside class="first-nav">
                <!-- 路由导航 -->
                <nav-menu />
            </el-aside>
            <el-container class="main-content-page">
                <el-header >
                    <!-- 面包屑 -->
                    <nav-header :breadCrumbInfo="breadCrumbInfo"/>
                </el-header>
                <el-main>
                    <router-view v-slot="{ Component }">
                        <div class="content">
                            <transition>
                                <keep-alive include="chat">
                                    <component :is="Component"></component>
                                </keep-alive>
                            </transition>
                        </div>
                    </router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script lang="ts">
import NavMenu from "@layout/components/nav-menu";
import NavHeader from "@layout/components/nav-header";
import { defineComponent ,reactive,ref, toRefs} from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name:"主布局",
    props:{},
    components:{
        NavMenu,
        NavHeader
    },
    setup(){
        let data = reactive({
            breadCrumbInfo:"" as any
        })
        const $router = useRouter();
        $router.afterEach(()=>{
           data.breadCrumbInfo = ref($router.currentRoute.value.matched)
           
        })
        if(!data.breadCrumbInfo){
               data.breadCrumbInfo = ref($router.currentRoute.value.matched)
        }
        return{
            ...toRefs(data)
        }
    }
})
</script>
<style scoped lang="scss">
@import "@styles/element-ui.scss";
.main {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    &-content {
        height: 100%;
        background-color: #f6f6f6;
        overflow: hidden;
        &-page {
            position: relative;
            padding-top: 60px;
            width: calc(100% - 280px);
            height: 100%;
            box-sizing: border-box;
            overflow: hidden;
            @media screen and (-webkit-min-device-pixel-ratio: 1.1) {
                width: calc(100% - 260px);
            }
            /*顶部*/
            .el-header {
                position: absolute;
                z-index: 999;
                top: 0;
                left: 0;
                width: 100%;
                line-height: 60px;
                background-color: #ffffff;
            }
            /*主内容区*/
            .el-main {
                padding: 0;
                min-height: 100%;
                overflow-x: hidden;
                overflow-y: auto;
                /*中间*/
                .content {
                    padding-top: 0px;
                    box-sizing: border-box;
                    min-height: calc(100% - 40px);
                }
            }
        }
    }
    .el-aside {
        width: 230px !important;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: $menuBg;
        transition: width 0.3s linear;
        scrollbar-width: none; /* firefox */
        -ms-overflow-style: none; /* IE 10+ */
        @media screen and (-webkit-min-device-pixel-ratio: 1.1) {
            width: 260px !important;
        }
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>