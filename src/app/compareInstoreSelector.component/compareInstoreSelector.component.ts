import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { CompareInstoreSelectorService } from './compareInstoreSelector.service';

@Component({
    selector: 'compare-instore-selector',
    templateUrl:'./compareInstoreSelector.component.html',
    styleUrls: ['./compareInstoreSelector.component.css'],
    providers:[CompareInstoreSelectorService] 
})

export class CompareInstoreSelectorComponent implements OnInit{
	
	//To store products of similar type
	similarProducts:[{}];
	//Product to compare with
	comparingProduct:{};
	//Image of comparing product 
	comparingProductImage:string;
	//To get images of similar Products
	similarProductColors:string[];
	//To store data to show in loop
	productsDetails= [{}];
	percentageOffer:number;
	//Products Selected to compare 
	confirmedProduct = new Array();
	//Number of Products Selected
	confirmedProductCount:number;
	
	constructor(private compareISService: CompareInstoreSelectorService,private router:Router){
	}
	
	ngOnInit(){
		this.productsDetails = [{imageUrl:"",productName:"",productOfferPrice:"",productCost:null}];
		this.comparingProduct = {};
		this.similarProducts=[{}];
		this.similarProducts.pop();

		this.comparingProduct = this.compareISService.getComparingProduct();
		this.similarProducts= this.compareISService.getCompareProducts();
	}

	ngAfterViewInit(){

		var color = [];var sColor;
		//Setting Percentage for product
		var percent =100-(this.comparingProduct["item"]["item_sp"]/this.comparingProduct["item"]["item_mrp"])*100;
		this.percentageOffer = parseInt(""+percent);
		color = Object.keys(this.comparingProduct["item"]["item_imagelinks"]);
		if(this.comparingProduct["color"]!=null && this.comparingProduct["color"]!=undefined){
			sColor = this.comparingProduct["color"].toLocaleLowerCase();
		}
		else{
			sColor=color[0];
		}

		for(var c=0;c<color.length;c++){
			var cColor = color[c].toLocaleLowerCase();
			sColor=sColor.toLocaleLowerCase();
			if(cColor == sColor){
				this.comparingProductImage = this.comparingProduct["item"]["item_imagelinks"][color[c]][0];
			}
		}
		
		for(var i =0;i<this.similarProducts.length;i++){
			//Setting Percentage for product
			var percent =100-(this.similarProducts[i]["productOfferPrice"]/this.similarProducts[i]["productCost"])*100;
			var percentageOff = parseInt(""+percent);
			this.similarProducts[i]["productPercentOff"] = percentageOff;
		}
	}

	//Called when a product is slected
	selectProduct(select,product){
		if(document.getElementById(select.id).style.display=="block"){
			document.getElementById(select.id).style.display ="none";
			if(this.confirmedProduct.length==0){
				this.confirmedProductCount=null;
				document.getElementById("userHintInCompare").style.display ="block";
			}
			else{
				for(var i=0;i<this.confirmedProduct.length;i++){
					if(this.confirmedProduct[i]["productColor"] == product["productColor"] && this.confirmedProduct[i]["productItemCode"] == product["productItemCode"]){
						for(var j=i;j<this.confirmedProduct.length-1;j++){
							this.confirmedProduct[j]= this.confirmedProduct[j+1];	
						}		
					}
				}
				this.confirmedProduct.pop();
				this.confirmedProductCount=this.confirmedProduct.length;	
			}
		}
		else{
			document.getElementById("userHintInCompare").style.display ="none";
			document.getElementById(select.id).style.display ="block";
			var pdt ={productColor:product["productColor"],productItemCode:product["productItemCode"]};
			this.confirmedProduct.push(pdt);
			this.confirmedProductCount=this.confirmedProduct.length;
		}
	}

	compareProducts(){
		var prods=[{}];
		prods.pop();
		for(var c=0;c<this.confirmedProduct.length;c++){
			for(var cp=0;cp<this.similarProducts.length;cp++){			
				if(this.similarProducts[cp]["productColor"]==this.confirmedProduct[c]["productColor"] && this.similarProducts[cp]["productItemCode"] == this.confirmedProduct[c]["productItemCode"]){
					prods.push(this.similarProducts[cp]);
				}
			}
		}
		prods.push(this.comparingProduct);
		console.log("products to compare");
		console.log(prods);
		this.compareISService.setProductsToCompare(prods);
		this.router.navigate(['/compare-products']);
	}

	backtoProductView(){
		this.compareISService.setNextPage('');
		this.router.navigate(['/product-view']);
	}

}