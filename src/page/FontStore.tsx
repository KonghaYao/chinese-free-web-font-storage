import { createStore } from 'solid-js/store';
import { batch } from 'solid-js';
import { useEasyFont } from '../App';
import { Notice } from '../Notice';

export const [FontStore, setFontStore] = createStore({
    packageName: 'jxzk' as string,
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

const FontRemote = {
    async getIndex() {
        return fetch(
            'https://cdn.jsdelivr.net/gh/KonghaYao/chinese-free-web-font-storage@branch/index.json'
        )
            .then((res) => res.json())
            .then((res) => {
                setFontStore('projectIndex', res);
            });
    },
    async getVersions() {
        const { versions: V } = await fetch(
            `https://registry.npmmirror.com/@chinese-fonts/${FontStore.packageName}`
        ).then((res) => res.json());
        const versions = Object.keys(V);
        setFontStore('selectedVersion', versions[0]);
        setFontStore('versions', versions);
    },
    async loadFontList() {
        return fetch(
            `https://cdn.jsdelivr.net/npm/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/index.json`
        )
            .then((res) => res.json())
            .then((res) => {
                batch(() => {
                    setFontStore('fontList', res);
                    setFontStore('fontName', res[0]);
                });
            });
    },
    async loadSingleFont() {
        Notice.success('加载字体报告中。。。');
        return fetch(
            `https://unpkg.com/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/reporter.json`
        )
            .then((res) => res.json())
            .then((res) => setFontStore('FontReporter', res));
    },
    async ChangeFont() {
        const { replaceFont } = useEasyFont();

        console.log(FontStore.FontSubFolder);
        return replaceFont(
            FontStore.FontSubFolder + `result.css`,
            `"${FontStore.FontReporter.message.fontFamily}"`,
            FontStore.FontReporter.message.fontSubFamily.toLowerCase()
        );
    },
};

export const initFontStore = async () => {
    setFontStore('loading', true);

    await FontRemote.getIndex();
    if (!FontStore.packageName) {
        setFontStore('loading', false);
        return;
    }
    FontRemote.getVersions();
    setFontStore('loading', false);
    return FontRemote;
};
