import { atom } from '@cn-ui/reactive';
import { type EChartsCoreOption, type ECharts as _ECharts } from 'echarts/core';
import { createResource } from 'solid-js';
const renderSVGChart = async (reporter: EChartsCoreOption, dom: HTMLElement | null = null) => {
    const { echarts } = await import('../routes/[lang]/fonts/[font]/_detail/registerEcharts');
    const myChart = echarts.init(dom, null, {
        renderer: 'svg',
        ssr: true,
        height: 400,
        width: 600,
    });
    myChart.setOption(reporter);

    return myChart;
};

export const ECharts = (props: {
    options: EChartsCoreOption;
    onReady?: (chart: _ECharts) => void;
    height?: string;
}) => {
    const dom = atom<HTMLElement | null>(null);
    const [info] = createResource(
        () => props.options,
        async (options) => {
            return (await renderSVGChart(options))!.renderToSVGString();
        }
    );
    // let myChart: _ECharts;
    // if (isServer) {

    // } else {
    //     onMount(async () => {
    //         !isServer && (dom()!.innerHTML = '');
    //         myChart = await renderSVGChart(props.options, dom());
    //         setTimeout(() => {
    //             myChart.resize({
    //                 height: props.height ? parseInt(props.height) : 400,
    //                 width: 'auto',
    //             });
    //         }, 0);
    //         props.onReady && props.onReady(myChart);
    //     });
    // }
    // onCleanup(() => {
    //     myChart?.dispose();
    // });
    return (
        <div
            ref={dom}
            class="m-auto flex w-full items-center justify-center rounded-xl bg-white"
            style={{ height: props.height ?? '400px' }}
            innerHTML={info() || ''}
        ></div>
    );
};
