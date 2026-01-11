import { MarkdownComponent, getArticleComponent } from '~/utils/getPostSections';
import { TOC } from '~/routes/[lang]/post/_post/TOC';
import { PostLayout } from '~/layouts/PostLayout';
import ArticleAside from '~/routes/[lang]/post/_post/ArticleAside';
import { lazy, Show } from 'solid-js';
import { $t } from '~/i18n';

export default (props: { lang?: string, slug?: string, meta?: any, sections?: any }) => {
    const pureSlug = () => props.slug?.replace(/\.html?/, '') || '';
    const Content = lazy(() => getArticleComponent(props.lang!, pureSlug()));
    return (
        <PostLayout
            title={props.meta?.frontmatter?.title}
            keywords={props.meta?.frontmatter?.keywords}
            description={props.meta?.frontmatter?.description}
        >
            <section class="flex justify-center">
                <aside class="fixed top-16 left-0 flex-col px-8 py-12 hidden lg:flex h-full flex-none w-[20rem] z-10">
                    <ArticleAside sections={props.sections} lang={props.lang} />
                </aside>
                <main class="flex-1 select-text relative z-1 h-full w-full scroll-smooth lg:px-56 items-center flex flex-col">
                    <article class="markdown-body m-auto block max-w-4xl py-12">
                        <Content />
                    </article>
                </main>
                <nav class=" fixed top-16 right-0 flex-none w-64 z-10  px-8 py-12 hidden lg:block">
                    <div class="font-bold text-lg">{$t('7f1b21a571bc81517bbf8b85b1ef7ccd')}</div>
                    <TOC heading={props.meta?.toc ?? []} pIds={[]} />
                </nav>
            </section>
        </PostLayout>
    );
};
