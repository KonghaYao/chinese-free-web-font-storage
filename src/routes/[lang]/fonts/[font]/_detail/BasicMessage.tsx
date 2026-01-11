import type { FontReporter } from 'cn-font-split';
import FontCoverage from './FontCoverage';
import { $t } from '~/i18n';
export const BasicMessage = (props: { reporter: FontReporter }) => {
    const { name: font_name } = useParams();
    return (
        <>
            <section class="col-span-6 lg:col-span-12 grid grid-cols-2 border-card p-12 hover:border-emerald-500 gap-8">
                <div class="overflow-hidden flex flex-col">
                    <header class="rounded-md p-2 bg-blue-600 text-white text-lg mb-6">
                        {$t('289fd0d6ffaf86171d9d0ea8f4c9ca3a')}
                    </header>
                    <table class="my-4 w-full table-fixed">
                        <tbody>
                            {Object.entries(props.reporter.message.windows).map(([key, val]) => {
                                return (
                                    <tr class=" transition-colors hover:bg-white">
                                        <td class="px-4 text-sky-600">{key}</td>
                                        {typeof val === 'string' ? (
                                            <td class="select-text px-4 py-1 text-sm">{val}</td>
                                        ) : (
                                            <>
                                                <td class="select-text px-4 py-1 text-sm">
                                                    {(val as any).en}
                                                </td>
                                                <td class="select-text px-4 py-1 text-sm">
                                                    {(val as any).cn}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div class="flex">
                        <a
                            class="rounded-md bg-neutral-200 px-2 text-green-600"
                            href={'https://www.maoken.com/?s=' + font_name}
                            target="_black"
                        >
                            {$t('8288cee1ce129d76faf22cc15d5ea90b')}
                        </a>
                    </div>
                </div>
                <div>
                    <header class="rounded-md p-2 bg-purple-600 text-white text-lg mb-6">
                        {$t('d58fac49d3e14821880af36d7eb2f836')}
                    </header>
                    <FontCoverage reporter={props.reporter} />
                </div>
            </section>
        </>
    );
};
