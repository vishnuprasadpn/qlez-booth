import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';

@Component({
    selector: 'thankyou',
    templateUrl:'./thankYou.component.html',
    styleUrls: ['./thankYou.component.css'],
    providers:[] 
})

export class ThankYouComponent implements OnInit{

	constructor(private router:Router){

		setTimeout(() => {

			this.router.navigate(['/welcome']);

    	}, 4000);

	}

	ngOnInit(){}

}