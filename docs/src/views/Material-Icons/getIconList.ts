// 获取 icon 数据
export const getIconList = async () => {
    const list = await fetch(
        "https://fastly.jsdelivr.net/gh/google/material-design-icons/update/current_versions.json"
    ).then((res) => res.json());
    return [
        ...Object.keys(list)
            .map((i) => {
                return i.split("::") as [string, string];
            })
            .reduce((col, [key, value]) => {
                if (col.has(key)) {
                    col.get(key)!.push(value);
                } else {
                    col.set(key, [value]);
                }
                return col;
            }, new Map<string, string[]>())
            .entries(),
    ];
};
