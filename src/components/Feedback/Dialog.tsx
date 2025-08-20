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
                <section class="fixed left-0 top-0 z-50 flex h-full  w-full items-center justify-center bg-black/30">
                    <div class="pointer-events-auto flex h-2/3 w-2/3 flex-col overflow-hidden rounded-lg border-2 border-gray-100 bg-white  shadow-xl">
                        <header class="flex items-center justify-between border-b p-4 text-2xl text-gray-700">
                            {props.title}
                            <span
                                class="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                                onclick={() => props.visible(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-x"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </span>
                        </header>

                        <div class="flex-1">{props.children}</div>
                        <footer class="flex justify-end border-t p-2 text-xl ">
                            <button
                                class="rounded-lg p-2 transition-colors hover:bg-gray-100 text-gray-600"
                                onclick={props.onSubmit}
                            >
                                {$t('2ecb456c247926204dda44cbfca158bc')}
                            </button>
                        </footer>
                    </div>
                </section>
            )}
        </Portal>
    );
};
