import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { IStateBabyName } from './models/IStateBabyName';
import { MatPaginator, MatTableDataSource, MatSort, MatAutocompleteSelectedEvent } from '@angular/material';
import { finalize, startWith, map } from 'rxjs/operators';
import { StateNamesService } from './state-names.service';
import { IState } from './models/IState';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Utilities } from '../core/utilities';
import { IYearBabyName } from '../year-names/models/IYearBabyName';

@Component({
  selector: 'state-names',
  templateUrl: './state-names.component.html',
  styleUrls: ['./state-names.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StateNamesComponent {
  public readonly title: string = 'State Baby Names';


  //Name data
  public displayedColumns: string[] = ['name', 'count', 'year', 'sex', 'state'];
  public dataSource: MatTableDataSource<IStateBabyName>;
  public namesLoading: boolean;
  
  //State filter
  public states: IState[];
  public filteredStates: Observable<IState[]>;
  public statesLoading: boolean;
  public stateControl: FormControl;
  
  // Year filter
  public readonly yearOptions = Utilities.range(1910, 2018).sort((a, b) => a > b ? -1 : 1).map(v => v.toString());
  public filteredYears: Observable<string[]>;
  public yearControl: FormControl;
  
  //name filter
  public nameFilter: string;
  public exactNameMatch: boolean;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private stateNamesService: StateNamesService) {
    this.stateControl = new FormControl();
    this.yearControl = new FormControl();
    this.getStateData();
    this.initYearFilter();
  }

  private readonly filerIndex = { name: 0, exactNameMatch: 1, year: 2 };
  public onFilterChange(addBlank: boolean = false): void {
    let filterString = `${this.nameFilter};${!!this.exactNameMatch};${this.yearControl.value}`;
    if (addBlank)
      this.dataSource.filter = filterString + ";";
    else
      this.dataSource.filter = filterString;
  }

  private customFilter(data: IYearBabyName, filter: string) {
    const filterComponents: string[] = filter.split(";");
    let predicate = true;
    if (!Utilities.isNullOrUndefinedString(filterComponents[this.filerIndex.year]) && filterComponents[this.filerIndex.year].length > 0) {
      predicate = predicate && (data.year.toString().startsWith(filterComponents[this.filerIndex.year]));
    }

    if (!Utilities.isNullOrUndefinedString(filterComponents[this.filerIndex.name]) && filterComponents[this.filerIndex.name].length > 0) {
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

  
  // Start api filtering //
  public onStateSelected(stateFilter: MatAutocompleteSelectedEvent) {
    this.getNameData(stateFilter.option.value);
  }

  private getStateData(): void {
    this.statesLoading = true;
    this.stateNamesService.getStates().pipe(
      finalize(() => this.statesLoading = false))
      .subscribe(states => {
      this.states = states;
      this.stateControl.setValue(this.states[0].abbreviation);
      this.getNameData(this.states[0].abbreviation);
      this.filteredStates = this.stateControl.valueChanges
        .pipe(
          startWith(''),
          map(state => {
            if (state) {
              return this._filterStates(state); 
            }
            else
              return this.states.slice()
          })
        );
    });
  }

  private _filterStates(value: string): IState[] {
    const filterValue = value.trim().toLowerCase();
    return this.states.filter(state => state.abbreviation.toLowerCase().indexOf(filterValue) === 0 || state.name.toLowerCase().indexOf(filterValue) === 0);
  }
  
  private getNameData(stateAbbreviation: string): void {
    this.namesLoading = true;
    this.stateNamesService.getAllNames(stateAbbreviation)
    .pipe(finalize(() => this.namesLoading = false))
    .subscribe(nameData => {
      this.dataSource = new MatTableDataSource<IStateBabyName>(nameData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.customFilter.bind(this);
      this.onFilterChange(true);
    });
  }
  // End api filtering //
}