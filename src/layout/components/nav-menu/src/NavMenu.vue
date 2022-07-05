<template>
  <div class="nav-menu">
    <div class="logo">
      <img src="~@/assets/images/logo.png" alt="logo" />
    </div>
    <div>
      <el-menu background-color="transparent" text-color="#FFF" :default-active="defaultActive" :show-timeout="200"
        theme="dark" :unique-opened="false" :collapse-transition="false" mode="vertical" :collapse="false"
        style="font-size:16px">

        <template v-for="(submenu, _key) in userMenus" :key="_key">
          <div v-if="submenu.children?.length == 0 || !submenu.children">
            <el-menu-item :index="submenu.path" @click="menuItemClic(submenu.path)" v-if="!submenu.hidden">
              <el-icon>
                <component :is="submenu.icon"></component>
              </el-icon>
              {{ submenu.name }}
            </el-menu-item>
          </div>
          <div v-else>
            <el-sub-menu :index="submenu.path" select="handleSelec" v-if="!submenu.hidden">
              <template #title>
                <el-icon>
                  <component :is="submenu.icon"></component>
                </el-icon>
                {{ submenu.name }}
              </template>
              <template v-for="(item, __key) in submenu.children" :key="__key">
                <el-menu-item :index="item.path + ''" @click="menuItemClic(item.path)" v-if="!item.hidden">
                  <el-icon>
                    <component :is="item.icon"></component>
                  </el-icon>{{ item.name }}
                </el-menu-item>
              </template>
            </el-sub-menu>
          </div>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, toRefs, watch } from "vue";
import { useRouter, } from "vue-router";

export default defineComponent({
  name: 'NavMenu',
  props: {
    menuFold: {
      typeof: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter();
    const userMenus = router.options.routes;
    var state = reactive({
      defaultActive: router.options.history.location as any
    })

    const menuItemClic = (url: string) => {
      router.push(url)
    }
    watch(() => router.currentRoute.value, (path) => {
      nextTick(() => {
        state.defaultActive = path.fullPath
      })
    })
    return {
      ...toRefs(state),
      userMenus,
      menuItemClic,
    }
  }

})

</script>
<style lang="scss" scoped>
@import "@styles/element-ui.scss";

.nav-menu {
  width: 100%;

  .el-menu-item {
    color: #fff !important;
  }

  .el-menu-item,
  .el-sub-menu__title,
  i {
    font-size: 15px !important;
    color: $menuTxtColor !important;


  }

  /*菜单高度及hover*/
  .el-menu-item,
  .el-sub-menu__title {
    position: relative;
    height: 50px;
    line-height: 50px;
    border-radius: 10px;

    &:hover {
      color: $menuTxtColor !important;
      background-color: $menuHover !important;

      i {
        color: $menuTxtColor !important;
      }
    }

  }

  .el-menu {
    border-right: none !important;

    .el-menu-item.is-active {
      color: #FFF !important;
      background: $menuHover !important;
    }
  }

  //一级目录--无子菜单
  .el-menu--inline>.is-active {
    color: #FFF !important;
    background: $menuHover !important;

    .el-icon {
      color: #FFF !important;
    }
  }

  //一级目录--无子菜单
  .el-menu--inline>.is-active {
    color: #FFF !important;
    background: $menuHover !important;

    .el-icon {
      color: #FFF !important;
    }
  }

  .el-menu--inline>.is-active i {
    color: $mainColor !important;
  }

  .logo {
    background-color: $menuBg;
    padding: 10px 0;

    img {
      margin: 0px auto;
      width: 50px;
      height: 50px;
    }
  }

}
</style>
<style lang="scss">
.el-sub-menu {
  .el-sub-menu__title {
    font-size: 15px !important;

    i {
      font-size: 16px !important;
    }
  }
}
</style>
