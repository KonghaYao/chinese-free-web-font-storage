import fse from "fs-extra";
import { resolve } from "path";
export default async function (fontName, pathName) {
    const template = await fse.readFile("./template.html", {
        encoding: "utf-8",
    });

    return fse.outputFile(
        resolve(`./build/${pathName}/index.html`),
        template.replace(new RegExp("FONTNAME", "g"), fontName)
    );
}
