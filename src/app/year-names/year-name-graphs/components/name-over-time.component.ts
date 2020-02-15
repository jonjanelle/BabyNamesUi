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
export class NameOverTimeComponent implements OnInit {
    public girlNameOverTimeParams: ILineChartParams;
    public boyNameOverTimeParams: ILineChartParams;
    
    constructor(
        private yearNamesService: YearNamesService
    ) {
        this.girlNameOverTimeParams = {
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
		this.boyNameOverTimeParams = {
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
        this.boyNameOverTimeParams.isLoading = true;
        this.girlNameOverTimeParams.isLoading = true;
		forkJoin(
			this.yearNamesService.getNumberOneNamesOverTime([{ field: "sex", value: 'm' }]),
			this.yearNamesService.getNumberOneNamesOverTime([{ field: "sex", value: 'f' }])
		).subscribe(data => {
			this.boyNameOverTimeParams.results = this.numberOneToChartData(data[0]);
            this.girlNameOverTimeParams.results = this.numberOneToChartData(data[1]);
            this.boyNameOverTimeParams.isLoading = false;
            this.girlNameOverTimeParams.isLoading = false;
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