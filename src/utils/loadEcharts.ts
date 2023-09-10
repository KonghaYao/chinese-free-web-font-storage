
export const loadEcharts = async () => {
    const echarts = await import('echarts/core')
    const { TooltipComponent, GridComponent, LegendComponent, TitleComponent } = await import("echarts/components")
    const { BarChart } = await import('echarts/charts');
    const { CanvasRenderer } = await import('echarts/renderers');
    echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer, TitleComponent]);
    return echarts
}
