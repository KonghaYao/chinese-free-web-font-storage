import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    MarkLineComponent,
} from 'echarts/components';
import { LineChart, BarChart, PieChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';
echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    DataZoomComponent,
    LineChart,
    LegendComponent,
    BarChart,
    MarkLineComponent,
    SVGRenderer,
    UniversalTransition,
    PieChart,
]);
export { echarts };
