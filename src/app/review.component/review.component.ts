import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { ReviewService } from './review.service';

@Component({
    selector: 'review',
    templateUrl:'./review.component.html',
    styleUrls: ['./review.component.css'],
    providers:[ReviewService] 
})

export class ReviewComponent implements OnInit{

	@ViewChildren('starIcon') inputs;
	@ViewChildren('comment') comments;
	@ViewChildren('list') lists;
	
	// To store previous purchases	
	previousPurchase:[{}];

	// Flag for setting loader
	loaderStatus:boolean;

	// Number of rating stars
	stars = [1, 2, 3, 4, 5];

	// Count of Previous Purchased Products
	preProductCount:number;
	reviewComment:String;
	rem:number;
	mod:number;
	emptyObject:boolean;
	show:boolean;
	noReviewsLeft:boolean;
	constructor(private reviewService: ReviewService){}
	
	ngOnInit(){
		this.previousPurchase =this.reviewService.getCustomerToBeReviewedItems();
		if(this.previousPurchase == null || this.previousPurchase.length < 1) {
			this.noReviewsLeft = true;
		}
		else{
			this.noReviewsLeft = false;
		}
	}


	ngAfterViewInit(){}
	
	//Star Selection
	selectStar(item,name,list,submit,input){
    	this.preProductCount =Object.keys(this.previousPurchase).length;
		this.mod = item.id % 10;
        this.rem =  parseInt("" + item.id/10);
		this.inputs.toArray().find((e) => {
			var emod = e.nativeElement.id % 10;
        	var erem =  parseInt("" + e.nativeElement.id/10);
        	//Run the loop trough only the selected line
			if(this.rem == erem){
				//Applies yellow color till the seleted star
				if(this.mod > emod){
					return e.nativeElement.setAttribute("style","color: yellow;font-size:23px");
				}
				else if(this.mod == emod){
					for(var i =0;i<this.preProductCount;i++){
						if(this.previousPurchase[i]["productName"]==name) {
			    			this.previousPurchase[i]["ratingGiven"]=emod;
			    			if(this.previousPurchase[i]["reviewComment"]!="null" && this.previousPurchase[i]["rating"]!="null"){
			    				this.lists.toArray().find((l) => {
						        	if(l.nativeElement.id == submit.id){
						        		console.log(emod);
						        		this.setStar(emod);
										submit.setAttribute("style","color:green;pointer-events:auto;opacity:1;transform:rotateY(360deg);transition: all 0.7s ease-out;cursor:pointer;");
									}	
								});
			    			}
			    		}
			    	}
					return e.nativeElement.setAttribute("style","color: yellow;font-size:23px");
				}
				else{
					return e.nativeElement.setAttribute("style","color: grey;font-size:23px");
				}
			}
    	});
    }

    setStar(star){
    	if(star==5){

    	}
    	else if(star==4){

    	}
    	else if(star==3){

    	}
    	else if(star==2){

    	}
    	else{

    	}
    }
    //Commenting
    saveComment(comment,name,list,inputComment,submit){
    	this.preProductCount =Object.keys(this.previousPurchase).length;
    	inputComment.value="";
		this.comments.toArray().find((c) => {
        	//Run the loop trough only the selected line
			if(c.nativeElement.id == comment.id){
				if(c.nativeElement.checked){
					for(var i =0;i<this.preProductCount;i++){
						if(this.previousPurchase[i]["productName"]==name) {
			    			this.previousPurchase[i]["reviewComment"]=c.nativeElement.value;			    		
			    			inputComment.value=c.nativeElement.value;
			    			if(this.previousPurchase[i]["ratingGiven"] !="null" && this.previousPurchase[i]["reviewComment"]!="null"){
			    				this.lists.toArray().find((l) => {
						        	if(l.nativeElement.id == submit.id){
										submit.setAttribute("style","color:green;pointer-events:auto;opacity:1;transform:rotateY(360deg);transition: all 0.7s ease-out;cursor:pointer;");
									}	
								});
			    			}
			    		}
			    	}
				}	
			}	
		});
    }

    writeComment(item,submit){
    	console.log(item.value);
    	var str = item.id.substring(item.id.length-1, item.id.length);
    	this.previousPurchase[str]["reviewComment"] = item.value;
    	for(var i =0;i<this.preProductCount;i++){
	    	if(this.previousPurchase[str]["productName"]==this.previousPurchase[i]["productName"]){
				if(this.previousPurchase[i]["ratingGiven"]!="null" && this.previousPurchase[i]["reviewComment"]!="null"){
				   	this.lists.toArray().find((l) => {
						if(l.nativeElement.id == submit.id){
							submit.setAttribute("style","color:green;pointer-events:auto;opacity:1;transform:rotateY(360deg);transition: all 0.7s ease-out;cursor:pointer;");
						}	
					});
				}
			}
    	}
    	if(item.value == ""){
    		this.comments.toArray().find((c) => {
    			c.nativeElement.checked = false;
    		});
    	}
    }

    toggleCommonComments(item){
    	if(document.getElementById("comments"+item.id).style.display=="block") {	
    		document.getElementById("comments"+item.id).style.display="none";
    	}
    	else{
    		document.getElementById("comments"+item.id).style.display="block";
    		document.getElementById("comments"+item.id).style.zIndex="99999999999999999";	
    	}	
    }

    submitReviewClick(list,review,input,selectInput,msg){
    	if(input.value==""){
			document.getElementById(msg.id).style.display="block";
		}
		else{
			document.getElementById(msg.id).style.display="none";
			review.reviewComment=input.value;

			this.lists.toArray().find((l) => {

				if(l.nativeElement.id == list.id){

					l.nativeElement.setAttribute("style","transform:translateX(-200px);transition: all 0.7s ease-out;opacity: 0;");
					review.timestamp=new Date().toUTCString();
				    this.reviewService.setReviewedProduct(review);

					setTimeout(function() {

					    l.nativeElement.setAttribute("style","display:none;padding:0px!important");
					
				    }, 1000);

				}	

			});
		}        	
		if(this.previousPurchase.length <1){
			this.noReviewsLeft = true;
		}
    }
/*
    changeValue(input,review,msg){
    	document.getElementById(msg.id).style.display="none";		
    }*/
}