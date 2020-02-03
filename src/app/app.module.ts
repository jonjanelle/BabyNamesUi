import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateNamesComponent } from './state-names/state-names.component';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSelectModule, MatAutocompleteModule, MatCardModule, MatExpansionModule } from '@angular/material'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateNamesService } from './state-names/state-names.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { YearNameGraphsComponent } from './year-names/year-name-graphs/year-name-graphs.component';
import { YearNameTablesComponent } from './year-names/year-name-tables/year-name-tables.component';
import { AppHeaderComponent } from './app-header/app-header.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxChartsModule
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    StateNamesComponent,
    YearNameGraphsComponent,
    YearNameTablesComponent
  ],
  providers: [
    StateNamesService
  ],
  exports: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
