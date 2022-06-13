<script setup lang="ts">
import Header from './views/Header.vue'
import Footer from './views/Footer.vue';
console.log('工作开始')
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <Header></Header>

    <router-view v-slot="{ Component }">
      <component class="flex-grow overflow-hidden" :is="Component" />
    </router-view>

    <Footer></Footer>
  </div>
</template>

<style scoped>
/* This only changes this particular animation duration */
.animate__animated {
  --animate-duration: 0.3s;
}
</style>

<style>
@import url("https://fastly.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/千图笔锋手写体/result.min.css");
@import url("https://fastly.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage/build/站酷庆科黄油体/result.css");
@import url("https://fastly.jsdelivr.net/npm/@fontsource/dancing-script@4.5.8/index.css");
@import url("https://fastly.jsdelivr.net/npm/animate.css");

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

  font-family: "Material Icons";
}

.Font-Q {
  font-family: qiantubifengshouxieti;
}

.Font-E {
  font-family: "Dancing Script";
}

.Font-T {
  font-family: zcoolqingkehuangyouti;
}

head,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
}
</style>
