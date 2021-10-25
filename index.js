import fontSplit from "@konghayao/cn-font-split/dist/fontSplit.esm.js";
import fse from "fs-extra";
import { resolve, extname } from "path";
import genTestHTML from "./genTestHTML.js";

const fontFileName = "站酷快乐体2016修订版";
const license = "./fonts/license.txt"; // 字体版权说明文件， 有则填路径即可
const FontPath = `./fonts/${fontFileName}.ttf`;

fse.emptyDirSync("./build");
fontSplit({
    FontPath, // 字体位置
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
})
    .then(({ fontFamily }) => {
        return genTestHTML(fontFamily, fontFileName);
    })
    .then(() => console.log("测试文件生产完毕"))
    .then(() => {
        if (license) {
            return fse
                .outputFile(
                    resolve(
                        `./build/${fontFileName}/license` + extname(license)
                    ),
                    fse.readFileSync(license)
                )
                .then(() => console.log("声明文件生成完毕"));
        }
    });
