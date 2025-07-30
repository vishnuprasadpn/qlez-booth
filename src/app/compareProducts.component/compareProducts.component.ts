import {Component,OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input,EventEmitter,SimpleChange} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { CompareProductService} from './compareProducts.service'; 

@Component({
    selector: 'compare-products',
    templateUrl:'./compareProducts.component.html',
    styleUrls: ['./compareProducts.component.css'],
    providers:[CompareProductService] 
})

export class CompareProductsComponent implements OnInit{
	@ViewChildren('pStar') pStars;

	@ViewChildren('favoriteIcon') favIcons;
	//Stores products to compare
	compareProducts:[{}];
	product:[{}];
	//Number of Stars
	stars = [1,2,3,4,5];
	//Setting boolean for visibility
	offerPrice:boolean;
	productRating:boolean;
	productOffers:boolean;
	productManufacturer:boolean;
	productDetails:boolean;
	
	//List of Favorite list Items
	favoriteList = new Array();
	//Array of all Specification Main Headings and Sub-Headings
	MainHeadings:string[];
	SubHeadings = new Array();
	viewProductDetails:[{}];

	productAverageStar:number;
	
	constructor(private compareProductService: CompareProductService,private router:Router,private eleRef: ElementRef){}

	ngOnInit(){
		this.viewProductDetails =[ { main: "hello",sub:[{subname:"hai",subValue:"watsup"}]} ];
		this.product = [{}];
		this.productRating=false;
		this.offerPrice = false;
		this.productOffers =false;
		this.productManufacturer=false;
		this.productDetails =false;
		this.compareProducts = this.compareProductService.getProductsToCompare();	
		
		//Setting Products to display
		for(var i=0;i<this.compareProducts.length;i++){
			var color = [];var sColor;var pimage;
			color = Object.keys(this.compareProducts[i]["productColors"]);
			if(this.compareProducts[i]["productSelectedColor"]!=null){
				sColor = this.compareProducts[i]["productSelectedColor"].toLocaleLowerCase();
				for(var c=0;c<color.length;c++){
					var cColor = color[c].toLocaleLowerCase();
					if(cColor == sColor){
						pimage = this.compareProducts[i]["productColors"][color[c]][0];
					}
				}
			}
			else{
				var clr= color[0]
				pimage=this.compareProducts[i]["productColors"][clr][0];
			}
		
			//Calculating Average Star for product
			var sumOfRating,count,star;
			var totCount=0,totSum=0;
			this.productAverageStar= 0;
			var starsArray=[];
			
			if(this.compareProducts[i]["productRating"] != null){
				starsArray= Object.keys(this.compareProducts[i]["productRating"]);
				var sum=0;
				this.productAverageStar= 0;
				var starcount =0;var totcount=0;
				for(var j=0;j<starsArray.length;j++){
					starcount = this.compareProducts[i]["productRating"][starsArray[j]];
					sum = starsArray[j] * starcount +sum;
					totcount = totcount + starcount;
				}
				this.productAverageStar = Math.round(sum / totcount);
			}

			//Getting and setting Main Heading and Sub Heading of Descriptions
			this.MainHeadings = Object.keys(this.compareProducts[i]["productDescription"]);
	
			for(var j=0;j<this.MainHeadings.length;j++){
				this.SubHeadings[j] =Object.keys(this.compareProducts[i]["productDescription"][this.MainHeadings[j]]);
				this.viewProductDetails[j]={main: this.MainHeadings[j],sub:[]};
				for(var k=0;k<this.SubHeadings[j].length;k++){
					this.viewProductDetails[j]["sub"][k] ={ 
						subname:this.SubHeadings[j][k],
						subValue:this.compareProducts[i]["productDescription"][this.MainHeadings[j]][this.SubHeadings[j][k]]
					};	
				}
			}

			var poffers; 
			if(this.compareProducts[i]["productOffers"].length!=0){
				poffers=this.compareProducts[i]["productOffers"];
			}
			else{
				poffers=null;
			}
			this.product[i]={
				productID : this.compareProducts[i]["productID"],
				productItemCode:this.compareProducts[i]["productItemCode"],
				productName:this.compareProducts[i]["productName"],
				productColor:this.compareProducts[i]["productSelectedColor"],
				productImage:pimage,
				productManufacturer:this.compareProducts[i]["productManufacturer"],
				productCost:this.compareProducts[i]["productCost"],
				productDescription:this.viewProductDetails,
				productOfferPrice: this.compareProducts[i]["productOfferPrice"],
				productOffers:poffers,
				productRating:this.productAverageStar,
				productFav:this.compareProducts[i]["productFavorite"]
			}
		}
	}

	ngAfterViewChecked(){
		for(var i =0;i<this.product.length;i++){
			this.pStars.toArray().find((e) => {	
				var rem = ""+e.nativeElement.id %10;
				var custNo =  parseInt("" + e.nativeElement.id /10);
		
				if(""+i==""+custNo){
					if(rem<=this.product[i]["productRating"]){
						e.nativeElement.setAttribute("style","color: yellow;");
					}
				}	
			});
		}
		this.favIcons.toArray().find((e) => {	
			for(var p=0;p<this.product.length;p++){
					
				if(this.product[p]["productName"]==e.nativeElement.id){
					if(this.product[p]["productFav"]=="red"){
						e.nativeElement.setAttribute("style","color: red;");
					}
				}
			}
		});
   	}

	toggleFeature(feature){
		if(feature == "offerPrice"){
			if(this.offerPrice == false){
				this.offerPrice = true;
				document.getElementById(feature).style.background ="#FDBBB1";
			}
			else{
				this.offerPrice = false;
				document.getElementById(feature).style.background ="#DFDDE0";
			}
		}
		else if(feature == "productRating"){
			if(this.productRating == false){
				this.productRating = true;
				document.getElementById(feature).style.background ="#FDBBB1";
				for(var i =0;i<this.product.length;i++){
					this.pStars.toArray().find((e) => {	
						var rem = ""+e.nativeElement.id %10;
						var custNo =  parseInt("" + e.nativeElement.id /10);
						if(""+i==""+custNo){
							if(rem<=this.product[i]["productRating"]){
								e.nativeElement.setAttribute("style","color: yellow;");
							}	
						}	
					});
				}
			}
			else{
				this.productRating = false;
				document.getElementById(feature).style.background ="#DFDDE0";
			}
		}
		else if(feature == "productOffers"){
			if(this.productOffers == false){
				this.productOffers = true;
				document.getElementById(feature).style.background ="#FDBBB1";
			}
			else{
				this.productOffers = false;
				document.getElementById(feature).style.background ="#DFDDE0";
			}
		}
		else if(feature == "productManufacturer"){
			if(this.productManufacturer == false){
				this.productManufacturer = true;
				document.getElementById(feature).style.background ="#FDBBB1";
			}
			else{
				this.productManufacturer = false;
				document.getElementById(feature).style.background ="#DFDDE0";
			}
		}
		else if(feature == "productDetails"){
			if(this.productDetails == false){
				this.productDetails = true;
				document.getElementById(feature).style.background ="#FDBBB1";
			}
			else{
				this.productDetails = false;
				document.getElementById(feature).style.background ="#DFDDE0";
			}
		}
	}

	showProductInDetail(product){
		this.compareProductService.setViewProduct(product);
		this.compareProductService.setNextpage("product_view");
		this.router.navigate(['/loading']);
	}

	addToFavorites(item,product){
		console.log("main");
		console.log(item);
		console.log(product);
		if(product["productFav"]=="red"){
			product["productFav"]="#222222";
		}
		else{
			product["productFav"]="red";
		}

		this.favIcons.toArray().find((e) => {			
			if(product["productName"]==e.nativeElement.id){
				if(product["productFav"]=="red"){
					e.nativeElement.setAttribute("style","color: red;");
				}
				else{
					e.nativeElement.setAttribute("style","color: #222222;");		
				}
			}
		});
		this.compareProductService.setFavoriteProducts(product);	
	}

	backtoCompareSelector(){
		this.compareProductService.setNextpage('compare-instore-selector');
		this.router.navigate(['/compare-instore-selector']);
	}

}