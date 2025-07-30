import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { LoadingService } from './loading.service';

@Component({
    selector: 'loading',
    templateUrl:'./loading.component.html',
    styleUrls: ['./loading.component.css'],
    providers:[LoadingService] 
})

export class LoadingComponent implements OnInit{

	constructor(private router: Router,private loadingService: LoadingService){}

	ngOnInit(){
		var nextpage = this.loadingService.getNextPage();
		var compareReviewState=this.loadingService.compareReviewState();
		if(compareReviewState==true){
			nextpage="product_view";
		}

		if(nextpage =="product_view"){
			setTimeout(() => {
				this.loadingService.nextPageReset();
				this.loadingService.setCompareReviewStateDefault();
				this.router.navigate(['/product-view']);
    		}, 1000);	
		}
		else if(nextpage == "notifications"){
			setTimeout(() => {
				this.loadingService.nextPageReset();
				this.router.navigate(['/notifications']);
    		}, 1000);
		}
		else if(nextpage == "compare-instore-selector"){
			setTimeout(() => {
				var length = this.loadingService.getcompareproductCount();
				if(length>0){
					this.router.navigate(['/compare-instore-selector']);
    			}
    			else{
    				this.router.navigate(['/interface']);
    			}
    		}, 1000);	
		}
		else if(nextpage == "compare_online"){
			setTimeout(() => {
				this.loadingService.nextPageReset();
				this.router.navigate(['/compare-online']);
    		}, 2000);	
		}
		else if(nextpage =="NO Products Found"){
			setTimeout(() => {
				this.loadingService.nextPageReset();
				this.router.navigate(['/no-product']);
    		}, 1000);
		}
		else if(nextpage =="NO Customer ID Found"){
			setTimeout(() => {
				this.loadingService.nextPageReset();
				this.router.navigate(['/forgot-id']);
    		}, 1000);
		}
		else{
			setTimeout(() => {
				this.router.navigate(['/interface']);
    		}, 1000);
		}
	}
}