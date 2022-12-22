import { reflect } from '@cn-ui/use';
import { A } from '@solidjs/router';
import { For, useContext } from 'solid-js';
import { SearchBox, SearchBoxContext } from '../SearchBox';
import { initFontStore } from './FontStore';

export const SearchPage = () => {
    initFontStore();
    return (
        <div class="flex h-screen w-screen flex-col items-center p-4">
            <SearchBox>
                <SearchList></SearchList>
            </SearchBox>
        </div>
    );
};
const SearchList = () => {
    const { list, packageKey, keyName } = useContext(SearchBoxContext);

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
                            <A href={'/fonts/' + keyName().get(item)}>
                                <div class="flex-none cursor-pointer bg-sky-600 p-1 text-xs text-white">
                                    尝试字体
                                </div>
                            </A>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
