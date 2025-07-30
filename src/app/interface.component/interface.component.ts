import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { InterfaceService } from './interface.service';

@Component({
    selector: 'interface',
    templateUrl:'./interface.component.html',
    providers:[InterfaceService] 
})

export class InterfaceComponent implements OnInit{

	constructor(private router:Router,private interfaceService:InterfaceService){}

	ngOnInit(){
		var scase = this.interfaceService.getSwitchcase();
		if(scase == "product-view-switch"){
			this.interfaceService.setSwitchCase();
			this.interfaceService.setNextPage('compare-instore-selector');
			this.router.navigate(['/product-view']);
		}
		else{
			this.router.navigate(['/loading']);	
		}
	}
}