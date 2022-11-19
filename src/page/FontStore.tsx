import { createStore } from 'solid-js/store';
import { batch, createEffect } from 'solid-js';
import { useEasyFont } from '../App';

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
    get FontSubFolder() {
        return `https://unpkg.com/@chinese-fonts/${this.packageName}${this.version}/dist/${this.fontName}/`;
    },
    versions: [] as string[],
    fontList: [] as string[],
    FontReporter: null as Reporter,
    projectIndex: {
        packages: {} as Record<string, string>,
    },
});

export const useFontWatcher = () => {
    createEffect(async () => {
        setFontStore('loading', true);
        await fetch(
            'https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage@branch/index.json'
        )
            .then((res) => res.json())
            .then((res) => {
                setFontStore('projectIndex', res);
            });
        if (!FontStore.packageName) return;
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
                    .then((res) => {
                        batch(() => {
                            setFontStore('fontList', res);
                            setFontStore('fontName', res[0]);
                        });
                    });
            }
        });
    };
    const autoLoadSingleFont = () => {
        createEffect(async () => {
            FontStore.fontName &&
                fetch(
                    `https://unpkg.com/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/reporter.json`
                )
                    .then((res) => res.json())
                    .then((res) => setFontStore('FontReporter', res));
        });
    };
    const autoChangeFont = () => {
        const { replaceFont } = useEasyFont();
        createEffect(() => {
            // console.log(FontStore.FontSubFolder);
            FontStore.FontReporter &&
                replaceFont(
                    FontStore.FontSubFolder + `result.css`,
                    `"${FontStore.FontReporter.message.fontFamily}"`,
                    FontStore.FontReporter.message.fontSubFamily.toLowerCase()
                );
        });
    };
    return {
        autoLoadFontList,
        autoLoadSingleFont,
        autoChangeFont,
    };
};
