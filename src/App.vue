<template>
  <div id="app">
    <router-view :key="key"/>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import router from "@/router";

  export default defineComponent({
    setup() {
      const key  = () => {
        return new Date() + router
      }
      return {
        key
      }
    }
  })
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
