import { fontSplit } from "@konghayao/cn-font-split";
import fse from "fs-extra";
import md5 from "md5";
import path from "path";
import semver from "semver";
const packages = fse.readdirSync("./packages");

for (const iterator of packages) {
    // 找到项目对应的字体文件包
    const fontsName = fse
        .readdirSync(`./packages/${iterator}/fonts`)
        .filter((i) => {
            return [".ttf", ".eot", "woff", "woff2", "otf"].some((word) =>
                i.endsWith(word)
            );
        });
    const fontsPath = fontsName.map((i) => `./packages/${iterator}/fonts/${i}`);

    const fonts = await Promise.all(fontsPath.map((i) => fse.readFile(i)));
    // 对比项目 hash 值
    const packageData = fse.readJSONSync(`./packages/${iterator}/package.json`);
    const hash = md5(fonts);

    if (hash === packageData.version_tag) {
        console.log(` 跳过 ${iterator}`);
        continue;
    }
    console.log(`${iterator} 开始打包`);
    console.log("新旧hash", hash, packageData.version_tag);
    // hash 值不等，进行打包操作

    for (const name of fontsName) {
        const dest = `./packages/${iterator}/dist/${path
            .basename(name)
            .replace(/\.\w+$/, "")}`;
        await fse.emptydir(dest);
        await fontSplit({
            FontPath: `./packages/${iterator}/fonts/${name}`,
            destFold: dest,
            targetType: "woff2",
            chunkSize: 50 * 1024,
            testHTML: false,
        });
    }
    packageData.version_tag = hash;
    packageData.version = semver.inc(packageData.version, "minor");
    fse.writeJSONSync(`./packages/${iterator}/package.json`, packageData);
    console.log(`${iterator} 完成`, packageData.version);
}
