import { Component, ViewEncapsulation, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { YearNamesService } from '../../year-names.service';
import { IVerticalBarChartParams } from 'src/app/models/IVerticalBarChartParams';
import { Observable } from 'rxjs';
import { IYearBabyName } from '../../models/IYearBabyName';
import { IFilter } from 'src/app/models/IFilter';
import { SexOptions } from '../../models/SexOptions';
import { Utilities } from 'src/app/core/utilities';
import { isNullOrUndefined } from 'util';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'top-by-year',
	templateUrl: './top-by-year.component.html',
	styleUrls: ['./top-by-year.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TopByYearComponent implements OnInit, OnChanges {
    @Input() yearFilter: string | null;
    private sexFilter: string;
    
    public girlVerticalBarParams: IVerticalBarChartParams;
	public boyVerticalBarParams: IVerticalBarChartParams;
    public combinedVerticalBarParams: IVerticalBarChartParams;
    public nResults: number = 15;

    constructor(
        private yearNamesService: YearNamesService
    ) {
		this.girlVerticalBarParams = {
			view: undefined,
			showXAxis: true,
			showYAxis: true,
			gradient: false,
			showLegend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Name',
			showYAxisLabel: true,
			yAxisLabel: 'Count',
			barChartData: [],
            colorScheme: { domain: ['#ff7c7c'] },
            isLoading: true
        };
        
		this.boyVerticalBarParams = {
			view: undefined,
			showXAxis: true,
			showYAxis: true,
			gradient: false,
			showLegend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Name',
			showYAxisLabel: true,
			yAxisLabel: 'Count',
			barChartData: [],
            colorScheme: { domain: ['#7c7cff'] },
            isLoading: true
        };
        
		this.combinedVerticalBarParams = {
			view: undefined,
			showXAxis: true,
			showYAxis: true,
			gradient: false,
			showLegend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Name',
			showYAxisLabel: true,
			yAxisLabel: 'Count',
			barChartData: [],
            colorScheme: { domain: ['#cc7acc'] },
            isLoading: true
		};
    }

    ngOnInit() {
        this.refreshData();
    }

	ngOnChanges(changes: SimpleChanges) {
		if (!isNullOrUndefined(changes['yearFilter']))
			this.refreshData();
	}

    private refreshData(): void {
		this.getCombinedTopN(this.nResults);
		this.getGirlTopN(this.nResults);
		this.getBoyTopN(this.nResults);
    }
    
    private getBoyTopN(n: number) {
		this.sexFilter = SexOptions.Boy;
		this.getData(n).subscribe(names => {
			this.boyVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
	}
	
	private getGirlTopN(n: number) {
        this.sexFilter = SexOptions.Girl;
        this.girlVerticalBarParams.isLoading = true;
        this.getData(n).pipe(finalize(() => this.girlVerticalBarParams.isLoading = false))
        .subscribe(names => {
			this.girlVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
	}
	
	private getCombinedTopN(n: number) {
        this.sexFilter = SexOptions.Any;
        this.combinedVerticalBarParams.isLoading = true;
        this.getData(n).pipe(finalize(() => this.combinedVerticalBarParams.isLoading = false))
        .subscribe(names => {
			this.combinedVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
    }
    
    private getData(take: number): Observable<IYearBabyName[]> {
		const filters = this.getFilters();
		filters.push({ field: "top", value: take });
		filters.push({ field: "orderBy", value: "count desc" });

		return this.yearNamesService.getAllNames(filters);
    }
    
    private getFilters(): IFilter[] {
		let filters: IFilter[] = [];
		
		//not relevant to this graph.
		// if (!isNullOrUndefined(this.nameFilter) && !Utilities.isNullOrUndefinedString(this.nameFilter) && this.nameFilter.length > 0) {
     	// 	if (this.exactNameMatch) 
        // 		filters.push({ field: "exactNameMatch", value: true });  
      	// 	filters.push({ field: "name", value: this.nameFilter })
		// }

		if (!Utilities.isNullOrUndefinedString(this.yearFilter))
			filters.push({ field: "year", value: this.yearFilter })
			
		if (!isNullOrUndefined(this.sexFilter) && this.sexFilter !== SexOptions.Any) {
			if (this.sexFilter === SexOptions.Boy)
				filters.push({ field: "sex", value: 'M' })
			else if (this.sexFilter === SexOptions.Girl)
				filters.push({ field: "sex", value: 'F' })
		}

		return filters;
	}
    
}
