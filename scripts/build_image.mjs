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

    // 进行打包操作
    for (const name of fontsName) {
        const dest = `./packages/${iterator}/dist/${path
            .basename(name)
            .replace(/\.\w+$/, "")}`;
        await fontSplit({
            FontPath: `./packages/${iterator}/fonts/${name}`,
            destFold: dest,
            targetType: "woff2",
            chunkSize: 70 * 1024,
            testHTML: false,
            reporter: false,
            previewImage: {},
            threads: {},
            autoChunk: false,
            subsets: [],
        });
    }
}
