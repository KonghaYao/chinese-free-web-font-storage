import type { FontReporter } from '../fonts/FontReporter';
import { ensureFontMessageString } from '../../utils/ensureFontMessageString';
import { UnicodeRange } from '@japont/unicode-range';
import { ECharts } from './ECharts';
/** 打包分片分析*/
export const BundleSizeAnalyze = ({
    message,
    data,
}: {
    data: FontReporter['data'];
    message: FontReporter['message'];
}) => {
    return (
        <ECharts
            options={{
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.map((i) => i.name.slice(0, 7)),
                },
                grid: {
                    top: '20%',
                },
                legend: {
                    top: '5%',
                    data: ['分包大小', '分包字符数'],
                    left: 10,
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
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765',
                        },
                    },
                },
                title: {
                    top: '2%',
                    text: ensureFontMessageString(message.fontFamily),
                    subtext: `总共 ${data.length} 分包; `,
                    left: 'center',
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
        ></ECharts>
    );
};
