import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StateNamesComponent } from '../app/state-names/state-names.component';
import { AppComponent } from './app.component';
import { YearNameGraphsComponent } from './year-names/year-name-graphs/year-name-graphs.component';
 
const routes: Routes = [
  { path: '', redirectTo: 'state-tables', pathMatch: 'full' },
  { path: 'state-tables', component: StateNamesComponent },
  { path: 'year-charts', component: YearNameGraphsComponent },
  { path: '**', redirectTo: 'state-tables' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }