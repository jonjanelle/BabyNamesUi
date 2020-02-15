export interface INumberOneNameOverTime {
    name: string;
    sex: string;
    yearCounts: IYearCount[];
}

interface IYearCount {
    year: number;
    count: number;
    percentOfTotal: number;
}