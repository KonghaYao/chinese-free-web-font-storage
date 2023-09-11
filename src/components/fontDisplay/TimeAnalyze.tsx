import type { FontReporter } from '../fonts/FontReporter';
import { ensureFontMessageString } from '../../utils/ensureFontMessageString';
import prettyBytes from 'pretty-bytes';
import { ECharts } from './ECharts';

/** 打包时间分析 */
export const TimeAnalyze = ({
    message,
    record,
    data,
}: {
    message: FontReporter['message'];
    record: FontReporter['record'];
    data: FontReporter['data'];
}) => {
    const total = record.reduce((col, cur) => col + cur.end - cur.start, 0);
    return (
        <ECharts
            options={{
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                textStyle: {
                    fontFamily: ensureFontMessageString(message.fontFamily),
                },
                title: {
                    top: '5%',
                    left: '5%',
                    right: '10%',
                    text: '打包时间分布图',
                    subtext: `时间单位 ms; 总时间 ${total.toFixed(
                        2
                    )} ms; \n包大小 (分包后) ${prettyBytes(
                        data.reduce((col, cur) => col + cur.size, 0)
                    )}；字体名称 ${ensureFontMessageString(message.fontFamily)}`,
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
                series: record.map((i) => {
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
            }}
        ></ECharts>
    );
};
