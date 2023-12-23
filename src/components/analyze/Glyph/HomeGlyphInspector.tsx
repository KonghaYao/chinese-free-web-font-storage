import { resource } from '@cn-ui/reactive';
import { GlyphInspector } from './GlyphInspector';
import { Show } from 'solid-js';
import { __CDN__ } from '../../../global';
import { isServer } from 'solid-js/web';

export default () => {
    if (isServer) return <div class="m-auto grid h-[90vh] w-[80%] "></div>;
    const f = resource<File>(() =>
        fetch(
            __CDN__ +
                '/packages/jxzk/dist/%E6%B1%9F%E8%A5%BF%E6%8B%99%E6%A5%B7/448ea0a947d3a7d0f3a4cb7e74ba6cd4.woff2'
        )
            .then((res) => res.arrayBuffer())
            .then((res) => new File([res], 'test.woff2'))
    );
    return (
        <Show when={f()}>
            <GlyphInspector file={f()}></GlyphInspector>
        </Show>
    );
};
