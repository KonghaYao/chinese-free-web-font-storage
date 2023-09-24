import { type Atom } from '@cn-ui/reactive';
import type { JSXElement } from 'solid-js';
import { Portal } from 'solid-js/web';

export const Dialog = (props: {
    title: string;
    children: JSXElement;
    visible: Atom<boolean>;
    onSubmit: () => void;
}) => {
    return (
        <Portal mount={document.body}>
            {props.visible() && (
                <section class="fixed left-0 top-0 z-50 flex h-full  w-full items-center justify-center">
                    <div class="pointer-events-auto flex h-2/3 w-2/3 flex-col overflow-hidden rounded-lg border-2 border-gray-200 bg-white  shadow-lg">
                        <header class="border-b p-4 text-2xl ">
                            {props.title}
                            <span
                                class="float-right cursor-pointer"
                                onclick={() => props.visible(false)}
                            >
                                ❌
                            </span>
                        </header>

                        <div class="flex-1">{props.children}</div>
                        <footer class="border-t p-2 text-xl ">
                            <button
                                class="float-right rounded-lg p-2 transition-colors hover:bg-gray-100"
                                onclick={props.onSubmit}
                            >
                                提交
                            </button>
                        </footer>
                    </div>
                </section>
            )}
        </Portal>
    );
};
