import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ILineChartParams, ILineChartData } from 'src/app/models/ILineChartParams';
import { YearNamesService } from '../../year-names.service';
import { INumberOneNameOverTime } from '../../models/INumberOneNameOverTime';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'number-one-over-time',
	templateUrl: './number-one-over-time.component.html',
	styleUrls: ['./number-one-over-time.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NumberOneOverTimeComponent implements OnInit {
    public girlNumberOneNamesOverTimeParams: ILineChartParams;
    public boyNumberOneNamesOverTimeParams: ILineChartParams;
    
    constructor(
        private yearNamesService: YearNamesService
    ) {
        this.girlNumberOneNamesOverTimeParams = {
			xAxis: true,
			yAxis: true,
			gradient: false,
			legend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Year',
			yAxisLabel: 'Percent',
			showYAxisLabel: true,
			scheme: {
				domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
			},
			autoScale: true,
			results: [],
			isLoading: true
		};
		this.boyNumberOneNamesOverTimeParams = {
			xAxis: true,
			yAxis: true,
			gradient: false,
			legend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Year',
			yAxisLabel: 'Percent',
			showYAxisLabel: true,
			scheme: {
				domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
			},
			autoScale: true,
			results: [],
			isLoading: true
        };
        
    }
    
    ngOnInit() {
        this.getData();
    }

    private getData(): void {
        this.boyNumberOneNamesOverTimeParams.isLoading = true;
        this.girlNumberOneNamesOverTimeParams.isLoading = true;
		forkJoin(
			this.yearNamesService.getNumberOneNamesOverTime([{ field: "sex", value: 'm' }]),
			this.yearNamesService.getNumberOneNamesOverTime([{ field: "sex", value: 'f' }])
		).subscribe(data => {
			this.boyNumberOneNamesOverTimeParams.results = this.numberOneToChartData(data[0]);
            this.girlNumberOneNamesOverTimeParams.results = this.numberOneToChartData(data[1]);
            this.boyNumberOneNamesOverTimeParams.isLoading = false;
            this.girlNumberOneNamesOverTimeParams.isLoading = false;
		});
	}

	private numberOneToChartData(data: INumberOneNameOverTime[]): ILineChartData[] {
		return data.map(d => ({
			name: d.name,
			series: d.yearCounts.map(yc => ({
				name: yc.year.toString(),
				value: yc.percentOfTotal
			}))
		}));
	}

}