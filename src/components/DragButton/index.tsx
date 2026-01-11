import { type JSXElement, createSignal } from 'solid-js';
import { $t } from '~/i18n';
interface UDragDropType {
    accept?: string;
    children?: JSXElement;
    class?: string;
}
interface IDragDropButton {
    (props: { onGetFile: (file: File) => void; multiple?: false } & UDragDropType): JSXElement;
    (props: { onGetFile: (file: File[]) => void; multiple?: true } & UDragDropType): JSXElement;
}

export const DragDropButton: IDragDropButton = (props) => {
    const [isDragging, setIsDragging] = createSignal(false);
    let input: HTMLInputElement;
    const handleDragEnter = (e: Event) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: Event) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e: Event) => {
        e.preventDefault();
    };

    const handleDrop = (e: Event) => {
        e.preventDefault();
        setIsDragging(false);
        const file = (e as any).dataTransfer.files[0];
        props.onGetFile(file);
    };

    return (
        <button
            class={`h-full w-full rounded-lg transition-colors hover:bg-neutral-50 ${
                isDragging() ? 'bg-neutral-50' : ''
            } ${props.class || ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onclick={() => input.click()}
        >
            {props.children}
            {isDragging()
                ? $t('067e9c9f46463dfdd077b118bc5b8b38')
                : $t('12b5920df0f8020d2f0d8469e9f22b10')}
            <input
                class="hidden"
                accept={props.accept}
                ref={input!}
                multiple={props.multiple}
                type="file"
                oninput={(e) => {
                    props.onGetFile((e.target as any).files[0]);
                }}
            />
        </button>
    );
};
