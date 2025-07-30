import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';

import { Router} from '@angular/router';

import { Http } from '@angular/http';

import { OnlineCompareService } from './compareOnline.service'

@Component({

    selector: 'compare-online',

    templateUrl:'./compareOnline.component.html',

    styleUrls: ['./compareOnline.component.css'],

    providers:[OnlineCompareService] 

})

export class CompareOnlineComponent implements OnInit{
	
	@ViewChildren('pStar') pStars;

	stars = [1,2,3,4,5];

	currentProduct:{};

	amazonproduct:{};

	product : {};

	percentageOff: number;

	constructor(private router:Router,private onlineCompareService:OnlineCompareService){}
	
	ngOnInit(){
		
		this.product = {};
	
		this.currentProduct = this.onlineCompareService.getCurrentProduct();

		this.amazonproduct =this.onlineCompareService.getAmazonProduct();

		this.amazonproduct["discount"] = Math.floor(this.amazonproduct["discount"]);
		
		this.amazonproduct["avgRating"] = Math.round( Number(this.amazonproduct["avgRating"]));
		
		this.percentageOff = 0;
		
	}

	ngAfterViewInit(){
		var color;var sColor;var imageurl;

		var percent =100-(this.currentProduct["item"]["item_sp"]/this.currentProduct["item"]["item_mrp"])*100;
		
		this.percentageOff = parseInt(""+percent);
		
		color = Object.keys(this.currentProduct["item"]["item_imagelinks"]);
		
		sColor = this.currentProduct["color"].toLocaleLowerCase();
		
		for(var c=0;c<color.length;c++){
		
			var cColor = color[c].toLocaleLowerCase();
		
			if(cColor == sColor){
		
				imageurl = this.currentProduct["item"]["item_imagelinks"][color[c]][0];
		
			}
		
		}
		
		this.product = {
		
			productName:this.currentProduct["item"]["item_name"],
		
			productImage:imageurl,
		
			productOfferPrice:this.currentProduct["item"]["item_sp"],
		
			productCost:this.currentProduct["item"]["item_mrp"]
		
		}


		var avgStar = this.amazonproduct["avgRating"];

		if(avgStar != NaN && avgStar != undefined){
		
			this.pStars.toArray().find((e) => {
		
				if(e.nativeElement.id <= avgStar){
		
					e.nativeElement.setAttribute("style","color: yellow;");
		
				}
		
			});	
		
		}

	}

}
















