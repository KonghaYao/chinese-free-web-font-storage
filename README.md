# 中文 Web 免费可商用字体库

## 分支解释

1. master 分支：成品分支，用于保存全部 font 文件
2. base 分支：代码模板，用于生产代码
3. 生产分支： 使用字体英文名称的分支，生产出 font 文件，然后通过 checkout 只获取 build 文件夹内容

# 制作方式

1. 从 base 分支复制一条新分支
2. 在 index.js 修改配置并放置字体文件
3. node index.js
4. 将成品分支 checkout 到 master 分支
