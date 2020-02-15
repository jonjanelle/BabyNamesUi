export interface ILineChartParams {
      scheme: ILineChartColorScheme,
      results: ILineChartData[],
      gradient: boolean;
      xAxis: boolean;
      yAxis: boolean;
      legend: boolean;
      showXAxisLabel: boolean;
      showYAxisLabel: boolean;
      xAxisLabel: string;
      yAxisLabel: string
      autoScale: boolean; 
      isLoading: boolean;
}

interface ILineChartColorScheme {
    domain: string[];
    range?: string[];
}

export interface ILineChartData {
    name: string;
    series: ISeriesPoint[];
}

interface ISeriesPoint {
    name: string;
    value: number;
}
