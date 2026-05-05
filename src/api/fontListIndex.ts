// @i18n-disable
import Index from '../../index.json';

export const getFileListIndex = async () => {
    const allFiles = await Promise.all(
        Object.entries(Index)
            .map(([id, value]) => {
                return { ...value, id };
            })
            .reverse()
            .map(async (i, index) => {
                const remotePath = await Promise.all(
                    i.remotePath.map(async ({ path: remote, css }) => {
                        const style = `font-family:'${css.family}';font-weight:'${css.weight}'`;
                        const [_, name] = remote.match(/dist\/(.*?)\/result/)!;
                        return { url: remote, style, name, href: `/fonts/${i.id}/${name}` };
                    })
                );
                return { ...i, remotePath, hot: false, new: index <= 6 };
            })
    );
    try {
        // return allFiles;
        return sortFontListByRemoteCount(allFiles);
    } catch (e) {
        console.error('远程链接获取失败：');
        console.error(e);
        return allFiles;
    }
};
/** 静态化的热门字体访问数据（原 SSE 接口已退役） */
const HOT_LINK_DATA: { key: string[]; value: number }[] = [
    { key: ['records', 'path', 'syst'], value: 6984783 },
    { key: ['records', 'path', 'hwmct'], value: 9148008 },
    { key: ['records', 'path', 'sypxzs'], value: 3217383 },
    { key: ['records', 'path', 'stdgt'], value: 1807900 },
    { key: ['records', 'path', 'lxgwwenkaibright'], value: 1547940 },
    { key: ['records', 'path', 'dymh'], value: 1569574 },
    { key: ['records', 'path', 'lxgwwenkai'], value: 1374768 },
    { key: ['records', 'path', 'maple-mono-cn'], value: 972500 },
    { key: ['records', 'path', 'bxzlzt'], value: 930720 },
    { key: ['records', 'path', 'pmzdxxt'], value: 871520 },
    { key: ['records', 'path', 'hcqyt'], value: 828200 },
    { key: ['records', 'path', 'zqfs'], value: 802136 },
    { key: ['records', 'path', 'ysbth'], value: 676989 },
    { key: ['records', 'path', 'jhlst'], value: 645180 },
    { key: ['records', 'path', 'zpix'], value: 202000 },
    { key: ['records', 'path', 'dyh'], value: 200422 },
    { key: ['records', 'path', 'lywkpmydb'], value: 226800 },
    { key: ['records', 'path', 'yozai'], value: 249385 },
    { key: ['records', 'path', 'yzgcxst'], value: 378082 },
    { key: ['records', 'path', 'lxgwmanhei'], value: 129731 },
    { key: ['records', 'path', 'mkwtyt'], value: 178475 },
    { key: ['records', 'path', 'GuanKiapTsingKhai'], value: 109500 },
    { key: ['records', 'path', 'fbdzt'], value: 61799 },
    { key: ['records', 'path', 'jxzk'], value: 71614 },
    { key: ['records', 'path', 'mzxst'], value: 77139 },
    { key: ['records', 'path', 'mkzyt'], value: 58316 },
    { key: ['records', 'path', 'rzjkxzdmh'], value: 90861 },
    { key: ['records', 'path', 'moon-stars-kai'], value: 94900 },
    { key: ['records', 'path', 'jyhpws'], value: 86000 },
    { key: ['records', 'path', 'yqt'], value: 47860 },
    { key: ['records', 'path', 'xuandongkaishu'], value: 47930 },
    { key: ['records', 'path', 'blbbsxt'], value: 48970 },
    { key: ['records', 'path', 'jpdzt'], value: 45646 },
    { key: ['records', 'path', 'yfxy'], value: 38851 },
    { key: ['records', 'path', 'qxs'], value: 33940 },
    { key: ['records', 'path', 'zhbtt'], value: 36192 },
    { key: ['records', 'path', 'crgkk'], value: 30540 },
    { key: ['records', 'path', 'fhst'], value: 26454 },
    { key: ['records', 'path', 'cef'], value: 27143 },
    { key: ['records', 'path', 'ToneOZ-Pinyin-Kai'], value: 56900 },
    { key: ['records', 'path', 'LxgwNeoZhiSong'], value: 25800 },
    { key: ['records', 'path', 'zzqxmxht'], value: 25301 },
    { key: ['records', 'path', 'kksjt'], value: 39328 },
    { key: ['records', 'path', 'ToneOZ-Tsuipita'], value: 47300 },
    { key: ['records', 'path', 'bwckkt'], value: 35131 },
    { key: ['records', 'path', 'mksjh'], value: 50757 },
    { key: ['records', 'path', 'stmdxf'], value: 15395 },
    { key: ['records', 'path', 'ysfxt'], value: 11633 },
    { key: ['records', 'path', 'qtbfsxt'], value: 11539 },
    { key: ['records', 'path', 'hwxk'], value: 11200 },
    { key: ['records', 'path', 'zjmc'], value: 11100 },
    { key: ['records', 'path', 'pfljhlyt'], value: 10536 },
    { key: ['records', 'path', 'hqzmt'], value: 10035 },
    { key: ['records', 'path', 'pfmmd'], value: 10353 },
    { key: ['records', 'path', 'xiaolai'], value: 10489 },
    { key: ['records', 'path', 'ToneOZ-Pinyin-WenKai'], value: 19400 },
    { key: ['records', 'path', 'XiaoheSimplify'], value: 16800 },
    { key: ['records', 'path', 'pfgzt'], value: 19279 },
    { key: ['records', 'path', 'ysbzt'], value: 18771 },
    { key: ['records', 'path', 'dyzgt'], value: 17387 },
    { key: ['records', 'path', 'yidianyan'], value: 14300 },
    { key: ['records', 'path', 'syftjkt'], value: 20412 },
    { key: ['records', 'path', 'scjssh'], value: 12545 },
    { key: ['records', 'path', 'cubic'], value: 12273 },
    { key: ['records', 'path', 'hlxsjt'], value: 9332 },
    { key: ['records', 'path', 'cezkzdbs'], value: 8910 },
    { key: ['records', 'path', 'cqscbbt'], value: 9260 },
    { key: ['records', 'path', 'jnjj'], value: 6348 },
    { key: ['records', 'path', 'sft'], value: 6621 },
    { key: ['records', 'path', 'rmjzqpybxs'], value: 8394 },
    { key: ['records', 'path', 'yzklct'], value: 8263 },
    { key: ['records', 'path', 'zqzmxs'], value: 8602 },
    { key: ['records', 'path', 'zkxw'], value: 7965 },
    { key: ['records', 'path', 'zlmyz'], value: 7827 },
    { key: ['records', 'path', 'pfljhfyt'], value: 9051 },
    { key: ['records', 'path', 'rzjryzzk'], value: 8500 },
    { key: ['records', 'path', 'hldqjt'], value: 8500 },
    { key: ['records', 'path', 'ToneOZ-RadicalZ-Kai'], value: 5600 },
    { key: ['records', 'path', 'ysyrxk'], value: 5441 },
    { key: ['records', 'path', 'the-write-right-font'], value: 5900 },
    { key: ['records', 'path', 'tjl'], value: 8760 },
    { key: ['records', 'path', 'misans'], value: 3600 },
    { key: ['records', 'path', 'shs'], value: 700 },
    { key: ['records', 'path', 'smi'], value: 600 },
    { key: ['records', 'path', 'syht'], value: 300 },
    { key: ['records', 'path', 'wzsf'], value: 300 },
    { key: ['records', 'path', 'zkkht'], value: 300 },
    { key: ['records', 'path', 'kaishu-fonts/kaishu.css'], value: 300 },
    { key: ['records', 'path', 'hwmc'], value: 400 },
    { key: ['records', 'path', 'maokenassortedsans'], value: 400 },
    { key: ['records', 'path', 'yshst'], value: 700 },
    { key: ['records', 'path', 'maple-mono'], value: 1100 },
    { key: ['records', 'path', 'hyqzp'], value: 7300 },
];

export const getHotLink = async () => HOT_LINK_DATA;

export const sortFontListByRemoteCount = async <
    T extends { id: string; name: string; hot: boolean; remotePath: any[] },
>(
    files: T[]
): Promise<T[]> => {
    const hotLink = await getHotLink();
    const hot = hotLink
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
        .map((i) => {
            const item = files.find((f) => f.id === i.key[2]);
            if (item) {
                item.hot = true;
            }
            return item!;
        })
        .filter(Boolean);
    // 解析最终的结果
    return [...new Set([...sortGrid(hot), ...files])] as T[];
};

/** 使得三列布局更紧凑 */
export const sortGrid = <T extends { id: string; remotePath: any[] }>(files: T[]): T[] => {
    return files.sort((a, b) => {
        return a.remotePath.length - b.remotePath.length;
    });
};
