import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input,Output,EventEmitter} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { FooterService } from './footer.service';
import {Observable} from 'rxjs/Rx';
declare var jQuery:any;

@Component({
    selector: 'footer',
    templateUrl:'./footer.component.html',
    styleUrls: ['./footer.component.css'],
    providers:[FooterService],
})

export class FooterComponent implements OnInit{
	@ViewChildren('navItem') navItems;
	@ViewChildren('navPart') navPart;
	navElementDivWidth:number;
	navElementCount:number;
	customer:{};
	bucketCount:number;
	pendingReviewCount:number;
	offersCount:number;
	bucketCountVisibility:boolean;
	pendingCountVisibility:boolean;
	offersCountVisibility:boolean;
	bucketClicked:boolean;
	reviewClicked:boolean;
	showCustomerProducts:boolean;


	timer:any;subscription:any;
	count:any;

	constructor(private footerService: FooterService,private router :Router,private eleRef: ElementRef){
		this.showCustomerProducts=true;
	}
	
	ngOnInit(){	
		this.bucketClicked = false;
		this.reviewClicked = false;
	}

	ngDoCheck(){
		this.bucketCount = this.footerService.getBucketProductCount();
		this.pendingReviewCount = this.footerService.getPendingReviewProductCount();
		this.showCustomerProducts = this.footerService.getCustomerProducts();
		
		//if(this.showCustomerProducts==true){
			//document.getElementById("myFavoritesButton").style.background = "#F2C8C9";
			//document.getElementById("myFavoritesButton").style.color = "#fff";
		//	this.subscription.unsubscribe();
		//}

		if(this.pendingReviewCount==0){
			this.pendingCountVisibility = false;			
		}
		if(this.bucketCount == undefined ||this.bucketCount == 0){
			this.bucketCountVisibility = false;
		}

		if(this.offersCount == undefined ||this.offersCount == 0){
			this.offersCountVisibility =false;
		}
	}

	ngAfterViewInit() {
		//For setting counters
		this.bucketCountVisibility =true;
		this.pendingCountVisibility =true;
		this.offersCountVisibility =true;
	
		//For Adjusting Navbar Items
	/*	this.navElementCount = this.navItems.length;
		this.navPart.toArray().find((e) => {
			this.navElementDivWidth = e.nativeElement.clientWidth;
		});
*/
		//this.timer = Observable.timer(2000,1000);
    	//this.subscription = this.timer.subscribe(this.check);

		/*var elementOccupiedSize = this.navElementCount * 170;
	
		var freeSpace = this.navElementDivWidth - elementOccupiedSize;
	
		this.navElementCount = this.navElementCount+1;
	
		var elementMargin = (freeSpace/this.navElementCount)-30;
	
		var innerElementMargin = (elementMargin/2)-20;
	
		var i = 1;
	
		this.navItems.toArray().find((e) => {
	
			if(i == 1){
	
				e.nativeElement.setAttribute("style","margin-left:"+elementMargin+"px;margin-right:"+innerElementMargin+"px");	
	
			}
	
			else if(i == (this.navElementCount-1)) {
	
				e.nativeElement.setAttribute("style","margin-left:"+innerElementMargin+"px;margin-right:"+elementMargin+"px");
	
			}
	
			else{
	
				e.nativeElement.setAttribute("style","margin:0px "+innerElementMargin+"px");
	
			}
	
			i++;
	
		});
*/
	}

	check(){}

	openBucket(){
		this.closeReview();
		if(document.getElementById("myBucket").style.height=="100%"){
			document.getElementById("myBucket").style.height="0%";
		}
		else{
			document.getElementById("myBucket").style.height="100%";	
		}
	}

	closeReview(){
		document.getElementById("myReviews").style.height="0%";
	}

	openReview(){
		this.closeBucket();
		if(document.getElementById("myReviews").style.height=="100%"){
			document.getElementById("myReviews").style.height="0%";
		}
		else{
			document.getElementById("myReviews").style.height="100%";
		}

	}

	showProfile(){
		if(document.getElementById("myProfile").style.display == "block") {
			document.getElementById("myProfile").style.display = "none";
			document.getElementById("profileSection").style.background = "none";
			document.getElementById("disp").style.bottom = "auto";
		}
		else{
			document.getElementById("myProfile").style.display = "block";
			document.getElementById("profileSection").style.background = "#C93756";
			document.getElementById("disp").style.bottom = "0";
		}
	}

	toggleBucketOption(option){
		if(option=='lastViewed') {
			if(document.getElementById(option).style.display == "none"){
				document.getElementById(option).style.display = "block";
				document.getElementById("myFavoritesButton").style.opacity = "0.5";
				document.getElementById("myFavoritesButton").style.background = "#F2C8C9";
				document.getElementById("myFavoritesButton").style.color = "grey";
				document.getElementById("lastViewedButton").style.opacity = "1";
				document.getElementById("lastViewedButton").style.background = "#fff";
				document.getElementById("lastViewedButton").style.color = "#000";
				document.getElementById("myFavorites").style.display = "none";
			}
		}
		else{
			if(document.getElementById(option).style.display == "none") {
				document.getElementById(option).style.display = "block";
				document.getElementById("lastViewed").style.display = "none";
				document.getElementById("lastViewedButton").style.opacity = "0.5";
				document.getElementById("lastViewedButton").style.background = "#F2C8C9";
				document.getElementById("lastViewedButton").style.color = "grey";
				document.getElementById("myFavoritesButton").style.opacity = "1";
				document.getElementById("myFavoritesButton").style.background = "#fff";
				document.getElementById("myFavoritesButton").style.color = "#000";
			}
		}
	}

	closeBucket(){
		document.getElementById("myBucket").style.height="0%";
	}

	underConstruction(){
		console.log("open snack");
	    var x = document.getElementById("snackbar")
	    // Add the "show" class to DIV
	    x.className = "show";
	    // After 3 seconds, remove the show class from DIV
	    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	}
}