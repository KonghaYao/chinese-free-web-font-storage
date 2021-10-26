import fontSplit from "@konghayao/cn-font-split/dist/fontSplit.esm.js";
import fse from "fs-extra";
import { resolve, extname } from "path";
import genTestHTML from "./genTestHTML.js";

/**
 * 1. 确认自己在 create 分支
 * 2. 将字体文件放入 fonts 文件夹中， 如果有版权声明则放入
 * 3. 填写下面的 fontFileName 和license 路径
 */

const fontFileName = "站酷仓耳渔阳体-W05";
const license = "./fonts/站酷仓耳渔阳体使用声明.txt"; // 字体版权说明文件， 有则填路径即可
const FontPath = `./fonts/${fontFileName}.ttf`;

// 单个字体文件的模板是这样子的，但是如果你想要批量的话，自己慢慢填就是了
create([
    {
        fontFileName,
        FontPath,
        license,
    },
]).then(() => {
    console.log("全部完成");
});
function create(fontArray) {
    fse.emptyDirSync("./build");
    //======== 下面的代码请勿修改 =========
    const promises = fontArray.map(
        ({ fontFileName, FontPath, license }, index) => {
            return fontSplit({
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
                .then(() => console.log(fontFileName + "--测试文件生产完毕"))
                .then(() => {
                    if (license) {
                        return fse
                            .outputFile(
                                resolve(
                                    `./build/${fontFileName}/license` +
                                        extname(license)
                                ),
                                fse.readFileSync(license)
                            )
                            .then(() =>
                                console.log(fontFileName + "--声明文件生成完毕")
                            );
                    }
                })
                .then(() => console.log(fontFileName + "--全部完成"));
        }
    );
    return Promise.all(promises);
}
