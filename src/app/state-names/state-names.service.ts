import { Injectable } from '@angular/core';
import { IStateBabyName } from './models/IStateBabyName';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { IState } from './models/IState';

@Injectable({
  providedIn: 'root',
})
export class StateNamesService {
  private readonly stateBabyNameUrl: string = Constants.baseUrl + 'api/StateBabyNames';
  private readonly stateUrl: string = Constants.baseUrl + "api/States";

  constructor(
      private http: HttpClient
  ) { }

  public getAllNames(stateAbbreviation: string): Observable<IStateBabyName[]> {
    return this.http.get<IStateBabyName[]>(this.stateBabyNameUrl+`?state=${stateAbbreviation}`);
  }

  public getStates(): Observable<IState[]> {
      return this.http.get<IState[]>(this.stateUrl);
  }
}