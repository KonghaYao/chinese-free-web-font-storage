import { DebounceAtom, NullAtom, atom, reflect } from '@cn-ui/reactive';
import { VModel } from '~/utils/VModel';
import { __CDN__ } from '../../../global';
import { Show } from 'solid-js';
import copy from 'copy-to-clipboard';
import { Notice } from '../../../Notice';
import { createAsync } from '@solidjs/router';
import { getFontList } from '../_index/getFontList';
import { clientOnly } from '@solidjs/start';

export const ClientCode = clientOnly(() => import('~/components/Code'));
export const SearchBox = () => {
    const search = atom('');
    const ListContainer = NullAtom(null);
    const data = createAsync(() => getFontList(), { initialValue: [] });
    const items = DebounceAtom(
        reflect(() =>
            data().filter((i) => {
                if (!search()) return true;
                return i.name.includes(search());
            })
        )
    );
    return (
        <>
            <div class="sticky top-20 z-50 flex items-center rounded-md border border-solid border-gray-200 bg-white px-4  py-4 text-gray-600 shadow-lg transition-shadow">
                <i class="mr-2 h-5 w-5">
                    <svg
                        viewBox="64 64 896 896"
                        data-icon="search"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
                    </svg>
                </i>
                <input
                    type="text"
                    class="flex-1 appearance-none bg-transparent text-blue-400 outline-none"
                    {...VModel(search)}
                    placeholder={$t('8a72eabe5b35921dc89028350eeae6ab')}
                />
                <Show when={items().length}>
                    <span class="flex-none text-xs text-gray-400">
                        {$t('5564c3fb0b50ffa77310c503647681c9')}
                        {items().length}
                        {$t('fe93b643025a1243200c6938e5c6377f')}
                    </span>
                </Show>
            </div>
            <ul
                ref={ListContainer}
                class="font-list-ul grid grid-cols-1 gap-4 py-8  sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-5"
            >
                {items().map((font) => {
                    return font.remotePath.map((remote) => {
                        const copied = atom(false);
                        return (
                            <>
                                <li
                                    class=" z-0 flex justify-between rounded border bg-white p-2 transition-all hover:z-10 hover:shadow-md hover:backdrop-blur-sm"
                                    classList={{
                                        new: font.new,
                                        hot: font.hot,
                                        'col-span-2': copied(),
                                    }}
                                >
                                    <section class="flex-1 flex flex-col justify-between">
                                        <span class="mb-2 border-b pb-2 text-2xl text-rose-400">
                                            {font.name}
                                        </span>
                                        <img
                                            loading="lazy"
                                            src={`${__CDN__}/${remote.url.replace('result.css', 'preview.svg')}`}
                                            alt=""
                                        />
                                        <span
                                            title={`https://chinese-fonts-cdn.deno.dev/${remote.url}}`}
                                            class="flex justify-evenly border-t pt-1 text-xs text-blue-400"
                                        >
                                            <span>{font.id}</span>
                                            <span>·</span>
                                            <span
                                                class="cursor-pointer text-blue-600 transition-colors"
                                                onclick={() => {
                                                    copy(
                                                        `https://chinese-fonts-cdn.deno.dev/${remote.url}`
                                                    );
                                                    Notice.success('复制 CDN 地址成功');
                                                    copied(true);
                                                }}
                                            >
                                                {$t('a2b4963719600f1e16ce18bcd60f863f')}
                                            </span>
                                            <span>·</span>
                                            <A
                                                href={remote.href}
                                                class="cursor-pointer transition-colors hover:text-green-600"
                                                preload={false}
                                            >
                                                {$t('51b5f4f4f1ea04b3dc2447016ab37662')}
                                            </A>
                                        </span>
                                    </section>
                                    <Show when={copied()}>
                                        <div class="flex-1 overflow-hidden flex flex-col text-xs text-left gap-1 text-neutral-600 px-2 bg-gray-100">
                                            <h4>{$t('a5eb7686aca0662121e7c4f32c2f5bee')}</h4>
                                            <LinkCode
                                                href={`https://chinese-fonts-cdn.deno.dev/${remote.url}`}
                                            ></LinkCode>
                                            <h4>{$t('e780454184b9e6853e444d6f372e7272')}</h4>
                                            <FontCode style={remote.style}></FontCode>
                                        </div>
                                    </Show>
                                </li>
                            </>
                        );
                    });
                })}
            </ul>
        </>
    );
};

// 优化渲染

export const LinkCode = (prop: { href: string }) => {
    return (
        <div class="overflow-auto p-4 bg-white rounded-md">
            <pre
                class="shiki vitesse-light"
                style="background-color:#ffffff;color:#393a34"
                tabindex="0"
            >
                <code>
                    <span class="line">
                        <span style="color:#999999">&lt;</span>
                        <span style="color:#1E754F">link</span>
                        <span style="color:#B07D48"> rel</span>
                        <span style="color:#999999">=</span>
                        <span style="color:#B5695977">'</span>
                        <span style="color:#B56959">stylesheet</span>
                        <span style="color:#B5695977">'</span>
                        <span style="color:#B07D48"> href</span>
                        <span style="color:#999999">=</span>
                        <span style="color:#B5695977">'</span>
                        <span style="color:#B56959">{prop.href}</span>
                        <span style="color:#B5695977">'</span>
                        <span style="color:#999999"> /&gt;</span>
                    </span>
                </code>
            </pre>
        </div>
    );
};

export const FontCode = (props: { style: string | number }) => {
    return (
        <div class="overflow-auto p-4 bg-white rounded-md">
            <pre
                class="shiki vitesse-light"
                style="background-color:#ffffff;color:#393a34"
                tabindex="0"
            >
                <code>
                    <span class="line">
                        <span style="color:#1E754F">body</span>
                        <span style="color:#999999"> {'{'}</span>
                    </span>
                    <span class="line">{props.style}</span>
                    <span class="line">
                        <span style="color:#999999">{'}'}</span>
                        <span style="color:#393A34">;</span>
                    </span>
                </code>
            </pre>
        </div>
    );
};
