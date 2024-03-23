// 我们将会把生成的文件全部上传至 imagekit 并为我们的网站提供 CDN 加载
// 因为 jsDelivr 和 unpkg 有并发限制，导致会卡顿，但是我们用专业的 CDN ，就可以实现 在 600ms 内迅速加载所有切片
import ImageKit from "imagekit";
import fs from "fs";
import { glob } from "glob";
import path from "path";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import mri from "mri";
const argv = process.argv.slice(2);
const input = mri(argv);

// chinese-fonts@snapmail.cc
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC,
    privateKey: process.env.IMAGEKIT_TOKEN,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

const files = await glob(`./packages/**/*.svg`, {
    ignore: "node_modules/**",
});
import pLimit from "p-limit";
let cache = new Set();
try {
    const data = await fs.promises.readFile("./scripts/.upload_cache", "utf-8");
    cache = new Set(JSON.parse(data));
} catch (e) { }

const uploadFolder = async (iterator) => {
    const file = await fs.promises.readFile(iterator);
    return imagekit
        .upload({
            file,
            fileName: path.basename(iterator), //required
            folder: path.dirname(
                iterator
                    .replaceAll("\\", "/")
                    .replaceAll(" ", "_")
                    // 更换文件夹中的 . 为 _
                    .replace(/(?<=\/.*)\.(?=.*\/)/g, "_")
            ),
            overwriteFile: true,
            useUniqueFileName: false,
        })
        .then((response) => {
            cache.add(iterator);
            console.log("done", iterator);
        });
};

const limit = pLimit(3);

const inputs = files.map((i) => limit(() => uploadFolder(i)));
