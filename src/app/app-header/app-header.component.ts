import { Component, ViewChild, OnInit, ViewEncapsulation, AfterViewInit, Input } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent {
	@Input() title: string;

	constructor() {

	}

	
}
