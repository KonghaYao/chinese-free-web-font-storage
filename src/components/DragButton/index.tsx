import { JSXElement, createSignal } from 'solid-js';

interface UDragDropType {
    accept?: string;
    children?: JSXElement;
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
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onclick={() => input.click()}
        >
            {props.children}
            {isDragging() ? '松开鼠标确认文件' : '拖拽文件到此处进行确认 or 点击上传'}
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
