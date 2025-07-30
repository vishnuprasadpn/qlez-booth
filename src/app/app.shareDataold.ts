import {Injectable} from "@angular/core";
import { Http,Headers,Response,RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/observable';
import { RouterModule, Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AppDataShareService {
	
	customerStatus:boolean;
	//To Be Reviewed Storage
	reviews:[{}];
	//Customer Details Storage
	customer:[{}];
	//For selecting image
	imageNumber:number;
	//To Check whether the current product view item is favorite
	favSet:boolean;
	productIDs:[""];
	productcontentStatus:boolean;
	switchcase:string;
	nextPage:string;	
	//All data of products in Bucket
	allBucketProductsData:[{}];
	//All data of products in favorite list
	allFavoriteProductsData:[{}];	
	//All data of products in last viewed list
	allLastViewedProductsData:[{}];
	//All data of products in Bucket
	allInstoreCompareProductsData:[{}];
	//All data of products for reviews
	allReviewsProductData:[{}];
	//Calculate average star rate of a product
	productAverageStar:number;
	//Stores Products to compare
	comparingProducts:[{}];
	//For Bucket Component
	bucketProductsThumb:[{}];
	// For Favorite Component
	favoriteProductsThumb:[{}];
	// For Last Viewed Component
	lastViewedProductsThumb:[{}];
	// For compare product Component
	compareInstoreProductsThumb:[{}];
	//For getting Products Count in the Customer Bucket
	bucketProductsCount:number;
	//For getting pending Reviews Count for the customer
	pendingReviewsCount:number;
	//For Review Component 
	previousPurchase:[{}];
	//For View a Product Component
	productViewItem:{};
	//Contains all product details 
	fullProductData:{};
	//Stores Last Viewed Products
	lastViewedProducts:[{}];
	//Stores Customer Favorite Products  
	myFavoriteProducts:[{}];
	//To store new Last viewed Items
	newLastViewedItems:[{}];
	newLastViewLength:number;
	newReviewedProducts:[{}];
	//To store new favorite Items
	newFavoriteList:[{}];
	newFavoriteListLength:number;
	amzOnlineCompare:{};
 	totalCustomerNotificationsCount:number;

 	constructor(private mockHttp: Http,private serviceHttp: Http,private router: Router) {
		this.totalCustomerNotificationsCount =0;
 		this.customerStatus = false;
 		this.pendingReviewsCount = 0;
 		this.productcontentStatus = false;
 		this.favSet = false;
 		this.nextPage = "";
 		this.switchcase="";
 		this.productIDs =[""];
 		//Initialize Store Variables
 		this.customer =[{customerID:null,customerfName:null,customerlName:null,customerImage:null,customerRewardPoints:null,customerContact:null,customerAddress:null,customerEmail:null,customerDOB:null,customerLanguage:null,customerSecContact:null,customerFavorites:null,customerViewed:null}];
		this.reviews = [{reviewID:""}];
 		this.allBucketProductsData =[{}];
 		this.allFavoriteProductsData =[{}];
 		this.allLastViewedProductsData =[{}];
 		this.allInstoreCompareProductsData = [{}];
 		this.allReviewsProductData = [{}];
 		this.bucketProductsThumb = [{}];
 		this.favoriteProductsThumb = [{}];
 		this.productViewItem = {};
 		this.lastViewedProductsThumb = [{}];
 		this.compareInstoreProductsThumb = [{}];	
 		this.comparingProducts = [{}];
		this.newLastViewedItems =[{}]; 
		this.newLastViewLength = 0;
		this.newFavoriteList = [{}];
		this.newFavoriteListLength =0;
		this.newReviewedProducts=[{}];
		this.newLastViewedItems.pop();
		this.newReviewedProducts.pop();
		this.amzOnlineCompare ={};
 	}

 	//Loading of Needed Backend Services
 	startApplication(){
 	console.log("start application");
 		this.serviceHttp.request('http://localhost:8080/initiate/startApp')
        .map(res => res.json()).subscribe(res => {   	
        });
 	}

	//On Session Start by Customer 
 	startReader(){
 		//To validate a customer and send data customer data
		this.serviceHttp.request('http://localhost:8080/initiate')
        .map(res => res.json()).subscribe(res => {
        	console.log("inital");
        	console.log(res);
        	if(res.productIDs!=null){

	        	this.productIDs = res.productIDs;
	        	console.log("ids ");
	        	console.log(this.productIDs);
				while(this.productIDs.length >4){
					this.productIDs.pop();
				}
	        	this.bucketProductsCount = res.productIDs.length;
	        	if(res.cust !=null){
	        	console.log("test");
	   				this.productcontentStatus = true;
	        		this.getBucketProductDetails();
	   				//Setting Customer Details from response
		        	this.customer[0]={
		        		customerID:res.cust.cId,
		        		customerfName:res.cust.fName,
		    			customerlName:res.cust.lName,
		    			customerImage:res.cust.imageUrl,
		    			customerRewardPoints:res.cust.rewardPoints,
		    			customerContact:res.cust.phone,
						customerAddress:res.cust.cAdd,
						customerEmail:res.cust.email,
						customerDOB:res.cust.dob,	
						customerLanguage:res.cust.language,
						customerSecContact:res.cust.secPhone,
						customerFavorites:res.cust.favs,
						customerViewed:res.cust.viewed
					};
					
					if(this.customer[0]["customerFavorites"]!=null){

						if(this.customer[0]["customerFavorites"].length != null){
							for(var fl = 0;fl<this.customer[0]["customerFavorites"].length;fl++){
								this.newFavoriteList[fl] = this.customer[0]["customerFavorites"][fl];
							}
							this.newFavoriteListLength = this.customer[0]["customerFavorites"].length;
						}
					}
					if(this.customer[0]["customerViewed"]!=null){
						if(this.customer[0]["customerViewed"].length != null){
							for(var fl = 0;fl<this.customer[0]["customerViewed"].length;fl++){
								this.newLastViewedItems[fl] = this.customer[0]["customerViewed"][fl];
							}
							this.newLastViewLength = this.customer[0]["customerViewed"].length;
						}
					}

					this.getCustomerProducts();
	        		if(res.review != null){
	        			console.log("reviewsssss ");
	        			console.log(res.review);
		        		this.pendingReviewsCount = res.review.length;
		        		this.totalCustomerNotificationsCount = this.pendingReviewsCount;
		        		console.log(this.pendingReviewsCount);
		 				for(var i =0;i<res.review.length;i++){
		 					console.log(res.review[i]);
							this.allReviewsProductData[i] = res.review[i];
							var dOfPurchase=res.review[i]["pDate"].substr(0, 10);
							var pImage = res.review[i]["itemImage"][0];
							this.reviews[i] ={ 
								productName:res.review[i]["itemName"],
								productSP:res.review[i]["sPrice"],
								dateOfPurchase:dOfPurchase,
								productImage:pImage,
								ratingGiven:res.review[i]["rating"],
								reviewComment:res.review[i]["comment"]
							};	
						}
					}
					else{
						this.reviews = null;
					}
					this.nextPage = "notifications";
				}
			}
			else{
				this.router.navigate(['/welcome']);
			}
        });
 		return status;
	}
 	
 	//To get Details of products in the bucket
	getBucketProductDetails(){
      	var i;var average;var imageLink;var stars=[];var colors=[];
      	var headers = new Headers();
      	headers.append('Content-Type', 'application/json');
      	this.serviceHttp.post('http://localhost:8080/products/bucketProducts',this.productIDs, {headers: headers})
          	.subscribe(data => {
          	console.log(data.json());
          	console.log("bucket products");
          	this.bucketProductsCount=data.json().completeProductDetails.length;
          	for(i=0;i<data.json().completeProductDetails.length;i++){
    			this.allBucketProductsData[i] = data.json().completeProductDetails[i];
    			var totcount =0;var sum =0;
				var totsum = 0; var starcount=0;

				//Calculating Average Star for product
				if(data.json().completeProductDetails[i]["starCount"] != null){
					stars= Object.keys(data.json().completeProductDetails[i]["starCount"]);
					this.productAverageStar= 0;
					for(var j=0;j<stars.length;j++){
						starcount = data.json().completeProductDetails[i]["starCount"][stars[j]];
						sum = stars[j] * starcount +sum;
						totcount = totcount + starcount;
					}
					this.productAverageStar =sum / totcount;
				}
				else{
					this.productAverageStar =null;
				}
				var imageurl;var color;
				var selectedColor = data.json().completeProductDetails[i]["color"].toLocaleLowerCase();
				colors= Object.keys(data.json().completeProductDetails[i]["item"]["item_imagelinks"]);
				var imgStatus=false;
				for(var img=0;img<colors.length;img++){
					color = colors[img].toLocaleLowerCase();
					if(color == selectedColor){
						imgStatus=true;
						imageurl = data.json().completeProductDetails[i]["item"]["item_imagelinks"][colors[img]][0];
					}
				}
				if(imgStatus==false){
					imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
     			}
     			this.bucketProductsThumb[i] = {
     				productID :data.json().completeProductDetails[i]["pId"],
			 		productName:data.json().completeProductDetails[i]["item"]["item_name"],
			 		productRating:this.productAverageStar,
			 		productOfferPrice: data.json().completeProductDetails[i]["item"]["item_sp"],
			 		productImage:imageurl
				}
    		}
  		}, error => {console.log(JSON.stringify(error.json()));});
	}
	
	getCustomerProducts(){
		var i, average, imageLink;var stars=[];var colors = [];
		var custFav = this.customer[0]["customerFavorites"];
		while(custFav.length >5){
			custFav.pop();
		}
		var custLastViewd = this.customer[0]["customerViewed"];
		while(custLastViewd.length >5){
			custLastViewd.pop();
		}
		var body = {'favorite':custFav,'lastViewed':custLastViewd};
 		var headers = new Headers();
      	headers.append('Content-Type', 'application/json');
      	this.serviceHttp.post('http://localhost:8080/products/customerProducts',body, {headers: headers})
          	.subscribe(data => {
          		console.log(data.json());
          		if(data.json().customerFavorites.completeProductDetails.length !=0){
	          		for(var i=0;i<data.json().customerFavorites.completeProductDetails.length;i++){
	        			this.allFavoriteProductsData[i] = data.json().customerFavorites.completeProductDetails[i];	
	        			var totcount =0;var sum =0;
						var totsum = 0; var starcount=0;
						//Calculating Average Star for product
						if(data.json().customerFavorites.completeProductDetails[i]["starCount"] != null){
							stars= Object.keys(data.json().customerFavorites.completeProductDetails[i]["starCount"]);
							this.productAverageStar= 0;
							for(var j=0;j<stars.length;j++){
								starcount = data.json().customerFavorites.completeProductDetails[i]["starCount"][stars[j]];
								sum = stars[j] * starcount +sum;
								totcount = totcount + starcount;
							}
							this.productAverageStar =sum / totcount;
						}
						else{
							this.productAverageStar = 0;
						}
						var imageurl;var color;
						var selectedColor = data.json().customerFavorites.completeProductDetails[i]["color"].toLocaleLowerCase();;
						colors= Object.keys(data.json().customerFavorites.completeProductDetails[i]["item"]["item_imagelinks"]);
						for(var img=0;img<colors.length;img++){
							color = colors[img].toLocaleLowerCase();
							if(color == selectedColor){
								imageurl = data.json().customerFavorites.completeProductDetails[i]["item"]["item_imagelinks"][colors[img]][0];
							}
						}
		        		this.favoriteProductsThumb[i] = {
		        			productID:data.json().customerFavorites.completeProductDetails[i]["pId"],
							productName:data.json().customerFavorites.completeProductDetails[i]["item"]["item_name"],
							productRating:this.productAverageStar,
							productOfferPrice: data.json().customerFavorites.completeProductDetails[i]["item"]["item_sp"],
							productImage:imageurl
						}
	        		}
	        	}
	        	else{
	        		this.favoriteProductsThumb.pop();
	        	}
        		for(var i=0;i<data.json().customerLastViewed.completeProductDetails.length;i++){
	        		this.allLastViewedProductsData[i] = data.json().customerLastViewed.completeProductDetails[i];	
	        		var totcount =0;var sum =0;
					var totsum = 0; var starcount=0;
					//Calculating Average Star for product
					if(data.json().customerLastViewed.completeProductDetails[i]["starCount"] != null){
						stars= Object.keys(data.json().customerLastViewed.completeProductDetails[i]["starCount"]);
						this.productAverageStar= 0;
						for(var j=0;j<stars.length;j++){
							starcount = data.json().customerLastViewed.completeProductDetails[i]["starCount"][stars[j]];
							sum = stars[j] * starcount +sum;
							totcount = totcount + starcount;
						}
						this.productAverageStar =sum / totcount;
					}
					else{
						this.productAverageStar = 0;
					}
					var imageurl= null;var color;
					var selectedColor = data.json().customerLastViewed.completeProductDetails[i]["color"].toLocaleLowerCase();;
					colors= Object.keys(data.json().customerLastViewed.completeProductDetails[i]["item"]["item_imagelinks"]);
					for(var img=0;img<colors.length;img++){
						color = colors[img].toLocaleLowerCase();
						if(color == selectedColor){
							imageurl = data.json().customerLastViewed.completeProductDetails[i]["item"]["item_imagelinks"][colors[img]][0];
						}
					}
	        		this.lastViewedProductsThumb[i] = {
	        			productID : data.json().customerLastViewed.completeProductDetails[i]["pId"],
						productName:data.json().customerLastViewed.completeProductDetails[i]["item"]["item_name"],
						productRating:this.productAverageStar,
						productOfferPrice: data.json().customerLastViewed.completeProductDetails[i]["item"]["item_sp"],
						productImage:imageurl
					}
        		}
        	}, error => {
            	console.log(JSON.stringify(error.json()));
        });
 	}

 	//Setting Similar Products
 	getSimilarProducts(group,category,sub_category){ 
 		var colors=[];
 		this.compareInstoreProductsThumb = [{}];
 		this.allInstoreCompareProductsData = [{}];
 		var body = {'productGroup' : group,'productCategory':category,'productSubCategory':sub_category};
      	var headers = new Headers();
      	headers.append('Content-Type', 'application/json');
      	this.serviceHttp.post('http://localhost:8080/products/compareProducts',body, {headers: headers})
          	.subscribe(data => {
          		if(data.json().onlineCompareProducts.amzProducts!=null){
	        		this.amzOnlineCompare = data.json().onlineCompareProducts.amzProducts;
	        		this.amzOnlineCompare["vendorName"] = 'Amazon';
	        		this.amzOnlineCompare["vendorLogoUrl"] = 'https://images.seeklogo.net/2016/10/amazon-logo-preview.png';
          		}
          		var rsize = data.json().instoreCompareProducts.completeProductDetails.length;
          		
                for(var i=0;i<rsize;i++){
                	this.allInstoreCompareProductsData[i]=data.json().instoreCompareProducts.completeProductDetails[i];
                	console.log(this.allInstoreCompareProductsData[i]);
                	var imageurl;var color;var selectedColor;
                	console.log(i);
                	if(data.json().instoreCompareProducts.completeProductDetails[i]["item"]!=undefined || data.json().instoreCompareProducts.completeProductDetails[i]["item"]!=null){
	                	colors= Object.keys(data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"]);
	                	console.log(colors);
	                	if(data.json().instoreCompareProducts.completeProductDetails[i]["color"]!=null){
	                		console.log("inisde");
							imageurl = data.json().instoreCompareProducts.completeProductDetails[i]["color"].toLocaleLowerCase();
						}
						else{
							var clr=colors[0];
							console.log("dadas");
							console.log(clr);
							console.log(data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"][clr][0]);
							console.log(data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"]);

							console.log(data.json().instoreCompareProducts.completeProductDetails[i]["item"]);

							imageurl=data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"][clr][0];
						}
						
						
	                	if(i<7){
		                	this.compareInstoreProductsThumb[i] = {
		                		productNo:i,
		                		productID:data.json().instoreCompareProducts.completeProductDetails[i]["pId"],
						 		productName:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_name"],
						 		productOfferPrice:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_sp"],
						 		productImage:imageurl,
						 		productCost:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_mrp"],
						 		productPercentOff:""
		                	};
		                }
		            }
                }
          	}, error => {
            	console.log(JSON.stringify(error.json()));
        });
    }

	//For setting the product to view from Bucket
 	setProductViewItemfrmBucket(productID){
 		this.favSet = false;
 		var cColor,cItemcode,pColor,pItemcode;
 		for(var i=0;i<this.allBucketProductsData.length;i++){
 			if(this.allBucketProductsData[i]["pId"]==productID){	
 				this.productViewItem = this.allBucketProductsData[i];
				//To set as favorite if already done
				for(var cf=0;cf<this.newFavoriteList.length;cf++){
					cColor = this.newFavoriteList[cf]["color"].toLocaleLowerCase();
					cItemcode = this.newFavoriteList[cf]["item_code"].toLocaleLowerCase();
					pColor = this.productViewItem["color"].toLocaleLowerCase();
					pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
					if(cColor == pColor && cItemcode == pItemcode){
						this.favSet = true;
					}
				}
			}
 		}

		var group;var category;var sub_category;
		//Getting Data for fetching Compare Products
		group = this.productViewItem["item"]["item_group"];
		category = this.productViewItem["item"]["item_category"];
		sub_category = this.productViewItem["item"]["item_subcategory"]; 		
		this.getSimilarProducts(group,category,sub_category);
 	}
 	
 	setMyFavoriteProductsfromView(favoriteStatus){
 		if(favoriteStatus == true){
 			if(this.newFavoriteListLength !=0){
 				this.newFavoriteList[this.newFavoriteListLength] = {item_code:this.productViewItem["item"]["item_code"],color:this.productViewItem["color"]};
 				this.newFavoriteListLength = this.newFavoriteListLength +1;
 			}
 			else{
 				this.newFavoriteList[0] ={item_code:this.productViewItem["item"]["item_code"],color:this.productViewItem["color"]};
 				this.newFavoriteListLength = this.newFavoriteListLength +1;
 			}
 		}
 		else{
 			if(this.newFavoriteList.length !=0){
 				for(var fl=0;fl<this.newFavoriteList.length;fl++){
 					var flColor =this.newFavoriteList[fl]["color"].toLocaleLowerCase();
					var	flItemcode = this.newFavoriteList[fl]["item_code"].toLocaleLowerCase();
					var pColor = this.productViewItem["color"].toLocaleLowerCase();
					var pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
					if( flColor == pColor && flItemcode == pItemcode){
						for(var i=fl;i<this.newFavoriteListLength;i++){
							this.newFavoriteList[i]= this.newFavoriteList[i+1];	
						}
						this.newFavoriteList.pop();	
					}					
 				}
 			}
 		}
 	}

 	//For setting the product to view from Favorites
 	setProductViewItemFrmFavorite(product){
 		for(var i=0;i<this.allFavoriteProductsData.length;i++){	
 			if(this.allFavoriteProductsData[i]["pId"]==product){
 				this.productViewItem = this.allFavoriteProductsData[i];
 				this.favSet = true;
 			}
 		}

		var group;var category;var sub_category;
		//Getting Data for fetching Compare Products
		group = this.productViewItem["item"]["item_group"];
		category = this.productViewItem["item"]["item_category"];
		sub_category = this.productViewItem["item"]["item_subcategory"]; 		
		this.getSimilarProducts(group,category,sub_category);
 	}

 	//For setting the product to view from Last Viewed
 	setProductViewItemFrmLast(product){
 		var cColor,cItemcode,pColor,pItemcode;
 		for(var i=0;i<this.allLastViewedProductsData.length;i++){
 			if(this.allLastViewedProductsData[i]["pId"]==product){
 				this.productViewItem = this.allLastViewedProductsData[i];
  				if(this.newFavoriteList != null){
 					for(var fav=0;fav<this.newFavoriteList.length;fav++){
 						cColor = this.newFavoriteList[fav]["color"].toLocaleLowerCase();
 						cItemcode = this.newFavoriteList[fav]["item_code"].toLocaleLowerCase();
						pColor = this.productViewItem["color"].toLocaleLowerCase();
						pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
						if(cColor == pColor && cItemcode == pItemcode){
							this.favSet = true;
						}
						else{this.favSet = false;}
					}
 				}
 			}
 		}

		var group;var category;var sub_category;
		
		//Getting Data for fetching Compare Products
		group = this.productViewItem["item"]["item_group"];
		category = this.productViewItem["item"]["item_category"];
		sub_category = this.productViewItem["item"]["item_subcategory"]; 		
		this.getSimilarProducts(group,category,sub_category);
 	}

 	//For setting the product to view from Last Viewed
 	setProductViewItemFrmCompare(product){
 		this.favSet = false;
 		console.log("ddsadsfddfsdfdsfsadafdfd");
 		console.log(product);
 		var cColor,cItemcode,pColor,pItemcode;
 		for(var i=0;i<this.allInstoreCompareProductsData.length;i++){
 			console.log(this.allInstoreCompareProductsData[i]);

 			if(this.allInstoreCompareProductsData[i]["item"]["item_name"]==product["productName"] && this.allInstoreCompareProductsData[i]["item"]["item_sp"]==product["productOfferPrice"]){
 				this.productViewItem = this.allInstoreCompareProductsData[i];
 				if(this.productViewItem["color"]!=null){
 					pColor = this.productViewItem["color"].toLocaleLowerCase();
 				}
 				else{
 					pColor=null;
 				}
				pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
				if(this.newFavoriteList != null){
 					for(var fav=0;fav<this.newFavoriteList.length;fav++){
 						cColor = this.newFavoriteList[fav]["color"].toLocaleLowerCase();
 						cItemcode = this.newFavoriteList[fav]["item_code"].toLocaleLowerCase();
						if(cColor == pColor && cItemcode == pItemcode){
							this.favSet = true;
						}
						else{this.favSet = false;}
					}	
				}
 			}
 		}
 		
		var group;var category;var sub_category;
		//Getting Data for fetching Compare Products
		group = this.productViewItem["item"]["item_group"];
		category = this.productViewItem["item"]["item_category"];
		sub_category = this.productViewItem["item"]["item_subcategory"]; 		
		this.getSimilarProducts(group,category,sub_category);
 	}

 	//For Setting Last Reviewed Items
 	setMyFavoriteProductsfromCompare(productList){

 		var i;

 		for(var pl=0;pl<productList.length;pl++){

 			for(i=0;i<this.allInstoreCompareProductsData.length;i++){

 				if(this.allInstoreCompareProductsData[i]["pId"]==productList[pl]){

 					if(this.newFavoriteListLength !=null){

	 					this.newFavoriteList[this.newFavoriteListLength] = {

	 						color:this.allInstoreCompareProductsData[i]["color"],

	 						item_code:this.allInstoreCompareProductsData[i]["item"]["item_code"]

	 					}

	 					this.newFavoriteListLength = this.newFavoriteListLength + 1;

	 				}

 				}

 			}	

 		}

 	}
 	
 	//For setting the products to be compared
 	setComparingProducts(selectedProducts){

 		for(var i=0;i<selectedProducts.length;i++){
 			console.log("productsss");
 			for(var sp=0;sp<this.allInstoreCompareProductsData.length;sp++){
 				
 				if(selectedProducts[i]["productName"]==this.allInstoreCompareProductsData[sp]["item"]["item_name"] && selectedProducts[i]["productCost"]==this.allInstoreCompareProductsData[sp]["item"]["item_mrp"]){
 				
 					this.comparingProducts[i] ={

 							productID :this.allInstoreCompareProductsData[sp]["pId"],

							productManufacturer:this.allInstoreCompareProductsData[sp]["item"]["item_manufacturer"],

 							productName: this.allInstoreCompareProductsData[sp]["item"]["item_name"],

 							productRating : this.allInstoreCompareProductsData[sp]["starCount"],

 							productOfferPrice: this.allInstoreCompareProductsData[sp]["item"]["item_sp"],

 							productCost: this.allInstoreCompareProductsData[sp]["item"]["item_cp"],

 							productOffers: this.allInstoreCompareProductsData[sp]["offers"],

 							productDescription :this.allInstoreCompareProductsData[sp]["item"]["item_desc"],

							productColors:this.allInstoreCompareProductsData[sp]["item"]["item_imagelinks"],

							productSelectedColor:this.allInstoreCompareProductsData[sp]["color"]

 						};


 				}

 				else if(selectedProducts[i]==this.productViewItem["pId"]){

 					this.comparingProducts[i] ={

						productID :this.productViewItem["pId"],

						productManufacturer:this.productViewItem["item"]["item_manufacturer"],

						productName: this.productViewItem["item"]["item_name"],

						productRating : this.productViewItem["starCount"],

						productOfferPrice: this.productViewItem["item"]["item_sp"],

						productCost: this.productViewItem["item"]["item_cp"],

						productOffers: this.productViewItem["offers"],

						productDescription :this.productViewItem["item"]["item_desc"],

						productColors:this.productViewItem["item"]["item_imagelinks"],

						productSelectedColor:this.productViewItem["color"]

					};	

				}

 			}	

 		}

 	}

 	setColorForProduct(color){
 		this.productViewItem["color"] = color;
 	}

 	setImageNumber(imageNo){
 		this.imageNumber = imageNo;
 	}

 	setFavSet(status){ 	
 		this.favSet = status;
 	}

 	setReviewedProduct(reviewedProduct){
 		var size = this.newReviewedProducts.length;

 		var productName = reviewedProduct["productName"];
 		
 		for(var r=0;r<this.reviews.length;r++){
 	
 			if(this.reviews[r]["productName"] == productName){
 	
 					this.reviews[r] = this.reviews[this.reviews.length-1];
 
 					this.pendingReviewsCount = this.pendingReviewsCount-1;

 					this.totalCustomerNotificationsCount = this.totalCustomerNotificationsCount -1;
 
 			}
 	
 		}
 	
 		this.reviews.pop();

 		for(var ar=0;ar<this.allReviewsProductData.length;ar++){

 			if(this.allReviewsProductData[ar]["itemName"] == productName){

				this.newReviewedProducts[size] = this.allReviewsProductData[ar];

 				this.newReviewedProducts[size]["comment"] = reviewedProduct["reviewComment"];

 				this.newReviewedProducts[size]["rating"] = reviewedProduct["ratingGiven"];

 			}

 		}

 	}

 	addAsLastViewed(color,itemcode){

 		var size = this.newLastViewedItems.length;

 		var status = false;

 		if(size!= 0){

 			for(var i=0;i<size;i++){
 				
 				if(this.newLastViewedItems[i]["item_code"] == itemcode){

 					status = true;

 				}

 			}
 			if(status == false){
 			
 				this.newLastViewedItems[size]={color:color,item_code:itemcode};

 			}

 		}

 		else{
 			
 			this.newLastViewedItems[size]={color:color,item_code:itemcode};

 		}
 		
 	}

 	setCustomerUpdate(customer){

		this.customer[0] = {
					customerID:customer[0]["customerID"],

	    			customerfName:customer[0]["customerfName"],

	    			customerlName:customer[0]["customerlName"],

	    			customerImage:customer[0]["customerImage"],

	    			customerRewardPoints:customer[0]["customerRewardPoints"],

					customerContact:customer[0]["customerContact"],

					customerAddress:customer[0]["customerAddress"],

					customerEmail:customer[0]["customerEmail"],

					customerDOB:customer[0]["customerDOB"],

					customerLanguage:customer[0]["customerLanguage"],

					customerSecContact:customer[0]["customerSecContact"],

					customerFavorites:customer[0]["customerFavorites"],

					customerViewed:customer[0]["customerViewed"]

				};

 	}

 	sendSessionData(){

		this.customer[0]["customerFavorites"] = this.newFavoriteList;

		this.customer[0]["customerViewed"] = this.newLastViewedItems;
		
		
		var customerDetails = {

	 			 	'cId':this.customer[0]["customerID"],

					'cAdd':this.customer[0]["customerAddress"],

					'dob':this.customer[0]["customerDOB"],

					'email':this.customer[0]["customerEmail"],

					'imageUrl':this.customer[0]["customerImage"],

					'fName':this.customer[0]["customerfName"],

					'lName':this.customer[0]["customerlName"],

					'phone':this.customer[0]["customerContact"],

					'secPhone':this.customer[0]["customerSecContact"],

					'rewardPoints':this.customer[0]["customerRewardPoints"],

					'favs':this.customer[0]["customerFavorites"],

					'language':this.customer[0]["customerLanguage"],

					'viewed':this.customer[0]["customerViewed"]

					}


	 		var body = { 'customer':customerDetails,'review':this.newReviewedProducts};

	      	var headers = new Headers();

	      	headers.append('Content-Type', 'application/json');

	      	this.serviceHttp.post('http://localhost:8080/exit',body, {headers: headers})
	          	.subscribe(data => {
	    
	          		console.log("exit data response :");
	    
	          		console.log(data);
	     
	          	}, error => {
	    
	            	console.log(JSON.stringify(error.json()));
	    
	        });
	    
	        for(var i=0;i<=this.newReviewedProducts.length;i++){
	    
	        	this.newReviewedProducts.pop();
	    
	        }
 	
 	}

}