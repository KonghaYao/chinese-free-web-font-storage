export const URLLinkHelp: Record<string, { url: string; desc: string }> = {
    fontSource: { url: 'https://fontsource.org', desc: '收集 Google Web 字体的网站' },
    opentype: {
        url: 'https://opentype.js.org/',
        desc: 'Javascript OpenType 解析库',
    },
    CSSFeatureDemo: {
        url: 'https://sparanoid.com/lab/opentype-features/',
        desc: 'OpenType 字体特性的 CSS 演示',
    },
    FontDetail: {
        url: 'https://wakamaifondue.com/',
        desc: '在线检测字体信息网站',
    },
};

/** 灵感页面的展示窗口 */
export const ShowCaseLinks = () => {
    return [
        {
            title: "中华诗词大典",
            image: "https://ik.imagekit.io/chinesefonts1/showcase/chinese_poetry.png?updatedAt=1695542815437",
            url: 'https://chinese-poetry.netlify.app/',
            categories: ['诗词']
        },
        {
            title: "魔导绪论",
            image: "https://ik.imagekit.io/chinesefonts1/showcase/magic_tag.png?updatedAt=1695554686260",
            url: 'https://magic-tag.netlify.app/',
            categories: ['AI绘画']
        },
    ]
}
