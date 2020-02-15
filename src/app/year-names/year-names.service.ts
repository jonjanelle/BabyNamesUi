import { Injectable } from '@angular/core';
import { IYearBabyName } from './models/IYearBabyName';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { IFilter } from '../models/IFilter';
import { QueryStringBuilder } from '../models/QueryStringBuilder';
import { INumberOneNameOverTime } from './models/INumberOneNameOverTime';

@Injectable({
  providedIn: 'root',
})
export class YearNamesService {
  private readonly yearBabyNameUrl: string = Constants.baseUrl + 'api/YearBabyNames';
  private readonly numberOneNamesOverTimeUrl: string = Constants.baseUrl + 'api/NumberOneNamesOverTime';

  constructor(private http: HttpClient) { 

  }
    
  public getAllNames(filters: IFilter[]): Observable<IYearBabyName[]> {
    return this.http.get<IYearBabyName[]>(this.yearBabyNameUrl+`?${new QueryStringBuilder(filters).build()}`);
  }
  
  public getNumberOneNamesOverTime(filters: IFilter[]): Observable<INumberOneNameOverTime[]> {
    return this.http.get<INumberOneNameOverTime[]>(this.numberOneNamesOverTimeUrl+`?${new QueryStringBuilder(filters).build()}`);
  }
}