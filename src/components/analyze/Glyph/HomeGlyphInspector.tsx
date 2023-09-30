import { resource } from '@cn-ui/reactive';
import { GlyphInspector } from './GlyphInspector';
import { Show } from 'solid-js';
import { __CDN__ } from '../../../global';

export default () => {
    const f = resource<File>(() =>
        fetch(
            __CDN__ +
                '/packages/jxzk/dist/%E6%B1%9F%E8%A5%BF%E6%8B%99%E6%A5%B7/b786513754f541ac613d2ab0f155a633.woff2'
        )
            .then((res) => res.blob())
            .then((res) => new File([res], 'test.woff2'))
    );
    return (
        <Show when={f()}>
            <GlyphInspector file={f()}></GlyphInspector>
        </Show>
    );
};
