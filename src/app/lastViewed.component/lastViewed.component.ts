import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { LastViewedService } from './lastViewed.service';

@Component({
    selector: 'last-viewed',
    templateUrl:'./lastViewed.component.html',
    styleUrls: ['./lastViewed.component.css'],
    providers:[LastViewedService] 
})

export class LastViewedComponent implements OnInit{

	@ViewChildren('pStar') pStars;

	lastViewedProducts:[{}];
	
	//Number of Stars
	stars = [1,2,3,4,5];

	constructor(private lastViewedService: LastViewedService,private router:Router){}
	
	ngOnInit(){
		this.lastViewedProducts = this.lastViewedService.getLastViewedProducts();
	}

	ngAfterViewChecked(){

		for(var i =0;i<this.lastViewedProducts.length;i++){
			this.pStars.toArray().find((e) => {
				var rem = ""+e.nativeElement.id %10;
				var custNo =  parseInt("" + e.nativeElement.id /10);
				if(""+i==""+custNo){
					if(rem<=this.lastViewedProducts[i]["productRating"]){
						e.nativeElement.setAttribute("style","color: yellow;");
					}	
				}
			});
		}
   	}

	viewProductDetails(product){
		this.lastViewedService.setNextpage("product_view");
		this.lastViewedService.setViewProduct(product);
		document.getElementById("myBucket").style.height="0%";
		this.router.navigate(['/interface']);
	}

}