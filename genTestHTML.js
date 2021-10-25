import fse from "fs-extra";
import { resolve } from "fs";
export default function (fontName) {
    const template = fse.readFileSync("./template.html");
    fse.outputFileSync(
        resolve(`./build/${fontName}/index.html`),
        template.replace(new RegExp("FONTNAME", "g"), fontName)
    );
}
