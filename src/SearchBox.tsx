import { Atom, atom, reflect } from '@cn-ui/use';
import { FontStore } from './page/FontStore';
import { A, useNavigate } from '@solidjs/router';
import { Notice } from './Notice';
import { Component, createContext, JSXElement } from 'solid-js';
export const SearchBoxContext = createContext<{
    list: Atom<string[]>;
    packageKey: Atom<string>;
    keyName: Atom<Map<string, string>>;
}>();

export const SearchBox: Component<{ children?: JSXElement }> = (props) => {
    const keyName = reflect(() => {
        return new Map(
            Object.entries(FontStore.projectIndex.packages).map(
                (i) => i.reverse() as [string, string]
            )
        );
    });
    const nav = useNavigate();
    const list = reflect(() => {
        const data = Object.entries(FontStore.projectIndex.packages).map((i) => i[1]);
        // console.log(FontStore.projectIndex);
        return data;
    });
    const packageKey = atom('');
    return (
        <SearchBoxContext.Provider
            value={{
                list,
                packageKey,
                keyName,
            }}
        >
            <div class="flex w-full justify-between  p-4">
                <input
                    class=" mx-4 rounded-md p-2 font-medium outline-none ring ring-green-600"
                    placeholder="搜索字体项目"
                    value={packageKey()}
                    type="search"
                    name=""
                    oninput={(e: any) => {
                        packageKey(e.target.value);
                    }}
                />
                <button
                    class="rounded-lg bg-red-600 p-2 text-white"
                    onclick={() => {
                        const en = keyName().get(packageKey());
                        if (en) {
                            nav(`/fonts/${en}`);
                        } else {
                            Notice.error('没有找到该字体');
                            nav(`/search`);
                        }
                    }}
                >
                    跳转
                </button>
            </div>
            {props.children}
        </SearchBoxContext.Provider>
    );
};
