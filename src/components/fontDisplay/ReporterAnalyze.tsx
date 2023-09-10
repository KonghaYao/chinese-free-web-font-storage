import { atom, reflect, type Atom } from '@cn-ui/reactive';
import { onMount } from 'solid-js';
import type { FontReporter } from '../fonts/FontReporter';
import { ensureFontMessageString } from '../../utils/ensureFontMessageString';
import { loadEcharts } from '../../utils/loadEcharts';
import prettyBytes from 'pretty-bytes';

export const ReporterAnalyze = (props: { reporter: FontReporter }) => {
    const reporter = atom(props.reporter);
    return (
        <div>
            <TimeAnalyze reporter={reporter}></TimeAnalyze>
        </div>
    );
};

/** 打包时间分析 */
const TimeAnalyze = ({ reporter }: { reporter: Atom<FontReporter> }) => {
    const record = reflect(() => reporter().record);
    const message = reflect(() => reporter().message);
    // record.pop(); // 最后一个记录是没有用的
    const total = record().reduce((col, cur) => col + cur.end - cur.start, 0);
    const chartDom = atom(null);
    // console.log(record, total);

    onMount(async () => {
        const echarts = await loadEcharts();
        const myChart = echarts.init(chartDom());

        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            textStyle: {
                fontFamily: ensureFontMessageString(reporter().message.fontFamily),
            },
            title: {
                top: '5%',
                left: '5%',
                right: '10%',
                text: '打包时间分布图',
                subtext: `时间单位 ms; 总时间 ${total.toFixed(2)} ms; 包大小 (分包后) ${prettyBytes(
                    reporter().data.reduce((col, cur) => col + cur.size, 0)
                )}；字体名称 ${ensureFontMessageString(message().fontFamily)}`,
            },
            legend: {
                top: '20%',
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                top: '35%',
            },
            xAxis: {
                type: 'value',
            },
            yAxis: {
                type: 'category',
                data: ['时间轴'],
            },
            series: record().map((i) => {
                return {
                    name: i.name,
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: i.end - i.start > 100,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                    data: [parseFloat((i.end - i.start).toFixed(2))],
                };
            }),
        });
    });
    return (
        <div
            ref={chartDom}
            class="m-auto rounded-xl bg-white   "
            style="width: 600px;height:400px;"
        ></div>
    );
};
