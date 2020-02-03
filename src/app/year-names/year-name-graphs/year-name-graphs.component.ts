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

	// Year filter
	public readonly yearOptions = Utilities.range(1910, 2018).sort((a, b) => a > b ? -1 : 1).map(v => v.toString());
	public filteredYears: Observable<string[]>;
	public yearControl: FormControl;
	
	//name filter
	public nameFilter: string;
	public exactNameMatch: boolean;

	//sex filter
	public sexFilter: string;

	//chart config
	public verticalBarParams: IVerticalBarChartParams;

	public chartTypeLabels = ["Top 10 Names by Year", "Name over Time"];
	public readonly chartType = {
		top10ByYear: this.chartTypeLabels[0],
		nameOverTime: this.chartTypeLabels[1]
	};
	
	public queryFilters: IFilter[] = [];

	constructor(private yearNamesService: YearNamesService) {
		this.verticalBarParams = {
			showXAxis: true,
			showYAxis: true,
			gradient: false,
			showLegend: false,
			showXAxisLabel: true,
			xAxisLabel: 'Year',
			showYAxisLabel: true,
			yAxisLabel: 'Count',
			barChartData: [],
			colorScheme: { domain: ['#5AA454'] }
		};

		this.yearControl = new FormControl();
		this.initYearFilter();
	}

	public getTop10Data(filter: IFilter[]): void {

	}

	private initYearFilter(): void {
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

	public onFilterChange() {
		console.log("filter change");
	}

	public onYearSelected(stateFilter: MatAutocompleteSelectedEvent) {
		this.getData(stateFilter.option.value);
	}

	
	private getData(filters: IFilter[]): void {
		this.isLoading = true;
		this.yearNamesService.getAllNames(filters)
		.pipe(finalize(() => this.isLoading = false))
		.subscribe(nameData => {

		});
	}

	private getFilters(): IFilter[] {
		let filters: IFilter[] = [];
		
		if (!Utilities.isNullOrUndefinedString(this.nameFilter) && this.nameFilter.length > 0) {
      if (this.exactNameMatch) 
        filters.push({ field: "exactNameMatch", value: true });  
      filters.push({ field: "name", value: this.nameFilter })
		}
		
		

  	
		return filters;
	}


}
