<template>
    <div class="nav-header">
        <div style="display: flex;">
            <el-icon class="home-icon" @click="goHome('/')">
                <i class="fa fa-home fa-2x"></i>
            </el-icon>
            <el-icon class="right-icon">
                <arrow-right />
            </el-icon>
            <el-breadcrumb separator-icon="ArrowRight" class="crumb">
                <template v-for="item in breadCrumbInfo" :key="item.name">
                    <!-- <el-breadcrumb-item :to="{ path: item.path }">{{ item.name }}</el-breadcrumb-item> -->
                    <el-breadcrumb-item v-if="item.name != 'Default' && item.name != 'Home'" >{{ item.name }}</el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>

        <div class="icon-right">
            <el-icon>
                <arrow-left @click="lastStep" />
            </el-icon>
            <el-icon>
                <refresh @click="refrech('/')" />
            </el-icon>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType, toRefs } from "vue";
import { useRouter } from "vue-router";
import { BreadCrumbItemType } from "../types/types";
export default defineComponent({
    name: "BreadCrumb",
    props: {
        breadCrumbInfo: Array as PropType<BreadCrumbItemType[]>,
    },
    setup(props,) {
        const route = useRouter()
        const { breadCrumbInfo } = toRefs(props)

        // breadCrumbInfo = router.currentRoute.value.matched
        const goHome = (url: string) => {
            route.push(url)
        }
        // go(-1)
        const lastStep = (url: string) => {
            console.log(route)
            route.go(-1)
        }
        // roload
        const refrech = (url: string) => {
            location.reload()
        }
        return {
            refrech, //刷新
            lastStep, //返回上一页
            goHome,//返回首页
        };
    }
});

</script>
<style lang="scss" scoped>
.nav-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .home-icon {
        height: 26px;
        padding: 16px;
        color: rgb(146, 146, 146);
    }
    .right-icon {
        height: 26px;
        padding-top: 16px;
        font-size: 16px;
        color: #c0c4cc;
    }
    .crumb {
        font-size: 16px;
        padding-top: 22px;
        padding-left: 10px;
    }
    .icon-right {
        height: 26px;
        padding-top: 0px;
        padding-right: 20px;
        font-size: 24px;
        font-weight: 600;
    }
    .icon-right >.el-icon:first-child{
        margin-right: 22px;
    }
    .el-icon {
        cursor: pointer;
    }
    .el-icon:hover{
        color: #5d8dee;
    }
}
</style>