export interface IVerticalBarChartParams {
    showXAxis: boolean ;
    showYAxis: boolean ;
    gradient: boolean;
    showLegend: boolean;
    showXAxisLabel: boolean ;
    xAxisLabel: string;
    showYAxisLabel: boolean ;
    yAxisLabel: string ;
    barChartData: IBarChartData[];
    
    colorScheme: IBarChartColorScheme;
}

interface IBarChartColorScheme {
    domain: string[];
    range?: string[];
}

interface IBarChartData {
    name: string;
    value: number;
}
