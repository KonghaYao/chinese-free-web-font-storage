import { fontSplit } from "@konghayao/cn-font-split";
import fse from "fs-extra";
import md5 from "md5";
import path from "path";
import semver from "semver";
import mri from "mri";

const argv = process.argv.slice(2);

const input = mri(argv);
// 重新打包字体文件
globalThis.fetch = null;
console.log("mode", input.mode);
console.log("version", input.mode);

const packages = fse.readdirSync("./packages");
for (const iterator of packages) {
    if (input.single && input.single !== iterator) {
        continue;
    }
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

    let cacheData = {};
    const hash = md5(fonts);
    // 对比项目 hash 值
    if (input.mode != "rebuild") {
        try {
            cacheData = fse.readJSONSync(`./packages/${iterator}/cache.json`);
        } catch (e) { }

        if (hash === cacheData.version_tag) {
            console.log(` 跳过 ${iterator}`);
            continue;
        }
        console.log("新旧hash", hash, cacheData.version_tag);
    }
    console.log(`${iterator} 开始打包`);

    // ! 清空文件夹，保证是最新版
    fse.emptyDirSync(`./packages/${iterator}/dist/`);

    // 进行打包操作
    for (const name of fontsName) {
        const dest = `./packages/${iterator}/dist/${path
            .basename(name)
            .replace(/\.\w+$/, "")}`;
        await fse.emptydir(dest);
        await fontSplit({
            FontPath: `./packages/${iterator}/fonts/${name}`,
            destFold: dest,
            targetType: "woff2",
            chunkSize: 70 * 1024,
            testHTML: true,
            previewImage: {},
            threads: {},
        });
    }

    if (input.mode !== "rebuild") {
        // 重写 package.json
        const packageData = fse.readJSONSync(
            `./packages/${iterator}/package.json`
        );
        cacheData = {
            version: semver.inc(
                (cacheData && cacheData.version) || packageData.version,
                input.version ?? "minor"
            ),
            version_tag: hash,
        };
        fse.writeJSONSync(`./packages/${iterator}/package.json`, {
            ...packageData,
            version: cacheData.version,
        });
        fse.writeJSONSync(`./packages/${iterator}/cache.json`, cacheData);
        console.log(`${iterator} 完成`, cacheData.version);
    }
    fse.writeJSONSync(
        `./packages/${iterator}/dist/index.json`,
        fontsName.map((i) => path.basename(i).replace(/\.\w+$/, ""))
    );
}
