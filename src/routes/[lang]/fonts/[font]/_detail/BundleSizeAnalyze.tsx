import { ECharts } from '../../../../../components/ECharts';
import type { FontReporter } from 'cn-font-split';
/** 打包分片分析*/
export const BundleSizeAnalyze = (props: { reporter: FontReporter }) => {
    const subsetDetail = props.reporter.subsetDetail!;

    return (
        <ECharts
            options={{
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: subsetDetail.map((i) => i.fileName!.slice(0, 7)),
                },
                grid: {
                    top: '25%',
                },
                legend: {
                    top: '5%',
                    data: ['分包大小', '分包字符数'],
                    right: '5%',
                },
                yAxis: [
                    {
                        name: '分包大小（KB）',
                        type: 'value',
                    },
                    {
                        name: '分包字符数',
                        nameLocation: 'start',
                        alignTicks: true,
                        type: 'value',
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                },
                textStyle: {
                    fontFamily: props.reporter.css!.family,
                },
                title: {
                    top: '5%',
                    left: '5%',
                    text: props.reporter.css!.family,
                    subtext: `总共 ${subsetDetail.length} 分包; `,
                },
                series: [
                    {
                        name: '分包大小',
                        avoidLabelOverlap: true,
                        type: 'line',
                        symbol: 'none',
                        sampling: 'lttb',
                        itemStyle: {
                            color: 'rgb(255, 70, 131)',
                        },

                        markLine: {
                            data: [{ type: 'average', name: 'Avg' }],
                        },
                        data: subsetDetail.map((i) => i.bytes! >> 10),
                    },
                    {
                        name: '分包字符数',
                        type: 'line',
                        yAxisIndex: 1,
                        markLine: {
                            data: [{ type: 'average', name: 'Avg' }],
                        },
                        data: subsetDetail.map((i) => i.chars!.length),
                    },
                ],
            }}
            onReady={(chart) => {}}
        ></ECharts>
    );
};
