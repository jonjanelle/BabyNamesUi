import { Component, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IYearBabyName } from '../models/IYearBabyName';
import { MatPaginator, MatTableDataSource, MatSort, MatAutocompleteSelectedEvent } from '@angular/material';
import { finalize, filter, startWith, map } from 'rxjs/operators';
import { YearNamesService } from '../year-names.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { Utilities } from 'src/app/core/utilities';
// https://localhost:44365/api/YearBabyNames?order=year desc&name=iris&sex=f&year=2018&top=100&exactNameMatch=true
@Component({
  selector: 'year-name-tables',
  templateUrl: './year-name-tables.component.html',
  styleUrls: ['./year-name-tables.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YearNameTablesComponent {
  public readonly title: string = 'Year Baby Names';

  //Name data
  public displayedColumns: string[] = ['name', 'count', 'year', 'sex', 'state'];
  public dataSource: MatTableDataSource<IYearBabyName>;
  public namesLoading: boolean;
  
  // Year filter
  public readonly yearOptions = Utilities.range(1910, 2018).sort((a, b) => a > b ? -1 : 1).map(v => v.toString());
  public filteredYears: Observable<string[]>;
  public yearControl: FormControl;
  
  //name filter
  public nameFilter: string;
  public exactNameMatch: boolean;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private stateNamesService: YearNamesService) {
    this.yearControl = new FormControl();
    this.initYearFilter();
  }

  // Start in-memory filtering //
  private readonly filerIndex = { name: 0, exactNameMatch: 1, year: 2 };
  public onFilterChange(addBlank: boolean = false): void {
    let filterString = `${this.nameFilter};${!!this.exactNameMatch};${this.yearControl.value}`;
    if (addBlank)
      this.dataSource.filter = filterString + ";";
    else
      this.dataSource.filter = filterString;

    console.log(this.dataSource);
  }

  private customFilter(data: IYearBabyName, filter: string) {
    const filterComponents: string[] = filter.split(";");
    let predicate = true;
    if (filterComponents[this.filerIndex.year] != "null" && filterComponents[this.filerIndex.year] != "undefined" && filterComponents[this.filerIndex.year].length > 0) {
      predicate = predicate && (data.year.toString().startsWith(filterComponents[this.filerIndex.year]));
    }

    if (filterComponents[this.filerIndex.name] != "null" && filterComponents[this.filerIndex.name] != "undefined" && filterComponents[this.filerIndex.name].length > 0) {
      if (filterComponents[this.filerIndex.exactNameMatch] === "true") 
        predicate = predicate && data.name.toLowerCase() == filterComponents[this.filerIndex.name].toLowerCase().trim();
      else 
        predicate = predicate && data.name.toLowerCase().startsWith(filterComponents[this.filerIndex.name].toLowerCase().trim());
    }
    return predicate;
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
  // End in-memory filtering //

  
  // Start api call filtering //
  public onStateSelected(stateFilter: MatAutocompleteSelectedEvent) {
    this.getNameData(stateFilter.option.value);
  }

  
  private getNameData(stateAbbreviation: string): void {
    // this.namesLoading = true;
    // this.stateNamesService.getAllNames(stateAbbreviation)
    // .pipe(finalize(() => this.namesLoading = false))
    // .subscribe(nameData => {
    //   this.dataSource = new MatTableDataSource<IStateBabyName>(nameData);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.filterPredicate = this.customFilter.bind(this);
    //   this.onFilterChange(true);
    // });
  }
  // End api call filtering //
}
