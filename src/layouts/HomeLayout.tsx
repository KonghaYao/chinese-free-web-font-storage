import { JSXElement, onMount, Show, useContext } from 'solid-js';
import { Meta, Link, MetaProvider, Base, Title } from '@solidjs/meta';
/** @ts-ignore */
// import { css, fontFamilyFallback } from '~/assets/jxzk.ttf';
import { i18nContext } from '~/i18n';
import GlobalHeader from './GlobalHeader';
export interface LayoutType {
    children: JSXElement;
    keywords: string;
    description: string;
    title: string;
    noFollow?: boolean;
}
const fontStyle = {
    width: '100%',
    // 'font-family': `'${css.family}', ${fontFamilyFallback.replaceAll('"', "'")}`,
};

export default (props: LayoutType) => {
    return (
        <MetaProvider>
            <Title>{props.title}</Title>
            <Show when={props.noFollow}>
                <Meta name="robots" content={$t('d420d9103588bf78dada339bb9b3660c')}></Meta>
            </Show>
            <Meta name="description" content={props.description}></Meta>
            <Meta
                name="keywords"
                content={props.keywords ?? $t('d43b734625429e539fb49080b13065d6')}
            ></Meta>
            <Link
                rel="preconnect"
                href="https://chinese-fonts-cdn.netlify.app"
                crossOrigin="anonymous"
            />
            <Link rel="preconnect" href="https://cdn.jsdelivr.net/" crossOrigin="anonymous" />
            <link
                rel="stylesheet"
                href="https://chinese-fonts-cdn.netlify.app/packages/jhlst/dist/%E4%BA%AC%E8%8F%AF%E8%80%81%E5%AE%8B%E4%BD%93v1_007/result.css"
            />
            <Base href={'/' + useContext(i18nContext).lang + '/'}></Base>
            <GlobalHeader></GlobalHeader>
            <section style={fontStyle}>{props.children}</section>
        </MetaProvider>
    );
};
