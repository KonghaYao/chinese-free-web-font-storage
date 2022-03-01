<script setup lang="ts">
import Header from './views/Header.vue'
import Footer from './views/Footer.vue';
import { RouterViewTransition as RouterView } from '@duandz/vue-router-transition'
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <Header></Header>

    <RouterView class="flex-grow overflow-hidden"></RouterView>

    <Footer></Footer>
  </div>
</template>

<style>
@import url("https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/千图笔锋手写体/result.min.css");

@import url("https://cdn.jsdelivr.net/gh/konghayao/chinese-free-web-font-storage/css/Dancing Script-700.min.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  height: 2px;
  width: 2px;
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  height: 2px;
  width: 2px;
  border-radius: 2px;
  background-color: #ccc;
}
.Icon {
  user-select: none;
  cursor: pointer;
  width: 1em;
  height: 1em;
  font-family: "Material Icons";
}
.Font-Q {
  font-family: qiantubifengshouxieti;
}
.Font-E {
  font-family: "Dancing Script";
}
head,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
</style>
