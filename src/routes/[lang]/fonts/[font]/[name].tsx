// @i18n-disable
import { TextWriter } from './_detail/TextWriter';
import Layout from '~/layouts/HomeLayout';
import WebSupport from './_detail/WebSupport';
import { TimeAnalyze } from './_detail/TimeAnalyze';
import { BundleSizeAnalyze } from './_detail/BundleSizeAnalyze';
import { BundleContrast } from './_detail/BundleContrast';
import { getFontReporter } from '../../../../utils/getFontReporter';
import { Show } from 'solid-js';
import { __CDN__ } from '~/global';
import { createAsync } from '@solidjs/router';
import { ColoredHeader } from './_detail/ColoredHeader';
import { BasicMessage } from './_detail/BasicMessage';
import './name.css';
import Index from '../../../../../index.json';
export default () => {
    const { font, name: font_name } = useParams();
    const reporter = createAsync(async () => {
        const reporter = await getFontReporter(font!, font_name!);
        return reporter;
    });
    const font_name_cn = (Index as Record<string, { name: string }>)[font]?.name;
    return (
        <Layout
            title={font_name_cn + ' | 在线字体预览测试部署'}
            description={`中文网字计划提供 ${font_name_cn} 字体在线预览、部署、测试服务，提供有在线字体 CDN 链接，可通过 CSS 直接使用。`}
            keywords={`字体部署,在线字体,${font_name_cn} 全字符集中文渲染方案,字体分包,字体部署,web font`}
        >
            <link
                rel="stylesheet"
                href={__CDN__ + `/packages/${font}/dist/${font_name}/result.css`}
            />
            <div
                class="grid grid-cols-6 lg:grid-cols-12 gap-8 p-4 lg:max-w-6xl lg:m-auto"
                style={{
                    'font-family': `'${reporter()?.css.family}'`,
                    'font-weight': reporter()?.css.weight,
                }}
            >
                <ColoredHeader></ColoredHeader>

                <section class="col-span-7 flex justify-center items-center border-card">
                    <div class="poetry col-span-5 p-8 leading-6">
                        <header class="text-2xl">沁园春 雪</header>
                        <p class="text-start">
                            北国风光，千里冰封，万里雪飘。
                            <br />
                            望长城内外，惟余莽莽；
                            <br />
                            大河上下，顿失滔滔。
                            <br />
                            山舞银蛇，原驰蜡象，
                            <br />
                            欲与天公试比高。 须晴日，
                            <br />
                            看红装素裹，分外妖娆。
                            <br />
                            江山如此多娇，引无数英雄竞折腰。
                            <br />
                            惜秦皇汉武，略输文采；
                            <br />
                            唐宗宋祖，稍逊风骚。
                            <br />
                            一代天骄，成吉思汗，
                            <br />
                            只识弯弓射大雕。
                            <br />
                            俱往矣，数风流人物，还看今朝。
                        </p>
                        <span class="float-right mr-4 rounded-md bg-red-600 p-1 text-sm text-white">
                            毛泽东
                        </span>
                    </div>
                </section>
                <section
                    class="col-span-5 items-center rounded-2xl p-4 md:p-16 border"
                    style="letter-spacing: 0.2rem;"
                >
                    <p class="float-left text-9xl">苏</p>
                    <p class="float-left text-7xl">轼</p>

                    <p class="h-fit">
                        清风徐来，水波不兴。举酒属客，诵明月之诗，歌窈窕之章。少焉，月出於东山之上，徘徊於斗牛之间。白露横江，水光接天。纵壹苇之所如，淩万顷之茫然。浩浩乎如冯虚御风，而不知其所止;飘飘乎如遗世独立，羽化而登仙。
                    </p>
                </section>

                <section class="col-span-5 flex justify-center items-center border-card">
                    <p class="p-8 capitalize">
                        In wilds beyond they speak your name with reverence and regret,
                        <br />
                        For none could tame our savage souls yet you the challenge met,
                        <br />
                        Under palest watch, you taught, you changed. Base instincts were redeemed,
                        <br />A world you gave to bug and beast as they had never dreamed.
                        <br />
                    </p>
                </section>

                <section class="col-span-7 flex justify-center items-center border-card">
                    <p class="text-2xl capitalize py-4">
                        To be, or not to be, that is the question
                    </p>
                </section>

                <div class="grid grid-cols-12 gap-4 col-span-12 p-12 border-card hover:border-rose-500">
                    <section class="col-span-6 row-span-2 flex flex-col gap-4">
                        <Show when={reporter()}>
                            <WebSupport reporter={reporter()!} />
                        </Show>
                    </section>
                    <section class="col-span-6">
                        <header class="p-2 text-lg text-right">
                            <span class="bg-blue-500 text-white p-2 rounded-md"> ✒️ 尝试字体</span>
                        </header>
                        <TextWriter />
                    </section>
                    <section class="col-span-6 text-center">
                        <span class="text-4xl pr-4"> 中文网字计划</span>
                        <span>Page Design By 江夏尧</span>
                    </section>
                </div>
                <Show when={reporter()}>
                    <BasicMessage reporter={reporter()!}></BasicMessage>
                </Show>

                <header class="p-8 text-lg col-span-6 lg:col-span-12 grid grid-cols-2 border-card hover:border-blue-500 gap-8 ">
                    <div class="place-self-center">
                        <span class="bg-blue-600 text-white rounded-md text-center p-12">
                            ✒️ cn-font-split 打包信息
                        </span>
                    </div>
                    <section class=" h-96 overflow-hidden">
                        <Show when={reporter()}>
                            <TimeAnalyze reporter={reporter()!} />
                        </Show>
                    </section>

                    <section>
                        <Show when={reporter()}>
                            <BundleSizeAnalyze reporter={reporter()!} />
                        </Show>
                    </section>

                    <section>
                        <Show when={reporter()}>
                            <BundleContrast reporter={reporter()!} />
                        </Show>
                    </section>
                </header>
            </div>
        </Layout>
    );
};
