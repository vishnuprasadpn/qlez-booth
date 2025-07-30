import {Injectable} from "@angular/core";
import { Http,Headers } from "@angular/http";
import { Observable } from 'rxjs/observable';
import { RouterModule, Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AppDataShareService {

	allOffers:any;
	sessionID:any;
	customerStatus:boolean;
	//To be Reviewed Storage Variable
	reviews:[{}];
	//Customer Details Storage
	customer:[{}];
	//For selecting image
	imageNumber:number;
	//To Check whether the current product view item is favorite
	favSet:boolean;
	//All Product ID'S Detected Storage Variable
	productIDs:[""];
	productcontentStatus:boolean;
	switchcase:string;
	//Stores Next Page Pointer
	nextPage:string;
	viewers:any;
	compareviewers:any;
	compareDetails:any;
	compareReviewsState:any;
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

	bucketItemcodes:[""];
	compareItemcodes:[{}];
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
	//All General Offers
	generalOffers:[{}];
	readCustDt:any;
	customerManualSearchStatus:any;
	customerProductsStatus:any;
	//Flag for Session Status
	sessionClosed:boolean;

	constructor(private mockHttp: Http,private serviceHttp: Http,private router: Router) {
		//Resetting all variables in Start
		this.resetAllVariables();
	}

	//Generating Unique ID for session
	guid() {
	  function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}

	//Loading of Needed Backend Services
	startApplication(){
		this.nextPage='';
		this.generalOffers=[{}];
		this.generalOffers.pop();

		this.sessionID= this.guid();

		//Starts IOT connection and gets all General Store Offers
		this.serviceHttp.request('http://localhost:8080/products/startApp/'+this.sessionID)
		.map(res => res.json()).subscribe(res => {

			this.allOffers=res.offer;
			if(this.allOffers!=null){
				for(var ao=0;ao<this.allOffers.length;ao++){
					if(this.allOffers[ao].offer_type=="General Offers"){
						this.generalOffers.push(this.allOffers[ao]);
					}
				}
			}
		});
	}

	//On Session Start by Customer
	startReader(){
		//To validate a customer and send data customer data along with all product IDs fetched
		this.serviceHttp.request('http://localhost:8080/products/getBoothProducts/'+this.sessionID)
		.map(res => res.json()).subscribe(res => {
			if(res.productIDs!=null){
				this.productIDs = res.productIDs;
				//Filtering to only 4 Products
				while(this.productIDs.length >4){
					this.productIDs.pop();
				}
				this.readCustDt= res;

				//If Customer is Found
				if(res.cust !=null){
					//Validating if any products are found
					if(this.productIDs.length>1){
						this.bucketProductsCount = this.productIDs.length;
						//Call for Fetching Product Details
						this.getBucketProductDetails();
						this.setCustomer();
					}
					else{
						this.nextPage = "NO Products Found";
					}
				}
				else{
					this.nextPage = "NO Customer ID Found";
				}
			}
			else{
				this.nextPage = "NO Products Found";
			}
		});
		return status;
	}

	//Setting customer
	setCustomer(){
		this.productcontentStatus = true;
		//Setting Customer Details from response
		this.customer[0]={
			customerID:this.readCustDt.cust.cId,
			customerfName:this.readCustDt.cust.fName,
			customerlName:this.readCustDt.cust.lName,
			customerImage:this.readCustDt.cust.imageUrl,
			customerRewardPoints:this.readCustDt.cust.rewardPoints,
			customerContact:this.readCustDt.cust.phone,
			customerAddress:this.readCustDt.cust.cAdd,
			customerEmail:this.readCustDt.cust.email,
			customerDOB:this.readCustDt.cust.dob,
			customerLanguage:this.readCustDt.cust.language,
			customerSecContact:this.readCustDt.cust.secPhone,
			customerFavorites:this.readCustDt.cust.favs,
			customerViewed:this.readCustDt.cust.viewed,
			customerGender:this.readCustDt.cust.gender,
			customerEarnedCashCoin:this.readCustDt.cust.earnedCoins,
			customerDeposit:this.readCustDt.cust.depositCoins,
			customerPin:this.readCustDt.cust.securePin
		};

		//Setting image for customer profile view if no image is provided
		if(this.customer[0]["customerImage"]=="No Image Link Provided"){
			if(this.readCustDt.cust.gender=="Male"){
				this.customer[0]["customerImage"]="http://todayoffers.in/public/images/dummy.png";
			}
			else{
				this.customer[0]["customerImage"]="http://visszaavadonba.hu/wp-content/uploads/noi-sziluett.png";
			}
		}

		//Getting Item Code and Color details of Customer Favorite Products
		if(this.customer[0]["customerFavorites"]!=null){
			if(this.customer[0]["customerFavorites"].length != null){
				for(var fl = 0;fl<this.customer[0]["customerFavorites"].length;fl++){
					this.newFavoriteList[fl] = this.customer[0]["customerFavorites"][fl];
				}
				this.newFavoriteListLength = this.customer[0]["customerFavorites"].length;
			}
		}

		//Getting Item Code and Color details of Customer Last Viewed Products
		if(this.customer[0]["customerViewed"]!=null){
			if(this.customer[0]["customerViewed"].length != null){
				for(var fl = 0;fl<this.customer[0]["customerViewed"].length;fl++){
					this.newLastViewedItems[fl] = this.customer[0]["customerViewed"][fl];
				}
				this.newLastViewLength = this.customer[0]["customerViewed"].length;
			}
		}

		//Fetching Customer Favorite and Lastviewed Products
		this.getCustomerProducts();

		//Reviews pending for a customer
		if(this.readCustDt.review != null && this.readCustDt.review.length!=0){
			this.pendingReviewsCount = this.readCustDt.review.length;
			this.totalCustomerNotificationsCount = this.pendingReviewsCount;
			for(var i =0;i<this.readCustDt.review.length;i++){
				this.allReviewsProductData[i] = this.readCustDt.review[i];
				var dOfPurchase=this.readCustDt.review[i]["pDate"].substr(0, 10);
				var pImage = this.readCustDt.review[i]["itemImage"][0];
				this.reviews[i] ={
					productName:this.readCustDt.review[i]["itemName"],
					productSP:this.readCustDt.review[i]["sPrice"],
					dateOfPurchase:dOfPurchase,
					productImage:pImage,
					ratingGiven:this.readCustDt.review[i]["rating"],
					reviewComment:this.readCustDt.review[i]["comment"],
					timestamp:null
				};
			}
		}
		else{
			this.reviews = null;
		}

		//Setting Next View For Customer
		this.nextPage = "notifications";
	}

	//Getting customer details by contact and passcode to login into Booth
	getCustomerByDetails(contact,passcode){
		this.customerManualSearchStatus=false;
		var body = {'primary_contact' : contact,'login_passcode':passcode,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/customer/boothCustomerLogin',body, {headers: headers})
			.subscribe(data => {
				this.customerManualSearchStatus=true;
				if(data.json().cust!=null){
					this.readCustDt.review=data.json().review;
					this.readCustDt.cust= data.json().cust;
					this.setCustomer();
				}
		}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//To get Details of products in the bucket
	getBucketProductDetails(){
		var i;var average;var imageLink;var stars=[];var colors=[];
		var body = {'productIDs' : this.productIDs,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/products/bucketProducts',body, {headers: headers})
			.subscribe(data => {
			var bucketProducts=data.json().completeProductDetails;

			//Storing bucket count globally
			this.bucketProductsCount=bucketProducts.length;
			//For Setting Thumb for each Bucket product in Bucket Section
			for(i=0;i<bucketProducts.length;i++){
				this.allBucketProductsData[i] = bucketProducts[i];
				var totcount =0;var sum =0;
				var totsum = 0;var starcount=0;
				var itemcode = bucketProducts[i]["item"]["item_code"];
				this.bucketItemcodes.push(itemcode);

				//Setting default image for each product
				var imageurl;var color;
				var selectedColor = bucketProducts[i]["color"].toLocaleLowerCase();
				colors= Object.keys(bucketProducts[i]["item"]["item_imagelinks"]);
				var imgStatus=false;
				for(var img=0;img<colors.length;img++){
					color = colors[img].toLocaleLowerCase();
					if(color == selectedColor){
						imgStatus=true;
						imageurl = bucketProducts[i]["item"]["item_imagelinks"][colors[img]][0];
					}
				}

				if(imgStatus==false){
					imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
				}
				if (imageurl.match(/\.(jpeg|jpg|gif|png|JPG)$/) == null) {
					imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
				}

				this.bucketProductsThumb[i] = {
					productID :bucketProducts[i]["pId"],
					productName:bucketProducts[i]["item"]["item_name"],
					productRating:null,
					productOfferPrice: bucketProducts[i]["item"]["item_sp"],
					productImage:imageurl
				}
			}
			//Getting Reviews for the Bucket Products
			this.getBucketProductReviewers(this.bucketItemcodes);

		}, error => {console.log(JSON.stringify(error.json()));});
	}

	//Getting Bucket Product reviews
	getBucketProductReviewers(bucketItemcodes){
		var body = {'itemCodeList' : bucketItemcodes,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/reviews/bucketProductsReviews',body, {headers: headers})
			.subscribe(data => {
				var viewers = data.json();
				for(var p=0;p<this.allBucketProductsData.length;p++){
					var bucketProductCode =this.allBucketProductsData[p]["item"]["item_code"];
					var pReviewer=[];
					var stars;
					var star5,star4,star3,star2,star1;
					star5=star4=star3=star2=star1=0;
					for(var v=0;v<viewers.length;v++){
						var viewerICode=viewers[v]["itemCode"];
						if(viewerICode==bucketProductCode && viewers[v]["reviewComment"] !="null"){
							pReviewer.push(viewers[v]);
							if(viewers[v]["reviewRating"]=="5"){
								star5=star5+1;
							}
							else if(viewers[v]["reviewRating"]=="4"){
								star4=star4+1;
							}
							else if(viewers[v]["reviewRating"]=="3"){
								star3=star3+1;
							}
							else if(viewers[v]["reviewRating"]=="2"){
								star2=star2+1;
							}
							else if(viewers[v]["reviewRating"]=="1"){
								star1=star1+1;
							}
						}
					}
					//Setting Avg Star for the product
					var starCount={"5":star5,"4":star4,"3":star3,"2":star2,"1":star1};
					this.allBucketProductsData[p]["productReviewers"]=pReviewer;
					this.allBucketProductsData[p]["starCount"]=starCount;
					if(this.allBucketProductsData[p]["starCount"] != null){
						stars= Object.keys(this.allBucketProductsData[p]["starCount"]);
						this.productAverageStar= 0;
						var tstarcount,sum,totcount;
						sum=totcount=0;
						for(var j=0;j<stars.length;j++){
							tstarcount = this.allBucketProductsData[p]["starCount"][stars[j]];
							sum = stars[j] * tstarcount +sum;
							totcount = totcount + tstarcount;
						}
						this.productAverageStar =sum / totcount;
					}
					else{
						this.productAverageStar =null;
					}

					for(var tp=0;tp<this.bucketProductsThumb.length;tp++){
						if(this.bucketProductsThumb[tp]["productID"]==this.allBucketProductsData[p]["pId"]){
							this.bucketProductsThumb[tp]["productRating"] = this.productAverageStar;
						}
					}

				}

		}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//Getting customer products like favorite and last viewed
	getCustomerProducts(){
		var i, average, imageLink;var stars=[];var colors = [];
		var custFav = this.customer[0]["customerFavorites"];
		var itemCodeList=[""];
		itemCodeList.pop();
		if(custFav!=null && custFav.length >0){
			for(var c=0;c<custFav.length;c++){
				itemCodeList.push(custFav[c]["item_code"]);
			}
		}
		var custLastViewd = this.customer[0]["customerViewed"];

		if(custLastViewd!=null && custLastViewd.length >0){
			while(custLastViewd.length >4){
				custLastViewd.pop();
			}
			for(var c=0;c<custLastViewd.length;c++){
				itemCodeList.push(custLastViewd[c]["item_code"]);
			}
		}

		if(custLastViewd!=null || custFav!=null){
			this.getCustomerProductReviewers(itemCodeList);
			var body = {'favorite':custFav,'lastViewed':custLastViewd,'sessionID':this.sessionID};
			var headers = new Headers();

			headers.append('Content-Type', 'application/json');
			this.serviceHttp.post('http://localhost:8080/products/customerProducts',body, {headers: headers})
				.subscribe(data => {
					if(data.json().customerFavorites.completeProductDetails.length !=0){
						for(var i=0;i<data.json().customerFavorites.completeProductDetails.length;i++){
							this.allFavoriteProductsData[i] = data.json().customerFavorites.completeProductDetails[i];
							var totcount =0;var sum =0;
							var totsum = 0; var starcount=0;
							var imageurl,color,selectedColor;
							colors= Object.keys(data.json().customerFavorites.completeProductDetails[i]["item"]["item_imagelinks"]);

							//If no selected color is present for  the product
							if(data.json().customerFavorites.completeProductDetails[i]["color"]!=undefined && data.json().customerFavorites.completeProductDetails[i]["color"]!=null){
								selectedColor = data.json().customerFavorites.completeProductDetails[i]["color"];
							}
							else{
								selectedColor= colors[0];
							}
							var noImage =false;
							for(var img=0;img<colors.length;img++){
								color = colors[img].toLocaleLowerCase();
								selectedColor = selectedColor.toLocaleLowerCase();
								if(color == selectedColor){
									imageurl = data.json().customerFavorites.completeProductDetails[i]["item"]["item_imagelinks"][colors[img]][0];
									noImage=true;
								}
							}
							// if(noImage ==false){
							// 	imageurl = "https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
							// }
							this.favoriteProductsThumb[i] = {
								productItemCode:data.json().customerFavorites.completeProductDetails[i]["item"]["item_code"],
								productColor:selectedColor,
								productID:data.json().customerFavorites.completeProductDetails[i]["pId"],
								productName:data.json().customerFavorites.completeProductDetails[i]["item"]["item_name"],
								productRating:null,
								productOfferPrice: data.json().customerFavorites.completeProductDetails[i]["item"]["item_sp"],
								productImage:imageurl
							}
						}
					}
					else{
						this.favoriteProductsThumb.pop();
					}
					if(data.json().customerLastViewed.completeProductDetails.length !=0){
						//Setting LastViewed Products Thumb
						for(var i=0;i<data.json().customerLastViewed.completeProductDetails.length;i++){

							this.allLastViewedProductsData[i] = data.json().customerLastViewed.completeProductDetails[i];
							var totcount =0;var sum =0;
							var totsum = 0; var starcount=0;
							var imageurl= null;var color,selectedColor;

							colors= Object.keys(this.allLastViewedProductsData[i]["item"]["item_imagelinks"]);

							//If no selected color is present for  the product
							var itmClr=data.json().customerLastViewed.completeProductDetails[i]["color"];
							if(itmClr!=undefined && itmClr !=null){
								selectedColor = data.json().customerLastViewed.completeProductDetails[i]["color"].toLocaleLowerCase();
							}
							else{
								selectedColor = colors[0];
							}

							var imgStatus=false;
							for(var img=0;img<colors.length;img++){
								color = colors[img].toLocaleLowerCase();
								selectedColor = selectedColor.toLocaleLowerCase();
								if(color == selectedColor){
									imgStatus=true;
									imageurl = this.allLastViewedProductsData[i]["item"]["item_imagelinks"][colors[img]][0];
								}
							}

							if(imgStatus==false){
								imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
							}

							if(imageurl.match(/\.(jpeg|jpg|gif|png|JPG)$/) == null){
								imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
							}

							this.lastViewedProductsThumb[i] = {
								productID : data.json().customerLastViewed.completeProductDetails[i]["pId"],
								productName:data.json().customerLastViewed.completeProductDetails[i]["item"]["item_name"],
								productRating:null,
								productOfferPrice: data.json().customerLastViewed.completeProductDetails[i]["item"]["item_sp"],
								productImage:imageurl
							}
						}
					}
					else{
						this.lastViewedProductsThumb.pop();
					}
					this.setCustomerProductReviews();
				}, error => {
					console.log(JSON.stringify(error.json()));
			});
		}
	}

	//Getting customer product reviews
	getCustomerProductReviewers(customerItemcodes){
		var body = {'itemCodeList' : customerItemcodes,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/reviews/customerProductsReviews',body, {headers: headers})
			.subscribe(data => {
				this.viewers = data.json();
		}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//Setting customer product reviews
	setCustomerProductReviews(){
		for(var p=0;p<this.allFavoriteProductsData.length;p++){
			var custFavProductCode =this.allFavoriteProductsData[p]["item"]["item_code"];
			var pReviewer=[];
			var stars;
			var star5,star4,star3,star2,star1;
			star5=star4=star3=star2=star1=0;
			for(var v=0;v<this.viewers.length;v++){
				var viewerICode=this.viewers[v]["itemCode"];
				if(viewerICode==custFavProductCode && this.viewers[v]["reviewComment"] !="null"){

					pReviewer.push(this.viewers[v]);
					if(this.viewers[v]["reviewRating"]=="5"){
						star5=star5+1;
					}
					else if(this.viewers[v]["reviewRating"]=="4"){
						star4=star4+1;
					}
					else if(this.viewers[v]["reviewRating"]=="3"){
						star3=star3+1;
					}
					else if(this.viewers[v]["reviewRating"]=="2"){
						star2=star2+1;
					}
					else if(this.viewers[v]["reviewRating"]=="1"){
						star1=star1+1;
					}
				}
			}
			var starCount={"5":star5,"4":star4,"3":star3,"2":star2,"1":star1};
			this.allFavoriteProductsData[p]["productReviewers"]=pReviewer;
			this.allFavoriteProductsData[p]["starCount"]=starCount;
			if(this.allFavoriteProductsData[p]["starCount"] != null){
				stars= Object.keys(this.allFavoriteProductsData[p]["starCount"]);
				this.productAverageStar= 0;
				var tstarcount,sum,totcount;
				sum=totcount=0;
				for(var j=0;j<stars.length;j++){
					tstarcount = this.allFavoriteProductsData[p]["starCount"][stars[j]];
					sum = stars[j] * tstarcount +sum;
					totcount = totcount+tstarcount;
				}
				this.productAverageStar =sum/totcount;
			}
			else{
				this.productAverageStar =null;
			}
			for(var tp=0;tp<this.favoriteProductsThumb.length;tp++){
				if(this.favoriteProductsThumb[tp]["productID"]==this.allFavoriteProductsData[p]["pId"]){
					this.favoriteProductsThumb[tp]["productRating"] = this.productAverageStar;
				}
			}
		}

		for(var p=0;p<this.allLastViewedProductsData.length;p++){
			var custFavProductCode =this.allLastViewedProductsData[p]["item"]["item_code"];
			var pReviewer=[];
			var stars;
			var star5,star4,star3,star2,star1;
			star5=star4=star3=star2=star1=0;
			for(var v=0;v<this.viewers.length;v++){
				var viewerICode=this.viewers[v]["itemCode"];
				if(viewerICode==custFavProductCode && this.viewers[v]["reviewComment"] !="null"){
					pReviewer.push(this.viewers[v]);
					if(this.viewers[v]["reviewRating"]=="5"){
						star5=star5+1;
					}
					else if(this.viewers[v]["reviewRating"]=="4"){
						star4=star4+1;
					}
					else if(this.viewers[v]["reviewRating"]=="3"){
						star3=star3+1;
					}
					else if(this.viewers[v]["reviewRating"]=="2"){
						star2=star2+1;
					}
					else if(this.viewers[v]["reviewRating"]=="1"){
						star1=star1+1;
					}
				}
			}
			var starCount={"5":star5,"4":star4,"3":star3,"2":star2,"1":star1};
			this.allLastViewedProductsData[p]["productReviewers"]=pReviewer;
			this.allLastViewedProductsData[p]["starCount"]=starCount;
			if(this.allLastViewedProductsData[p]["starCount"] != null){
				stars= Object.keys(this.allLastViewedProductsData[p]["starCount"]);
				this.productAverageStar= 0;
				var tstarcount,sum,totcount;
				sum=totcount=0;
				for(var j=0;j<stars.length;j++){
					tstarcount = this.allLastViewedProductsData[p]["starCount"][stars[j]];
					sum = stars[j] * tstarcount +sum;
					totcount = totcount+tstarcount;
				}
				this.productAverageStar =sum/totcount;
			}
			else{
				this.productAverageStar =null;
			}

			for(var tp=0;tp<this.lastViewedProductsThumb.length;tp++){
				if(this.lastViewedProductsThumb[tp]["productID"]==this.allLastViewedProductsData[p]["pId"]){
					this.lastViewedProductsThumb[tp]["productRating"] = this.productAverageStar;
				}
			}
		}
	}

	//Setting Similar Products
	getSimilarProducts(group,category,sub_category){
		var colors=[];
		this.clearCompareData();
		var body = {'productGroup' : group,'productCategory':category,'productSubCategory':sub_category,'sessionID':this.sessionID};
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
					var imageurl;var color;var selectedColor;
					if(data.json().instoreCompareProducts.completeProductDetails[i]["item"]!=undefined || data.json().instoreCompareProducts.completeProductDetails[i]["item"]!=null){
						colors= Object.keys(data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"]);
						var itmClr=data.json().instoreCompareProducts.completeProductDetails[i]["color"];

						if(itmClr!=null && itmClr!=undefined){
							selectedColor=data.json().instoreCompareProducts.completeProductDetails[i]["color"];
							imageurl = data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"][itmClr][0];
						}
						else{
							var clr=colors[0];
							imageurl=data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_imagelinks"][clr][0];
						}

						if(imageurl.match(/\.(jpeg|jpg|gif|png|JPG)$/) == null){
							imageurl="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
						}

						if(this.compareInstoreProductsThumb.length<6){
								var itemdt={itemCode:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_code"],itemCategory:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_category"]};
								this.compareItemcodes.push(itemdt);
								var pdt = {
									productNo:i,
									productColor:data.json().instoreCompareProducts.completeProductDetails[i]["color"],
									productItemCode:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_code"],
									productID:data.json().instoreCompareProducts.completeProductDetails[i]["pId"],
									productName:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_name"],
									productOfferPrice:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_sp"],
									productImage:imageurl,
									productCost:data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_mrp"],
									productPercentOff:""
								};
								if(this.compareInstoreProductsThumb.length>0){
									var addStatus=false;
									for(var cit=0;cit<this.compareInstoreProductsThumb.length;cit++){
										if(this.compareInstoreProductsThumb[cit]["productItemCode"] == data.json().instoreCompareProducts.completeProductDetails[i]["item"]["item_code"] && this.compareInstoreProductsThumb[cit]["productColor"] == data.json().instoreCompareProducts.completeProductDetails[i]["color"]){
											addStatus=true;
										}
									}
									if(addStatus==false){
										this.compareInstoreProductsThumb.push(pdt);
									}
								}
								else{
									this.compareInstoreProductsThumb.push(pdt);
								}
						}
					}
				}
				if(this.sessionClosed!=true){
					this.getSimilarProductsReviews(this.compareItemcodes);
					this.nextPage="compare-instore-selector";
				}
			}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//Getting similar product reviews
	getSimilarProductsReviews(compareItemcodes){
		var body = {'itemCodeList' : compareItemcodes,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/reviews/compareProductsReviews',body, {headers: headers})
			.subscribe(data => {
				this.compareviewers = data.json();
				this.setSimilarProductReviews();
				this.getSimilarProductsDetails(compareItemcodes);
				this.compareReviewsState=true;
		}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//Getting Similar Product Details
	getSimilarProductsDetails(compareItemcodes){
		var body = {'itemCodeList' : compareItemcodes,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/products/compareProductsDetails',body, {headers: headers})
			.subscribe(data => {
				this.compareDetails = data.json().instoreCompareProducts.completeProductDetails;
				this.setSimilarProductDetails();
		}, error => {
				console.log(JSON.stringify(error.json()));
		});
	}

	//Setting Reviews for Similar Products
	setSimilarProductReviews(){
		for(var p=0;p<this.allInstoreCompareProductsData.length;p++){
			var compFavProductCode =this.allInstoreCompareProductsData[p]["item"]["item_code"];
			var pReviewer=[];
			var stars;
			var star5,star4,star3,star2,star1;
			star5=star4=star3=star2=star1=0;
			for(var v=0;v<this.compareviewers.length;v++){
				var viewerICode=this.compareviewers[v]["itemCode"];
				if(viewerICode==compFavProductCode && this.compareviewers[v]["reviewComment"] !="null"){

					pReviewer.push(this.compareviewers[v]);
					if(this.compareviewers[v]["reviewRating"]=="5"){
						star5=star5+1;
					}
					else if(this.compareviewers[v]["reviewRating"]=="4"){
						star4=star4+1;
					}
					else if(this.compareviewers[v]["reviewRating"]=="3"){
						star3=star3+1;
					}
					else if(this.compareviewers[v]["reviewRating"]=="2"){
						star2=star2+1;
					}
					else if(this.compareviewers[v]["reviewRating"]=="1"){
						star1=star1+1;
					}
				}
			}
			var starCount={"5":star5,"4":star4,"3":star3,"2":star2,"1":star1};
			this.allInstoreCompareProductsData[p]["productReviewers"]=pReviewer;
			this.allInstoreCompareProductsData[p]["starCount"]=starCount;
		}
	}

	//Setting Instore Products Details
	setSimilarProductDetails(){
		for(var p=0;p<this.allInstoreCompareProductsData.length;p++){
			for(var cpd=0;cpd<this.compareDetails.length;cpd++){
				if(this.compareDetails[cpd]["itemCode"]==this.allInstoreCompareProductsData[p]["item"]["item_code"]){
					this.allInstoreCompareProductsData[p]["pId"] = this.compareDetails[cpd]["pId"];
					this.allInstoreCompareProductsData[p]["color"] = this.compareDetails[cpd]["color"];
					this.allInstoreCompareProductsData[p]["sizeCount"] = this.compareDetails[cpd]["sizeCount"];
					this.allInstoreCompareProductsData[p]["sizeSelected"] = this.compareDetails[cpd]["sizeSelected"];
				}
			}
		}
	}

	//For setting the product to view from Bucket
	setProductViewItemfrmBucket(productID){
		this.favSet = false;
		this.sessionClosed=false;
		this.nextPage='';
		var cColor,cItemcode,pColor,pItemcode;
		for(var i=0;i<this.allBucketProductsData.length;i++){
			if(this.allBucketProductsData[i]["pId"]==productID){
				this.productViewItem = this.allBucketProductsData[i];

				//To set as favorite if already done
				if(this.newFavoriteList!=null && this.newFavoriteList.length>0){
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
		}
	}

	//Setting product as favorite from product view
	setMyFavoriteProductsfromView(favoriteStatus){
		var currentColor;
		if(this.productViewItem["color"]==null ||this.productViewItem["color"]==undefined){
			var colors =Object.keys(this.productViewItem["item"]["item_imagelinks"]);
			currentColor =colors[0];
		}
		else{
			currentColor = this.productViewItem["color"];
		}
		if(favoriteStatus == true){
			var favpdt ={item_code:this.productViewItem["item"]["item_code"],color:currentColor};
			this.newFavoriteList.push(favpdt);
		}
		else{
			if(this.newFavoriteList.length >0){
				for(var fl=0;fl<this.newFavoriteList.length;fl++){
					var	flItemcode = this.newFavoriteList[fl]["item_code"].toLocaleLowerCase();
					var pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
					if( flItemcode == pItemcode){
						for(var i=fl;i<this.newFavoriteList.length;i++){
							this.newFavoriteList[i]= this.newFavoriteList[i+1];
						}
						this.newFavoriteList.pop();
					}
				}
			}
		}

		var addStatus = true;
		if(this.favoriteProductsThumb.length>0){
			for(var f=0;f<this.favoriteProductsThumb.length;f++){
				if(this.favoriteProductsThumb[f]["productItemCode"] == this.productViewItem["item"]["item_code"]){
					addStatus=false;
					for(var r=f;r<this.favoriteProductsThumb.length-1;r++){
						this.favoriteProductsThumb[r]=this.favoriteProductsThumb[r+1];
					}
					this.favoriteProductsThumb.pop();
				}
			}
		}
		if(addStatus==true){
			var imageurl,color,selectedColor;
			colors= Object.keys(this.productViewItem["item"]["item_imagelinks"]);

			//If no selected color is present for  the product
			if(this.productViewItem["color"]!=undefined && this.productViewItem["color"]!=null){
				selectedColor = this.productViewItem["color"];
			}
			else{
				selectedColor= colors[0];
			}

			for(var img=0;img<colors.length;img++){
				color = colors[img].toLocaleLowerCase();
				selectedColor = selectedColor.toLocaleLowerCase();
				if(color == selectedColor){
					imageurl = this.productViewItem["item"]["item_imagelinks"][colors[img]][0];
				}
				else{
					imageurl = "https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";
				}
			}

			var starcount,sum;
			var totcount=0,totSum=0,productAverageStar= 0;
			var starsArray=[];

			if(this.productViewItem["starCount"] != null){

				starsArray= Object.keys(this.productViewItem["starCount"]);
				sum=0;
				productAverageStar= 0;
				for(var j=0;j<starsArray.length;j++){
					starcount = this.productViewItem["starCount"][starsArray[j]];
					sum = starsArray[j] * starcount +sum;
					totcount = totcount + starcount;
				}
				productAverageStar = Math.round(sum / totcount);
			}
			var pdt = {
				productItemCode:this.productViewItem["item"]["item_code"],
				productColor:this.productViewItem["color"],
				productID:this.productViewItem["pId"],
				productName:this.productViewItem["item"]["item_name"],
				productRating:productAverageStar,
				productOfferPrice: this.productViewItem["item"]["item_sp"],
				productImage:imageurl
			}
			this.favoriteProductsThumb.push(pdt);
		}
	}

	//For setting the product to view from Favorites
	setProductViewItemFrmFavorite(product){
		this.sessionClosed=false;
		var cColor,cItemcode,pColor,pItemcode;
		for(var i=0;i<this.allFavoriteProductsData.length;i++){
			if(this.allFavoriteProductsData[i]["item"]["item_code"]==product["productItemCode"]){
				this.productViewItem = this.allFavoriteProductsData[i];
				this.favSet = true;
			}
		}
	}

	//For setting the product to view from Last Viewed
	setProductViewItemFrmLast(product){
		this.sessionClosed=false;
		var cColor,cItemcode,pColor,pItemcode;
		for(var i=0;i<this.allLastViewedProductsData.length;i++){
			if(this.allLastViewedProductsData[i]["item"]["item_name"]==product["productName"] && this.allLastViewedProductsData[i]["item"]["item_sp"]==product["productOfferPrice"]){
				this.productViewItem = this.allLastViewedProductsData[i];
				if(this.newFavoriteList != null){
					this.favSet=false;
					for(var fav=0;fav<this.newFavoriteList.length;fav++){
						cColor = this.newFavoriteList[fav]["color"].toLocaleLowerCase();
						cItemcode = this.newFavoriteList[fav]["item_code"].toLocaleLowerCase();
						pColor = this.productViewItem["color"];
						if(pColor!=null && pColor!=undefined){
							pColor = pColor.toLocaleLowerCase();
						}
						else{
							pColor=cColor;
						}
						pItemcode = this.productViewItem["item"]["item_code"].toLocaleLowerCase();
						if(cColor == pColor && cItemcode == pItemcode){
							this.favSet = true;
						}
					}
				}
			}
		}
	}

	//For setting the product to view from Last Viewed
	setProductViewItemFrmCompare(product){
		this.favSet = false;
		this.sessionClosed=false;
		var cColor,cItemcode,pColor,pItemcode;
		for(var i=0;i<this.allInstoreCompareProductsData.length;i++){
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
	}

	//For Setting My Favorite Product from Compare
	setMyFavoriteProductsfromCompare(product){
		var i;
		var currentColor;
		if(this.newFavoriteListLength !=null && this.newFavoriteListLength>0){
			var status = false;
			for(var j=0;j<this.newFavoriteList.length;j++){
				if(this.newFavoriteList[j]["item_code"]==product["productItemCode"]){
					status=true;
				}
			}
			if(status==false){
				var fvproduct={
					item_code:product["productItemCode"],
					color:product["productColor"]
				};
				this.newFavoriteList.push(fvproduct);
			}
			else{
				for(var p=j;p<this.newFavoriteList.length-1;p++){
					this.newFavoriteList[p]=this.newFavoriteList[p+1];
				}
				this.newFavoriteList.pop();
			}
		}
		else{
			var pdt = {
				color:product["productColor"],
				item_code:product["productItemCode"]
			}
			this.newFavoriteList.push(pdt);
		}

		var addStatus=true;
		if(this.favoriteProductsThumb.length>0){
			for(var f=0;f<this.favoriteProductsThumb.length;f++){

				if(this.favoriteProductsThumb[f]["productItemCode"] == product["productItemCode"] && this.favoriteProductsThumb[f]["productColor"] == product["productColor"]){
					addStatus=false;
					for(var r=f;r<this.favoriteProductsThumb.length-1;r++){
						this.favoriteProductsThumb[r]=this.favoriteProductsThumb[r+1];
					}
					this.favoriteProductsThumb.pop();
				}
			}
		}

		if(addStatus==true){
			var fvpdt = {
				productItemCode:product["productItemCode"],
				productColor:product["productColor"],
				productID:product["productID"],
				productName:product["productName"],
				productRating:product["productRating"],
				productOfferPrice: product["productOfferPrice"],
				productImage:product["productImage"]
			}
			this.favoriteProductsThumb.push(fvpdt);
			for(var p=0;p<this.allInstoreCompareProductsData.length;p++){
				if(product["productItemCode"]==this.allInstoreCompareProductsData[p]["item"]["item_code"]){
					var newFav =this.allInstoreCompareProductsData[p];
					this.allFavoriteProductsData.push(newFav);
				}
			}
		}

	}

	//For setting the products to be compared
	setComparingProducts(selectedProducts){
		this.comparingProducts=[{}];
		this.comparingProducts.pop();

		if(this.newFavoriteList[0]=="" || this.newFavoriteList[0] == undefined){
			this.newFavoriteList.pop();
		}

		var fav,pdt;

		for(var i=0;i<selectedProducts.length;i++){
			for(var sp=0;sp<this.allInstoreCompareProductsData.length;sp++){
				if(selectedProducts[i]["productItemCode"]==this.allInstoreCompareProductsData[sp]["item"]["item_code"]){
					fav ="#222222";
					for(var f=0;f<this.newFavoriteList.length;f++){
						if(this.newFavoriteList[f]["item_code"]==selectedProducts[i]["productItemCode"]){
							fav = "red";
						}
					}

					var scolor;
					if(this.allInstoreCompareProductsData[sp]["color"]==null || this.allInstoreCompareProductsData[sp]["color"] == undefined){
						var colors = Object.keys(this.allInstoreCompareProductsData[sp]["item"]["item_imagelinks"]);
						scolor = colors[0];
					}
					else{
						scolor = this.allInstoreCompareProductsData[sp]["color"];
					}

					pdt = {
						productID :this.allInstoreCompareProductsData[sp]["pId"],
						productItemCode:this.allInstoreCompareProductsData[sp]["item"]["item_code"],
						productManufacturer:this.allInstoreCompareProductsData[sp]["item"]["item_manufacturer"],
						productName: this.allInstoreCompareProductsData[sp]["item"]["item_name"],
						productRating : this.allInstoreCompareProductsData[sp]["starCount"],
						productOfferPrice: this.allInstoreCompareProductsData[sp]["item"]["item_sp"],
						productCost: this.allInstoreCompareProductsData[sp]["item"]["item_cp"],
						productOffers: this.allInstoreCompareProductsData[sp]["offers"],
						productDescription :this.allInstoreCompareProductsData[sp]["item"]["item_desc"],
						productColors:this.allInstoreCompareProductsData[sp]["item"]["item_imagelinks"],
						productSelectedColor:scolor,
						productFavorite:fav
					};
					this.comparingProducts.push(pdt);
				}
			}
		}

		fav ="#222222";
		for(var f=0;f<this.newFavoriteList.length;f++){
			if(this.newFavoriteList[f]["item_code"]==this.productViewItem["item"]["item_code"] && this.newFavoriteList[f]["color"]==this.productViewItem["color"]){
				fav = "red";
			}
		}

		pdt ={
			productID :this.productViewItem["pId"],
			productItemCode:this.productViewItem["item"]["item_code"],
			productManufacturer:this.productViewItem["item"]["item_manufacturer"],
			productName: this.productViewItem["item"]["item_name"],
			productRating : this.productViewItem["starCount"],
			productOfferPrice: this.productViewItem["item"]["item_sp"],
			productCost: this.productViewItem["item"]["item_cp"],
			productOffers: this.productViewItem["offers"],
			productDescription :this.productViewItem["item"]["item_desc"],
			productColors:this.productViewItem["item"]["item_imagelinks"],
			productSelectedColor:this.productViewItem["color"],
			productFavorite:fav
		};
		this.comparingProducts.push(pdt);
	}

	setColorForProduct(color){
		this.productViewItem["color"] = color;
	}

	//Setting Selected image from image-list in Product view
	setImageNumber(imageNo){
		this.imageNumber = imageNo;
	}

	//Set Favorite Status for current product
	setFavSet(status){
		this.favSet = status;
	}

	//Updating Reviewed Product locally
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
				this.newReviewedProducts[size]["timestamp"] = reviewedProduct["timestamp"];
			}
		}
	}

	//Add current viewed product as last viewed
	addAsLastViewed(color,itemcode){
		var size = this.newLastViewedItems.length;
		var status = false;
		if(size> 0){
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

	//Updating Customer Details
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
			customerViewed:customer[0]["customerViewed"],
			customerGender:customer[0]["customerGender"],
			customerEarnedCashCoin:customer[0]["customerEarnedCashCoin"],
			customerDeposit:customer[0]["customerDeposit"],
			customerPin:customer[0]["customerPin"]
		};
	}

	//Saving Customer Data on Logout
	sendSessionData(){
		this.customer[0]["customerFavorites"] = this.newFavoriteList;
		this.customer[0]["customerViewed"] = this.newLastViewedItems;
		var customerDetails = {
			'cId':this.customer[0]["customerID"],
			'cAdd':this.customer[0]["customerAddress"],
			'dob':this.customer[0]["customerDOB"],
			'email':this.customer[0]["customerEmail"],
			'depositCoins':this.customer[0]["customerDeposit"],
			'earnedCoins':this.customer[0]["customerEarnedCashCoin"],
			'imageUrl':this.customer[0]["customerImage"],
			'fName':this.customer[0]["customerfName"],
			'lName':this.customer[0]["customerlName"],
			'gender':this.customer[0]["customerGender"],
			'phone':this.customer[0]["customerContact"],
			'secPhone':this.customer[0]["customerSecContact"],
			'rewardPoints':this.customer[0]["customerRewardPoints"],
			'favs':this.customer[0]["customerFavorites"],
			'language':this.customer[0]["customerLanguage"],
			'viewed':this.customer[0]["customerViewed"],
			'securePin':this.customer[0]["customerPin"]
		}
		var body = { 'customer':customerDetails,'review':this.newReviewedProducts,'sessionID':this.sessionID};
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		this.serviceHttp.post('http://localhost:8080/exit',body, {headers: headers})
			.subscribe(data => {

			}, error => {
				console.log(JSON.stringify(error.json()));
		});

		this.resetAllVariables();
		this.sessionClosed=true;
		this.nextPage='';
	}

	//Clearing existing Instore Compare Product Data
	clearCompareData(){
		this.allInstoreCompareProductsData=[{}];
		this.compareInstoreProductsThumb =[{}];
		this.allInstoreCompareProductsData.pop();
		this.compareInstoreProductsThumb.pop();
		this.compareInstoreProductsThumb = [{}];
		this.compareInstoreProductsThumb.pop();
		this.comparingProducts = [{}];
		this.comparingProducts.pop();
	}

	//Call for Assistance
	getAssistance(){
		this.serviceHttp.request('http://localhost:8080/exit/needAssistance/'+this.sessionID)
		.map(res => res.json()).subscribe(res => {
			console.log("getting assistance");
		});
	}

	//Resetting All Variables
	resetAllVariables(){
		this.sessionID="";
		this.compareReviewsState=false;
		this.bucketItemcodes=[""];
		this.bucketItemcodes.pop();
		this.compareItemcodes=[""];
		this.compareItemcodes.pop();
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
		this.allFavoriteProductsData =[{}];
		this.allFavoriteProductsData.pop();
		this.allLastViewedProductsData =[{}];
		this.allLastViewedProductsData.pop();
		this.allInstoreCompareProductsData = [{}];
		this.allInstoreCompareProductsData.pop();
		this.allReviewsProductData = [{}];
		this.allReviewsProductData.pop();
		this.favoriteProductsThumb = [{}];
		this.favoriteProductsThumb.pop();
		this.bucketProductsThumb = [{}];
		this.bucketProductsThumb.pop();

		this.allBucketProductsData =[{}];
		this.allBucketProductsData.pop();

		this.productViewItem = {};
		this.lastViewedProductsThumb = [{}];
		this.lastViewedProductsThumb.pop();
		this.compareInstoreProductsThumb = [{}];
		this.compareInstoreProductsThumb.pop();
		this.comparingProducts = [{}];
		this.comparingProducts.pop();
		this.newLastViewedItems =[{}];
		this.newLastViewedItems.pop();
		this.newLastViewLength = 0;
		this.newFavoriteList = [{}];
		this.newFavoriteList.pop();
		this.newFavoriteListLength =0;
		this.newReviewedProducts=[{}];
		this.newLastViewedItems.pop();
		this.newReviewedProducts.pop();
		this.amzOnlineCompare ={};
		this.customerManualSearchStatus=false;
		this.customerProductsStatus=true;
	}

}
