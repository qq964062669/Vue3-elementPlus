<!-- 首页 -->
<template>
    <div class="default">
        <!--首页-->
        <img src="@/assets/images/home.png" class="default-img" alt="home" />
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: '首页',
    setup() {

    }
})
</script>
<style lang="scss">
    .default{
        &-img{
            margin: 200px auto 0;
        }
    }
</style>
