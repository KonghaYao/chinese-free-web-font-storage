import { atom, type Atom, ObjectAtom } from '@cn-ui/reactive';
import type { JSXElement } from 'solid-js';
import { Portal } from 'solid-js/web';
import { VModel } from '@cn-ui/reactive';
import { addFontRequest } from '../../api/addFontRequest';
import { Notice } from '../../Notice';
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
export const AddFont = () => {
    const panelVisible = atom(false);
    const a = ObjectAtom<Parameters<typeof addFontRequest>[0]>({
        fontName: '',
        nickName: '',
        detail: '',
        url: '',
    });
    return (
        <>
            <button onclick={() => panelVisible(true)}>添加字体</button>
            <Dialog
                title="添加字体"
                onSubmit={() => {
                    if (a.fontName() && a.nickName() && a.detail() && a.url()) {
                        panelVisible(false);
                        Notice.success('您的请求已记录');
                        addFontRequest(a()).then((res) => {
                            console.log(res);
                        });
                    } else {
                        Notice.error('请填写完整');
                    }
                }}
                visible={panelVisible}
            >
                <form action="" class="flex flex-col gap-4 p-4">
                    <input
                        type="text"
                        class="text-input"
                        placeholder="需要添加字体的名称"
                        {...VModel(a.fontName)}
                    ></input>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="你的名字"
                        {...VModel(a.nickName)}
                    ></input>
                    <textarea
                        class="text-input"
                        style={{ resize: 'none' }}
                        placeholder="请你描述一下字体"
                        {...VModel(a.detail)}
                    ></textarea>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="提供一个 URL 地址或者来源"
                        {...VModel(a.url)}
                    ></input>
                </form>
            </Dialog>
        </>
    );
};
