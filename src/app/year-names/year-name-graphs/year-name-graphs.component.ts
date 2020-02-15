import { Component, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IYearBabyName } from '../models/IYearBabyName';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { finalize, filter, startWith, map, single } from 'rxjs/operators';
import { YearNamesService } from '../year-names.service';
import { FormControl } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { IFilter } from 'src/app/models/IFilter';
import { Utilities } from 'src/app/core/utilities';
import { IVerticalBarChartParams } from 'src/app/models/IVerticalBarChartParams';
import { ILineChartParams, ILineChartData } from 'src/app/models/ILineChartParams';
import { INumberOneNameOverTime } from '../models/INumberOneNameOverTime';
import { IChartType } from '../models/IChartType';

@Component({
	selector: 'year-name-graphs',
	templateUrl: './year-name-graphs.component.html',
	styleUrls: ['./year-name-graphs.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class YearNameGraphsComponent {

	public readonly topNByYear: string = "TopNByYear";
	public readonly numberOneOverTime: string = "NumberOneOverTime";
	public readonly nameOverTime: string = "NameOverTime";
	
	public selectedChart: string = this.topNByYear;
	
	//Filter flags 
	public showYearFilter: boolean = true;
	public showNameFilter: boolean = false; //Also exact name match

	// Year filter
	public readonly yearOptions = Utilities.range(1910, 2018).sort((a, b) => a > b ? -1 : 1).map(v => v.toString());
	public filteredYears: Observable<string[]>;
	public yearControl: FormControl;
	
	//name filter
	public nameFilter: string;
	public exactNameMatch: boolean;

	public chartTypes: IChartType[] = [
		{label: "Top 15 by year", value: this.topNByYear},
		{label: "Name over time", value: this.numberOneOverTime},
		{label: "#1's over time", value: this.numberOneOverTime}
	];

	constructor(private yearNamesService: YearNamesService) {
		this.initYearFilter();
	}

	public onChangeChart(newChartType: string) {
		this.selectedChart = newChartType;
		console.log(this.selectedChart)
		if (this.selectedChart === this.topNByYear) {
			this.showNameFilter = false;
			this.showYearFilter = true;
		} else if (this.selectedChart === this.numberOneOverTime) {
			this.showNameFilter = false;
			this.showYearFilter = false;
			//need new filtering options for this type
		}
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
}
