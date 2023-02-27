import { Atom, atom, reflect } from '@cn-ui/use';
import { Component, createContext, For, JSXElement } from 'solid-js';
export const SearchBoxContext = createContext<{
    list: Atom<string[]>;
    packageKey: Atom<string>;
    keyName: Atom<Map<string, string>>;
}>();
const SearchList = ({
    list,
    packageKey,
    keyName,
}: {
    list: Atom<string[]>;
    packageKey: Atom<string>;
    keyName: Atom<Map<string, string>>;
}) => {
    const showFont = reflect(() => {
        if (packageKey() === '') {
            return list();
        }
        const reg = new RegExp(packageKey());
        return list().filter((i) => reg.test(i));
    });
    return (
        <div class="w-full  overflow-auto py-4 px-8">
            <For each={showFont()} fallback={<div>没有数据</div>}>
                {(item) => {
                    return (
                        <div class="flex  items-center justify-between rounded-lg p-4 hover:bg-neutral-200 ">
                            <header class="text-xl">{item}</header>
                            <a href={'/fonts/' + keyName().get(item)}>
                                <div class="flex-none cursor-pointer bg-sky-600 p-1 text-xs text-white">
                                    尝试字体
                                </div>
                            </a>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};

export const SearchBox: Component<{ children?: JSXElement; info: Record<string, string> }> = (
    props
) => {
    const keyName = reflect(() => {
        return new Map(Object.entries(props.info).map((i) => i.reverse() as [string, string]));
    });
    const list = reflect(() => {
        const data = Object.entries(props.info).map((i) => i[1]);
        // console.log(FontStore.projectIndex);
        return data;
    });
    const packageKey = atom('');
    return (
        <>
            <div class="flex w-full  justify-center p-4">
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
            </div>
            <SearchList
                {...{
                    list,
                    packageKey,
                    keyName,
                }}
            ></SearchList>
        </>
    );
};
