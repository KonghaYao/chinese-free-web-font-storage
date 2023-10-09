import { ensureFontMessageString } from '../../utils/ensureFontMessageString';
import { UnicodeRange } from '@japont/unicode-range';
import { ECharts } from './ECharts';
import { AsyncReporterLoader } from './AsyncReporterLoader';
import type { NameTable } from '@konghayao/cn-font-split/dist/templates/reporter';
/** 打包分片分析*/
export const BundleSizeAnalyze = AsyncReporterLoader((props) => {
    const { data } = props.reporter;

    const message = (props.reporter.message.windows as NameTable) ?? props.reporter.message;
    return (
        <ECharts
            options={{
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.map((i) => i.name.slice(0, 7)),
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
                    fontFamily: ensureFontMessageString(message.fontFamily),
                },
                title: {
                    top: '5%',
                    left: '5%',
                    text: ensureFontMessageString(message.fontFamily),
                    subtext: `总共 ${data.length} 分包; `,
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
                        data: data.map((i) => i.size >> 10),
                    },
                    {
                        name: '分包字符数',
                        type: 'line',
                        yAxisIndex: 1,
                        markLine: {
                            data: [{ type: 'average', name: 'Avg' }],
                        },
                        data: data.map((i) => UnicodeRange.parse(i.chars.split(',')).length),
                    },
                ],
            }}
            onReady={(chart) => {
                chart.on('click', (value) => {
                    const hash = value.name;

                    console.log(
                        String.fromCharCode(
                            ...UnicodeRange.parse(
                                props.reporter.data
                                    .find((i) => i.name.startsWith(hash))
                                    ?.chars.split(',') || []
                            )
                        )
                    );
                });
            }}
        ></ECharts>
    );
});
