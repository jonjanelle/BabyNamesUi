import { Component, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IYearBabyName } from '../models/IYearBabyName';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { finalize, filter, startWith, map } from 'rxjs/operators';
import { YearNamesService } from '../year-names.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { IFilter } from 'src/app/models/IFilter';
import { Utilities } from 'src/app/core/utilities';
import { IVerticalBarChartParams } from 'src/app/models/IVerticalBarChartParams';
// https://localhost:44365/api/YearBabyNames?order=year desc&name=iris&sex=f&year=2018&top=100&exactNameMatch=true
@Component({
	selector: 'year-name-graphs',
	templateUrl: './year-name-graphs.component.html',
	styleUrls: ['./year-name-graphs.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class YearNameGraphsComponent {
	public readonly title: string = 'All Baby Names - Graphs';
	public isLoading: boolean = true;
	public nResults: number = 15;

	// Year filter
	public readonly yearOptions = Utilities.range(1910, 2018).sort((a, b) => a > b ? -1 : 1).map(v => v.toString());
	public filteredYears: Observable<string[]>;
	public yearControl: FormControl;
	
	//name filter
	public nameFilter: string;
	public exactNameMatch: boolean;

	//sex filter
	public sexOptions = {Any: "Any", Boy: "Boy", Girl: "Girl"};
	public sexFilter: string = this.sexOptions.Any;

	//chart config
	public girlVerticalBarParams: IVerticalBarChartParams;
	public boyVerticalBarParams: IVerticalBarChartParams;
	public combinedVerticalBarParams: IVerticalBarChartParams;

	public chartTypeLabels: string[] = ["Top 20 by year", "Name over time", "Top name over time"];
	public readonly chartType = {
		top10ByYear: this.chartTypeLabels[0],
		nameOverTime: this.chartTypeLabels[1]
	};
	
	public queryFilters: IFilter[] = [];

	constructor(private yearNamesService: YearNamesService) {
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
			colorScheme: { domain: ['#ff7c7c'] }
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
			colorScheme: { domain: ['#7c7cff'] }
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
			colorScheme: { domain: ['#cc7acc'] }
		};

		this.initYearFilter();
		this.refreshData();
	}

	private refreshData(): void {
		this.getCombinedTopN(this.nResults);
		this.getGirlTopN(this.nResults);
		this.getBoyTopN(this.nResults);
	}

	public getTop10Data(): void {
		
	}

	private initYearFilter(): void {
		this.yearControl = new FormControl();
		this.yearControl.setValue(2018);
		this.filteredYears = this.yearControl.valueChanges
		.pipe(
			startWith(''),
			map(year => {
				if (year)
					return this._filterYears(year); 
				else
					return this.yearOptions.slice()
			})
		);
	}

	private _filterYears(value: string): string[] {
		var filterValue = value.toString();
		return this.yearOptions.filter(year => year.toString().indexOf(filterValue) === 0);
	}

	public onYearFilterChange() {
		console.log(this.yearControl.value);
		this.refreshData();
	}

	public onYearSelected(stateFilter: MatAutocompleteSelectedEvent) {
		this.getData(this.nResults);
	}

	private getBoyTopN(n: number) {
		this.sexFilter = this.sexOptions.Boy;
		this.getData(n).subscribe(names => {
			this.boyVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
	}
	
	private getGirlTopN(n: number) {
		this.sexFilter = this.sexOptions.Girl;
		this.getData(n).subscribe(names => {
			this.girlVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
	}
	
	private getCombinedTopN(n: number) {
		this.sexFilter = this.sexOptions.Any;
		this.getData(n).subscribe(names => {
			this.combinedVerticalBarParams.barChartData = names.map((n) => ({name: n.name, value: n.count}));
		});
	}

	private getData(take: number): Observable<IYearBabyName[]> {
		this.isLoading = true;
		const filters = this.getFilters();
		filters.push({ field: "top", value: take })
		filters.push({ field: "orderBy", value: "count desc" })

		return this.yearNamesService.getAllNames(filters).pipe(finalize(() => this.isLoading = false));
	}

	private getFilters(): IFilter[] {
		let filters: IFilter[] = [];
		
		if (!isNullOrUndefined(this.nameFilter) && !Utilities.isNullOrUndefinedString(this.nameFilter) && this.nameFilter.length > 0) {
      if (this.exactNameMatch) 
        filters.push({ field: "exactNameMatch", value: true });  
      filters.push({ field: "name", value: this.nameFilter })
		}

		if (!Utilities.isNullOrUndefinedString(this.yearControl.value) && this.yearControl.value > 0)
			filters.push({ field: "year", value: this.yearControl.value })
			
			if (!isNullOrUndefined(this.sexFilter) && this.sexFilter !== this.sexOptions.Any) {
				if (this.sexFilter === this.sexOptions.Boy)
					filters.push({ field: "sex", value: 'M' })
				else if (this.sexFilter === this.sexOptions.Girl)
					filters.push({ field: "sex", value: 'F' })
			}

		return filters;
	}


}
