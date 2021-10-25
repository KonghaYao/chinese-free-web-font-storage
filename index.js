import fontSplit from "@konghayao/cn-font-split";
import fse from "fs-extra";
import { resolve, extname } from "path";
// 需要先进行 npm run build 生成字体文件

const fontFileName = "站酷庆科黄油体";
const license = ""; // 字体版权说明文件， 有则填即可

fse.emptyDirSync("./build");
fontSplit({
    FontPath: `./fonts/${fontFileName}.ttf`, // 字体位置
    destFold: `./build/${fontFileName}`, // 必须设置为名称
    css: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontDisplay: "swap",
        fontFamily: null, // 如果不设置的话将会使用默认的字体名称哦
    },
    chunkOptions: {
        allowEn: false,
        totalSize: 6000, // 总共会抽取的字符数
        chunkSize: 600, // 每个分段的字符数
    },
}).then((res) => {
    if (license)
        fse.outputFileSync(
            resolve(`./build/${fontFileName}/license.` + extname(license)),
            fse.readFileSync(license)
        );
});
