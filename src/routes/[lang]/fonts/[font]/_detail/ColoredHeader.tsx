import Index from '../../../../../../index.json';
import { MdiGithub } from '~/components/icons/MdiGithub';

export const toNpmName = (font: string) => {
    switch (font) {
        case 'ToneOZ-Pinyin-Kai':
            return 'toneoz-pinyin-kai-simplified';
        case 'ToneOZ-Pinyin-WenKai':
            return 'toneoz-pinyin-wenkai';
        case 'ToneOZ-RadicalZ-Kai':
            return 'toneoz-radicalz-kai';
        case 'ToneOZ-Tsuipita':
            return 'toneoz-tsuipita';
        case 'XiaoheSimplify':
            return 'xiaohe-simplify';
        case 'GuanKiapTsingKhai':
            return 'guan-kiap-tsing-khai';
        case 'LxgwNeoZhiSong':
            return 'lxgw-neo-zhi-song';
    }
    return font;
};

export const ColoredHeader = () => {
    const { font, name: font_name } = useParams();
    const font_name_cn = (Index as Record<string, { name: string }>)[font]?.name;
    return (
        <section class="col-span-6 lg:col-span-12 text-2xl flex justify-center gap-12 my-12">
            <div class="flex-1">{font_name_cn}</div>
            <div>{font}</div>
            <div>{decodeURI(font_name)}</div>
            <div class="flex gap-6 items-center">
                <a
                    href={`https://www.npmjs.com/package/@chinese-fonts/${toNpmName(font)}`}
                    target="_blank"
                    class="text-blue-500 hover:text-blue-600"
                >
                    <img
                        src="https://static-production.npmjs.com/7a7ffabbd910fc60161bc04f2cee4160.png"
                        height={24}
                        width={24}
                    ></img>
                </a>
                <a
                    href={`https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch/packages/${font}/fonts`}
                    target="_blank"
                    class="text-blue-500 hover:text-blue-600"
                >
                    <MdiGithub></MdiGithub>
                </a>
            </div>
        </section>
    );
};
