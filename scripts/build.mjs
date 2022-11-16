import { fontSplit } from "@konghayao/cn-font-split";
import fse from "fs-extra";
import md5 from "md5";
import path from "path";
import semver from "semver";
// 重新打包字体文件

const packages = fse.readdirSync("./packages");
for (const iterator of packages) {
    // 找到项目对应的字体文件包
    /** 字体包的名称 */
    const fontsName = fse
        .readdirSync(`./packages/${iterator}/fonts`)
        .filter((i) => {
            return [".ttf", ".eot", "woff", "woff2", "otf"].some((word) =>
                i.endsWith(word)
            );
        });
    /** 字体路径 */
    const fontsPath = fontsName.map((i) => `./packages/${iterator}/fonts/${i}`);
    /** 字体 Buffer 文件 */
    const fonts = await Promise.all(fontsPath.map((i) => fse.readFile(i)));

    // 对比项目 hash 值
    let cacheData = {};
    try {
        cacheData = fse.readJSONSync(`./packages/${iterator}/cache.json`);
    } catch (e) {}
    const hash = md5(fonts);
    if (hash === cacheData.version_tag) {
        console.log(` 跳过 ${iterator}`);
        continue;
    }

    console.log(`${iterator} 开始打包`);
    console.log("新旧hash", hash, cacheData.version_tag);

    // hash 值不等，进行打包操作
    for (const name of fontsName) {
        const dest = `./packages/${iterator}/dist/${path
            .basename(name)
            .replace(/\.\w+$/, "")}`;
        // await fse.emptydir(dest);
        // await fontSplit({
        //     FontPath: `./packages/${iterator}/fonts/${name}`,
        //     destFold: dest,
        //     targetType: "woff2",
        //     chunkSize: 100 * 1024,
        //     testHTML: false,
        // });
    }

    // 重写 package.json

    const packageData = fse.readJSONSync(`./packages/${iterator}/package.json`);
    cacheData = {
        version: semver.inc(cacheData.version || "1.0.0", "minor"),
        version_tag: hash,
    };
    fse.writeJSONSync(`./packages/${iterator}/package.json`, {
        ...packageData,
        version: cacheData.version,
    });

    fse.writeJSONSync(`./packages/${iterator}/cache.json`, cacheData);
    fse.writeJSONSync(
        `./packages/${iterator}/dist/index.json`,
        fontsName.map((i) => path.basename(i).replace(/\.\w+$/, ""))
    );
    console.log(`${iterator} 完成`, cacheData.version);
}
