import Layout from '~/layouts/HomeLayout';

import { $t, A } from '~/i18n';
import { getAllSections } from './post/_post/getAllSections';
import { originLink } from '~/utils/originLink';

export default (props: { sections?: Awaited<ReturnType<typeof getAllSections>> }) => {
    const sections = () => props.sections || {};
    return (
        <Layout
            title={$t('b8337dd9789e8259fd6543cbd43ac8c4')}
            description={'中文网字计划文档列表'}
            keywords={$t('d607ec3c4aeb920414eb174e960e4b02')}
        >
            <main class="py-4 px-12">
                <h2 class="w-full py-8 text-3xl text-center">
                    {$t('7c6f314e2a20f07a459ee758be60ec60')}
                </h2>

                <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Object.entries(sections()).map(([sectionName, posts]) => {
                        return (
                            <nav>
                                <h2 class="my-2 border-b border-gray-300 py-2 text-2xl text-cyan-700">
                                    {sectionName}
                                </h2>
                                <ul class="space-y-4">
                                    {posts.map(({ frontmatter: post, path }) => {
                                        return (
                                            <li>
                                                <A href={path} onclick={originLink}>
                                                    <h3>{post.title}</h3>

                                                    <p class="my-2 line-clamp-1 text-xs text-gray-500">
                                                        {post.description}
                                                    </p>
                                                    <aside class="flex gap-2 text-xs text-gray-500">
                                                        <address>{post.article.authors}</address>

                                                        <time
                                                            dateTime={new Date(
                                                                post.article.pubDate
                                                            ).toString()}
                                                        >
                                                            {new Date(
                                                                post.article.pubDate
                                                            ).toLocaleDateString()}
                                                        </time>
                                                    </aside>
                                                </A>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        );
                    })}
                </section>
            </main>
        </Layout>
    );
};
