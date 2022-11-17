import { atom } from '@cn-ui/use';
import { For } from 'solid-js';
import { FontStore } from '../FontStore';
import copy from 'copy-to-clipboard';
import { Notice } from '../../Notice';

export const CSSSupport = () => {
    const CSSList = [
        `https://unpkg.com/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/result.css`,
        // ! JSDelivr 貌似不支持中文路径了
        // `https://cdn.jsdelivr.net/npm/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/result.css`,
        // `https://fastly.jsdelivr.net/npm/@chinese-fonts/${FontStore.packageName}${FontStore.version}/dist/${FontStore.fontName}/result.css`,
    ];
    const selectedCSS = atom(CSSList[0]);
    return (
        <div class="divide-gry-400 flex flex-1 flex-col gap-4 divide-y-2">
            <div class="grid grid-cols-3 py-2">
                <img
                    height={32}
                    width={32}
                    src="https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/folder_type_github.svg"
                    alt=""
                />
                <span class="flex-none text-lg">GitHub 地址：</span>
                <a
                    href={`https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch/packages/${FontStore.packageName}/fonts`}
                    target="_blank"
                >
                    <pre class="mx-2 rounded-lg bg-neutral-200 px-4">
                        <code>字体源文件地址</code>
                    </pre>
                </a>
            </div>
            <div class="flex py-2">
                <a
                    class="flex-none"
                    href={`https://www.npmjs.com/package/@chinese-fonts/${FontStore.packageName}${
                        FontStore.selectedVersion ? '/v/' + FontStore.selectedVersion : ''
                    }`}
                    target="_blank"
                >
                    <img
                        height={48}
                        width={48}
                        src="https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_npm.svg"
                        alt=""
                    />
                    <span class="flex-none  text-lg">NPM 支持：</span>
                </a>
                <div class="flex flex-col gap-1 overflow-auto ">
                    <a
                        href={`https://www.npmjs.com/package/@chinese-fonts/${
                            FontStore.packageName
                        }${FontStore.selectedVersion ? '/v/' + FontStore.selectedVersion : ''}`}
                        target="_blank"
                    >
                        <pre class="mx-2 select-text rounded-lg bg-neutral-200 px-4">
                            <code>
                                {` npm install @chinese-fonts/${FontStore.packageName}${FontStore.version}`}
                            </code>
                        </pre>
                    </a>
                    <pre class="mx-2 select-text whitespace-pre-wrap rounded-lg bg-neutral-200 px-4">
                        <code>
                            {`import "@chinese-fonts/${FontStore.packageName}/dist/${FontStore.fontName}/result.css";\n`}

                            {`// 在 CSS 代码中 \nfont-family:'${FontStore.FontReporter.message.fontFamily}'`}
                        </code>
                    </pre>
                </div>
            </div>
            <div class="grid grid-cols-4  py-2">
                <img
                    height={24}
                    width={24}
                    src="https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_css.svg"
                    alt=""
                />
                <span class="text-lg">CSS CDN 支持：</span>
                <button
                    class="col-span-2 mx-4 bg-neutral-200 px-2"
                    onClick={() => {
                        copy(selectedCSS());
                        Notice.success('复制成功');
                    }}
                >
                    复制
                </button>
                <select
                    class="col-span-3  my-4 max-w-fit shrink rounded-md py-1 ring ring-green-600"
                    onChange={(e: any) => {
                        selectedCSS(e.target.value);
                    }}
                >
                    <For each={CSSList}>
                        {(item) => (
                            <option value={item}>
                                <pre>{item}</pre>
                            </option>
                        )}
                    </For>
                </select>
            </div>
        </div>
    );
};
