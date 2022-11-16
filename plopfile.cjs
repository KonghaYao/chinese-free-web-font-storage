const fse = require("fs-extra");
module.exports = (plop) => {
    const root = "packages/{{name}}/";
    // 设置一个生成器，第一个参数是项目名称，第二个函数是对象，对应设置选项
    plop.setGenerator("compontent", {
        // 描述
        description: "创建一个新的字体子仓库",
        // 命令行交互问题
        prompts: [
            // 一个问题对应一个对象，配置参考自定义Generator
            {
                type: "input",
                name: "name",
                message: "字体文件夹名称",
                default: "",
            },
        ],
        // 完成命令行交互过后完成的一些动作
        actions({ name }) {
            if (!name) throw new Error("你没有写名称");
            const path = fse.readdirSync("./templates/");
            fse.ensureDirSync(`./packages/${name}/fonts/`);
            return [
                ...path
                    .filter((i) => i.includes("."))
                    .map((i) => {
                        return {
                            type: "add",
                            path: root + i,
                            force: true,
                            templateFile: "templates/" + i,
                        };
                    }),
            ];
        },
    });
};
