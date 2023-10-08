# 中文网字计划——前端部分

这个仓库是中文网字计划的前端部分，它为项目网站首页和博客提供了技术支持。

我们采用最新的 Astro SSG 技术进行搭建，确保网站优秀的性能和用户体验。此外，在搭建时，我们还采用了 Solid-js 提供的部分组件支持，以便更好地满足用户需求。

在样式设计方面，我们选择了 TailwindCSS、赫蹏（HeTi）等工具，以确保网站的视觉效果和交互体验都达到最佳。除此之外，我们还使用 ImageKit 和 LightCDN 为项目字体加载提供了非常良好的内容分发，以确保内容快速加载，并可以在不同设备上获取更好的显示效果。

## 开发进度

-   [ ] 进行资源加载速度信息的收集
-   [x] 触摸屏下删除自动定位功能

## 备注

1. Astro 官方的格式化居然有 BUG 会断行错误，所以采用了 prettier 的一个插件格式化
2. npm 包安装失败，需要先设置一下路径： 
```sh
pnpm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp"
pnpm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"
pnpm set ENTRYCLI_CDNURL=https://cdn.npm.taobao.org/dist/sentry-cli
pnpm set sentrycli_cdnurl=https://cdn.npm.taobao.org/dist/sentry-cli
```