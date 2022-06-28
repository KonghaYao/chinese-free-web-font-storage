 <template>
     <footer class="flex Font-E p-4 justify-between items-center bg-gray-100">
         <div class="h-full hidden md:flex">
             <div class="text-sm text-right">
                 Design By KonghaYao
                 <br />Please give me a star
             </div>
             <div class="border-r-2 mx-4"></div>
             <div class="Font-Q text-left">
                 江夏尧设计
                 <br />请给我一个赞吧
             </div>
         </div>
         <div class="flex-grow justify-center text-sm overflow-y-auto text-white overflow-x-hidden flex px-8">
             <router-link class="Font-Q px-2 bg-lime-400 " :to="{ name: 'Home' }">中文字体</router-link>
             <router-link class="Font-E px-2 bg-sky-400" to="/material-icons">Material Icon</router-link>
             <router-link class="Font-E px-2 bg-orange-400" to="/google-fonts">Google Fonts</router-link>
 
         </div>
         <div class="flex flex-col">
             <div class="flex justify-evenly items-center">
                 <a href="https://gitee.com/dongzhongzhidong">
                     <img class="rounded-full overflow-hidden h-8 w-8" src="/public/avatar.png" />
                 </a>
                 <a href="https://github.com/KonghaYao/chinese-free-web-font-storage">
                     <img class="h-8 w-8"
                         src="https://fastly.jsdelivr.net/gh/primer/octicons/icons/mark-github-16.svg" />
                 </a>
             </div>
             <div class="footer-name">Click and Star Me</div>
         </div>
     </footer>
 </template>
