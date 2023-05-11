import { globSync } from "glob";
import fs from "fs-extra";
const cn = await fs.readJSON("./overrides.json");
const data = Object.fromEntries(
    Object.entries(cn).map(([en, cn]) => {
        const path = globSync(`packages/${en}/**/result.css`).map((i) =>
            i.replaceAll("\\", "/")
        );
        return [
            en,
            {
                name: cn,
                path,
                remotePath: path.map((i) =>
                    i
                        .replaceAll(" ", "_")
                        // 更换文件夹中的 . 为 _
                        .replace(/(?<=\/.*)\.(?=.*\/)/g, "_")
                ),
            },
        ];
    })
);

console.log(data);
fs.outputJSON("./index.json", data);
