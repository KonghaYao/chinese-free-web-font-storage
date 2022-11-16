import { reflect } from '@cn-ui/use';
import { Navigate, useParams } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import { batch, createEffect, createResource, For, Show } from 'solid-js';
import { version } from 'xlsx';
interface Reporter {
    config: { FontPath: string; destFold: string; chunkSize: number };
    data: { name: string; size: number; chars: string }[];
    message: {
        designer: string;
        fontFamily: string;
        fontSubFamily: string;
        fullName: string;
        manufacturer: string;
        postScriptName: string;
        tradeMark: string;
        uniqueSubFamily: string;
        urlOfFontDesigner: string;
        urlOfFontVendor: string;
        version: string;
    };
    record: { name: string; start: number; end: number }[];
}
export const [FontStore, setFontStore] = createStore({
    packageName: '' as string,
    fontName: '' as string,
    loading: false,
    selectedVersion: '',
    get version() {
        return this.selectedVersion ? '@' + this.selectedVersion : '';
    },
    versions: [] as string[],
    fontList: [] as string[],
    FontReporter: null as Reporter,
});

export const useFontWatcher = () => {
    createEffect(async () => {
        setFontStore('loading', true);
        const { versions } = await fetch(
            `https://data.jsdelivr.com/v1/package/npm/@chinese-fonts/${FontStore.packageName}`
        ).then((res) => res.json());
        setFontStore('loading', false);
        setFontStore('selectedVersion', versions[0]);
        setFontStore('versions', versions);
    });
    const autoLoadFontList = () => {
        createEffect(() => {
            if (FontStore.selectedVersion) {
                fetch(
                    `https://cdn.jsdelivr.net/npm/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/index.json`
                )
                    .then((res) => res.json())
                    .then((res) => setFontStore('fontList', res));
            }
        });
    };
    const autoLoadSingleFont = () => {
        createEffect(async () => {
            fetch(
                `https://unpkg.com/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/reporter.json`
            )
                .then((res) => res.json())
                .then((res) => setFontStore('FontReporter', res));
        });
    };
    return {
        autoLoadFontList,
        autoLoadSingleFont,
    };
};

export const FontDetails = () => {
    const { packageName, fontName } = useParams();
    batch(() => {
        setFontStore('packageName', packageName);
        setFontStore('fontName', fontName);
    });

    const { autoLoadSingleFont } = useFontWatcher();
    autoLoadSingleFont();
    return (
        <div>
            <Show when={FontStore.FontReporter}>
                <Coverage></Coverage>
            </Show>
        </div>
    );
};

const Coverage = () => {
    const range = [
        ['基本汉字', 0x4e00, 0x9fa5],
        ['基本汉字补充', 0x9fa6, 0x9fff],
        ['扩展A', 0x3400, 0x4dbf],
        ['扩展B', 0x20000, 0x2a6df],
        ['扩展C', 0x2a700, 0x2b738],
        ['扩展D', 0x2b740, 0x2b81d],
        ['扩展E', 0x2b820, 0x2cea1],
        ['扩展F', 0x2ceb0, 0x2ebe0],
        ['扩展G', 0x30000, 0x3134a],
        ['康熙部首', 0x2f00, 0x2fd5],
        ['部首扩展', 0x2e80, 0x2ef3],
        ['兼容汉字', 0xf900, 0xfad9],
        ['兼容扩展', 0x2f800, 0x2fa1d],
        ['PUA(GBK)部件', 0xe815, 0xe86f],
        ['部件扩展', 0xe400, 0xe5e8],
        ['PUA增补', 0xe600, 0xe6cf],
        ['汉字笔画', 0x31c0, 0x31e3],
        ['汉字结构', 0x2ff0, 0x2ffb],
        ['汉语注音', 0x3105, 0x312f],
        ['注音扩展', 0x31a0, 0x31ba],
    ] as [string, number, number][];
    const total = FontStore.FontReporter.data.reduce((col, cur) => {
        return col + cur.chars;
    }, '');
    const result = range.map(([name, min, max]) => {
        let exist = '';
        let voids = '';
        for (let i = min; i <= max; i++) {
            const char = String.fromCharCode(i);
            const isExist = total.includes(char);
            if (isExist) {
                exist += char;
            } else {
                voids += char;
            }
        }
        return { name, exist, voids };
    });
    return (
        <div class="grid grid-cols-3 gap-2 text-center">
            <For each={result}>
                {({ name, exist, voids }) => {
                    const coverage =
                        ((exist.length * 100) / (exist.length + voids.length)).toFixed(2) + '%';
                    return (
                        <>
                            <span>{name}</span>
                            <span class="relative col-span-2 w-96 overflow-hidden rounded-3xl bg-gray-200 px-2 text-center">
                                <div
                                    class="absolute top-0 left-0  h-full  bg-lime-400"
                                    style={{
                                        width: coverage,
                                    }}
                                ></div>
                                <div class="relative z-10 block text-left">
                                    包括 <b>{exist.length}</b>，缺失<b>{voids.length}</b>
                                    <span class="float-right">{coverage}</span>
                                </div>
                            </span>
                        </>
                    );
                }}
            </For>
        </div>
    );
};
