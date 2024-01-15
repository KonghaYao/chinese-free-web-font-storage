import { reflect, resource, type Atom } from '@cn-ui/reactive';
import prettyBytes from 'pretty-bytes';
import { Show } from 'solid-js';
import { ECharts } from '../fontDisplay/ECharts';
export interface CDNData {
    requestId: string;
    list: {
        country: string;
        avgLatency: number;
        avgTransferRate: number;
        request: number;
        bandwidth: number;
    }[];
    data: {
        trafficCacheStatisticsModel: {
            trafficCache: {
                total: number;
                cache: number;
                unCache: number;
                cacheRatio: number;
                unCacheRatio: number;
            };
            trafficCacheModels: {
                total: number;
                time: string;
                cache: number;
                unCache: number;
                cacheRatio: number;
                unCacheRatio: number;
            }[];
        };
        continentTrafficStatisticsModels: {
            total: number;
            baseContinentModel: {
                continentName: string;
            };
            ratio: number;
        }[];
        edgeNodeTrafficStatisticsModels: {
            total: number;
            baseEdgeNodeModel: {
                edgeNodeName: string;
                edgeNodeUUID: string;
                city: string;
                country: string;
            };
        }[];
        resourceTrafficStatisticsModels: {
            total: number;
            baseResourceModel: {
                resourceName: string;
                resourceUUID: string;
                status: string;
            };
        }[];
    };
}
export const CDNAnalyze = () => {
    const data = resource<CDNData>(() => {
        return fetch('https://lightcdn-record.deno.dev').then((res) => res.json());
    });
    const trafficCache = reflect(() => data()?.data.trafficCacheStatisticsModel.trafficCache);
    const trafficCacheModels = reflect(
        () => data()?.data.trafficCacheStatisticsModel.trafficCacheModels
    );
    const trafficAreaList = reflect(() => data()?.list);
    return (
        <>
            <h1 class=" my-12 text-center text-3xl leading-9">
                中文网字计划 CDN 分析 -- 近 30 天使用情况
            </h1>
            <section class="m-auto grid max-w-7xl grid-cols-3 gap-4">
                <div>
                    <Show when={trafficCache()}>
                        <CacheRato trafficCache={trafficCache}></CacheRato>
                    </Show>
                </div>
                <div class=" col-span-2">
                    <Show when={trafficCacheModels()}>
                        <CacheRatoModels trafficCacheModels={trafficCacheModels}></CacheRatoModels>
                    </Show>
                </div>
                <div class=" col-span-1">
                    <Show when={trafficCacheModels()}></Show>
                </div>
                <div class=" col-span-2">
                    <Show when={trafficCacheModels()}>
                        <TrafficAreaList trafficAreaList={trafficAreaList}></TrafficAreaList>
                    </Show>
                </div>
            </section>
        </>
    );
};

/** 缓存请求数 */
const TrafficAreaList = ({ trafficAreaList }: { trafficAreaList: Atom<CDNData['list']> }) => {
    return (
        <ECharts
            options={{
                title: {
                    text: 'CDN 请求数',
                    left: 20,
                    top: 20,
                },
                tooltip: {
                    trigger: 'item',
                    formatter(p) {
                        if (p.data)
                            return `${p.data.name}<br> ${p.data.request}次 ${prettyBytes(
                                p.data.bandwidth
                            )}<br> 均请求 ${prettyBytes(
                                p.data.avgTransferRate
                            )}<br> 平均延迟 ${Math.ceil(p.data.avgLatency)} ms`;
                    },
                },
                legend: {
                    show: false,
                    bottom: '5%',
                    left: '',
                },
                series: [
                    {
                        name: 'CDN 请求数',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        data: trafficAreaList().map((i) => {
                            return {
                                value: i.request,
                                ...i,
                                name: i.country,
                            };
                        }),
                    },
                ],
            }}
        ></ECharts>
    );
};

/** 缓存曲线图 */
const CacheRatoModels = ({
    trafficCacheModels,
}: {
    trafficCacheModels: Atom<CDNData['data']['trafficCacheStatisticsModel']['trafficCacheModels']>;
}) => {
    return (
        <ECharts
            options={{
                title: {
                    text: 'CDN 每日使用情况',
                    left: 'center',
                    top: 20,
                },
                tooltip: {
                    trigger: 'item',
                    formatter(p) {
                        return [`${p.name}`, p.seriesName + ' ' + prettyBytes(p.value)].join(
                            '<br>'
                        );
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: trafficCacheModels().map((i) => i.time.split(' ')[0]),
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter(p) {
                                return prettyBytes(p);
                            },
                        },
                    },
                ],
                legend: {
                    bottom: '5%',
                    left: 'center',
                },
                series: [
                    {
                        name: '已经缓存',
                        type: 'bar',
                        barWidth: '60%',
                        stack: 'a',
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均缓存',
                                    label: {
                                        formatter(b) {
                                            return prettyBytes(b.value);
                                        },
                                    },
                                },
                            ],
                        },
                        data: trafficCacheModels().map((i) => i.cache),
                    },
                    {
                        name: '未缓存',
                        type: 'bar',
                        barWidth: '60%',
                        stack: 'a',
                        data: trafficCacheModels().map((i) => i.unCache),
                    },
                ],
            }}
        ></ECharts>
    );
};

/** 缓存比例饼图 */
const CacheRato = ({
    trafficCache,
}: {
    trafficCache: Atom<CDNData['data']['trafficCacheStatisticsModel']['trafficCache']>;
}) => {
    return (
        <ECharts
            options={{
                title: {
                    text: 'CDN 缓存结构',
                    left: 'center',
                    top: 20,
                },
                tooltip: {
                    trigger: 'item',
                    formatter(p) {
                        return prettyBytes(p.value);
                    },
                },
                legend: {
                    bottom: '5%',
                    left: 'center',
                },
                series: [
                    {
                        name: 'CDN 缓存结构',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        data: [
                            {
                                value: trafficCache().unCache,
                                name: `缓存 ${prettyBytes(trafficCache().unCache)} ${
                                    trafficCache().unCacheRatio * 100
                                } % `,
                            },
                            {
                                value: trafficCache().cache,
                                name: `缓存 ${prettyBytes(trafficCache().cache)} ${
                                    trafficCache().cacheRatio * 100
                                } % `,
                            },
                        ],
                    },
                ],
            }}
        ></ECharts>
    );
};
