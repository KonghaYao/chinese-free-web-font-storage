import { reflect } from '@cn-ui/use';
import { For, useContext } from 'solid-js';
import { DetailedContext } from '../DetailContext';

export const FontInformation = () => {
    const { reporter, cnName } = useContext(DetailedContext)!;
    const entries = reflect(() => Object.entries(reporter.message));
    return (
        <div class="p-4">
            <For each={entries()}>
                {([key, val]) => {
                    return (
                        <nav class="flex justify-between">
                            <nav class="text-sky-600">{key}</nav>
                            <nav class="select-text">{val}</nav>
                        </nav>
                    );
                }}
            </For>

            <div class="flex ">
                <a
                    class="rounded-md bg-neutral-200 px-2 text-green-600"
                    href={'https://www.maoken.com/?s=' + cnName}
                    target="_black"
                >
                    字体授权查询
                </a>
            </div>
        </div>
    );
};
