import { reflect, useSelect } from '@cn-ui/reactive';
import type { Result } from '..';
import md5 from 'md5';

export const FeatureTable = (props: {
    data: Result['features'];
    getSVG: Result['drawTextToSVG'];
    fontURL: string;
}) => {
    const features = Object.keys(props.data);
    const fontFamily = reflect(() => {
        return md5(props.fontURL);
    });
    return (
        <section>
            <header class="my-4 flex gap-4">
                {features.map((key) => {
                    return (
                        <a href={'#' + key}>
                            <button>{key}</button>
                        </a>
                    );
                })}
            </header>
            <style>
                {` @font-face {font-family: '${fontFamily()}';src: url(${props.fontURL});}`}
            </style>
            <div class=" ">
                {features.map((i) => {
                    return (
                        <details open id={i}>
                            <summary class="text-xl leading-6">{i}</summary>
                            <div
                                class="my-4 grid grid-cols-6 gap-2"
                                style={`font-family: '${fontFamily()}'`}
                            >
                                {props.data[i].map((data) => {
                                    const sub_text = String.fromCodePoint(
                                        ...data.sub.map((i) => i[0]).filter(Boolean)
                                    );
                                    if (!sub_text) return <></>;
                                    return (
                                        <nav class="rounded-md bg-gray-100 p-1 text-3xl">
                                            <div
                                                style={{
                                                    'font-feature-settings': `"${i}" 1`,
                                                }}
                                            >
                                                {sub_text}
                                            </div>
                                            <div
                                                style={{
                                                    'font-feature-settings': `"${i}" 0`,
                                                }}
                                            >
                                                {sub_text}
                                            </div>
                                        </nav>
                                    );
                                })}
                            </div>
                        </details>
                    );
                })}
            </div>
        </section>
    );
};
