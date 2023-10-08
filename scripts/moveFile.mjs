import { glob } from "glob";
import fs from "fs-extra";
fs.emptyDirSync("./dist");
const files = await glob(
    `./packages/*/dist/**/*.{woff,woff2,ttf,json,svg,css}`,
    {
        ignore: "node_modules/**",
    }
);

files.forEach((i) => {
    const newPath =
        "./dist/" +
        i
            .replaceAll("\\", "/")
            .replaceAll(" ", "_")
            // 更换文件夹中的 . 为 _
            .replace(/(?<=\/.*)\.(?=.*\/)/g, "_");

    fs.move(i, newPath);
});
