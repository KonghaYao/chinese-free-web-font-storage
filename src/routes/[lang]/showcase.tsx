import Layout from '~/layouts/HomeLayout';
import { $t, A } from '~/i18n';
import { AddShowCase } from '~/components/Feedback/AddShowCase';
import { ShowCaseLinks } from '~/configs';
export default () => {
    return (
        (<Layout
            title={$t('87cdbf937e8ba000f52f13aac09717a5')}
            description={$t("7e5016b7d20256bff24dc4d541d8b192")}
            keywords={$t("1bf72502618f95a9f0e0b73f6afece1d")}
        >
            <section class="max-w-6xl m-auto">
                <header class="h-[80vh] flex flex-col w-full justify-center items-center gap-4 pb-8">
                    <aside class="bg-rose-600 text-white rounded-md p-2 text-2xl">
                        {$t('c26febed146956b50a743a2fcabbc3b3')}
                    </aside>
                    <h2 class="text-7xl">
                        {$t('34b1e92fb11165d7b276639193fd58e3')}
                        <span class="text-blue-600 mx-[0.25em]">
                            {$t('fb0c8b10747b8b7891d727e164244782')}
                        </span>
                        {$t('967cf7426422dac1cc625f4a4c1836be')}
                    </h2>
                </header>
                <div class="flex py-2">
                    {/* <AddShowCase /> */}
                    {/* <div class="flex-1"></div>
                    <div>{ShowCaseLinks().length}</div> */}
                </div>
                <ul class="grid md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 pb-12 gap-8 mb-24">
                    {ShowCaseLinks().map((site, i) => (
                        <>
                            {i === 4 && (
                                <li class="flex h-24 items-center justify-center md:col-span-2 lg:col-span-3">
                                    {$t('39d2219a5cddf8d3a2cc79e98cd33034')}
                                </li>
                            )}
                            <li
                                classList={{
                                    'md:col-span-2 md:row-span-2': i % 4 === 0,
                                }}
                            >
                                <article class="group relative flex aspect-video h-full w-full cursor-pointer flex-col overflow-hidden rounded-md bg-gray-600">
                                    <a
                                        href={site.url}
                                        rel="noopener"
                                        target="_blank"
                                        class="h-full w-full"
                                    >
                                        <span class="sr-only">{site.title}</span>
                                        <img
                                            src={site.image}
                                            alt=""
                                            class="h-full w-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        <footer class="pointer-events-none absolute bottom-0 z-10 flex w-full flex-col gap-2 bg-gray-500/95 p-4 text-gray-100 opacity-0 transition-opacity duration-300 ease-out group-focus-within:opacity-100 group-hover:opacity-100">
                                            <h2 class="heading-5">{site.title}</h2>
                                            <p class="body flex flex-row items-center gap-2">
                                                <span>{site.url}</span>
                                            </p>
                                        </footer>
                                    </a>
                                </article>
                            </li>
                        </>
                    ))}
                </ul>
            </section>
        </Layout>)
    );
};
