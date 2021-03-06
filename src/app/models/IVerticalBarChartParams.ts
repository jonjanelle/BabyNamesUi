export interface IVerticalBarChartParams {
    view?: number[]; //w, h dimensions in px
    showXAxis: boolean;
    showYAxis: boolean;
    gradient: boolean;
    showLegend: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    showYAxisLabel: boolean;
    yAxisLabel: string;
    barChartData: IBarChartData[];
    colorScheme: IBarChartColorScheme;
    isLoading: boolean;
}

interface IBarChartColorScheme {
    domain: string[];
    range?: string[];
}

interface IBarChartData {
    name: string;
    value: number;
}
