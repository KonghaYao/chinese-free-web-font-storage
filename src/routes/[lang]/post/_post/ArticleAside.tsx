import { getAllSections } from '~/routes/[lang]/post/_post/getAllSections';
import { originLink } from '../../../../utils/originLink';
import { For } from 'solid-js';
import { A } from '~/i18n';
import '~/polyfill';
export default (props: {
    sections?: Awaited<ReturnType<typeof getAllSections>>;
    lang?: string;
}) => {
    const sections = () => props.sections || {};
    return (
        <ul class="flex-1">
            {Object.entries(sections()).map(([sectionName, posts]) => {
                return (
                    <li id={sectionName} class="mb-4">
                        <details open={true}>
                            <summary class="mb-3 cursor-pointer font-semibold text-cyan-900">
                                {sectionName}
                            </summary>
                            <ul class=" border-l border-neutral-100">
                                <For each={posts}>
                                    {({ frontmatter, path }) => {
                                        return (
                                            <li
                                                class="line-clamp-2 border-l border-blue-200 py-1 pl-4 text-neutral-700 transition-all hover:border-blue-600  hover:text-cyan-700"
                                                title={frontmatter?.title}
                                            >
                                                <A href={path} onclick={originLink}>
                                                    {frontmatter?.title}
                                                </A>
                                            </li>
                                        );
                                    }}
                                </For>
                            </ul>
                        </details>
                    </li>
                );
            })}
        </ul>
    );
};
