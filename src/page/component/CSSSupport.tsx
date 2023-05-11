import { atom } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import copy from 'copy-to-clipboard';
import { DetailedContext } from '../DetailContext';
export const CSSSupport = () => {
    const FontStore = useContext(DetailedContext)!;
    console.log(FontStore);
    const CSSList = [
        `https://ik.imagekit.io/chinesefonts/packages/${FontStore.packageName}/dist/${FontStore.subName}/result.css`,
    ];
    const selectedCSS = atom(CSSList[0]);
    const code =
        `import "@chinese-fonts/${FontStore.packageName}/dist/${FontStore.subName}/result.css";\n` +
        `// 在 CSS 代码中 \nfont-family:'${FontStore.reporter.message.fontFamily}'`;
    return (
        <div class="divide-gry-400 flex flex-1 flex-col gap-1 divide-y-2 sm:gap-4">
            <div class="grid grid-cols-6 py-2">
                <img
                    height={32}
                    width={32}
                    src="https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/folder_type_github.svg"
                    alt=""
                />
                <span class="col-span-2 text-lg">GitHub 地址：</span>
                <a
                    href={`https://github.com/KonghaYao/chinese-free-web-font-storage/tree/branch/packages/${FontStore.packageName}/fonts`}
                    target="_blank"
                    class="col-span-3"
                >
                    <pre class="mx-2 rounded-lg bg-neutral-100 px-4">
                        <code>字体源文件地址</code>
                    </pre>
                </a>
            </div>
            <div class="grid grid-cols-4 py-2">
                <a
                    class="flex-none"
                    href={`https://www.npmjs.com/package/@chinese-fonts/${FontStore.packageName}`}
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
                <div class="col-span-3 flex flex-col gap-1 overflow-auto ">
                    <a
                        href={`https://www.npmjs.com/package/@chinese-fonts/${
                            FontStore.packageName
                        }${'/v/' + FontStore.version}`}
                        target="_blank"
                    >
                        <pre class="mx-2 select-text overflow-auto rounded-lg bg-neutral-100 px-4">
                            <code
                                innerText={` npm install @chinese-fonts/${FontStore.packageName}`}
                            ></code>
                        </pre>
                    </a>
                    <pre class="mx-2 select-text whitespace-pre-wrap rounded-lg bg-neutral-100 px-4">
                        <code innerText={code}></code>
                    </pre>
                </div>
            </div>
            <div class="grid grid-cols-3 py-2  md:grid-cols-6">
                <img
                    height={24}
                    width={24}
                    src="https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/file_type_css.svg"
                    alt=""
                />
                <span class=" col-span-1 text-lg">CSS CDN 支持：</span>
                <button
                    class="mx-4 bg-neutral-100 px-2 "
                    onClick={() => {
                        copy(selectedCSS());
                    }}
                >
                    复制
                </button>
                <select
                    class="col-span-3  my-4 max-w-fit shrink rounded-md py-1 ring ring-green-600 md:my-0"
                    onChange={(e: any) => {
                        selectedCSS(e.target.value);
                    }}
                >
                    <For each={CSSList}>{(item) => <option value={item}>{item}</option>}</For>
                </select>
            </div>
        </div>
    );
};
