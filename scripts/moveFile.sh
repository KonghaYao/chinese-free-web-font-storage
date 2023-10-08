# 将 packages 文件夹中打包好的数据全部复制到 dist 文件夹
rm -r ./dist
find ./packages -type d -name "dist" -exec sh -c 'mkdir -p  $(echo "$0" | sed "s/packages/dist\/packages/") && cp -r "$0" "$(echo "$0" | sed "s/packages/dist\/packages/")"' {} \;
