import { Component,OnInit,ElementRef,ViewChildren,
	Input,EventEmitter,SimpleChange,ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { ProductViewService } from './productView.service';
declare var jQuery:any;

@Component({
    selector: 'product-view',
    templateUrl:'./productView.component.html',
    styleUrls: ['./productView.component.css'],
    host: {'(scroll)': 'track($event)'},
    providers:[ProductViewService] 
})


export class ProductViewComponent implements OnInit{
	@ViewChildren('productColor') allColors;
	@ViewChildren('pdtSize') productSizes;
	@ViewChildren('cStar') customersStars;
	@ViewChild('mainImg') productMImage;
	@ViewChildren('star') allStars;
	
	@ViewChildren('Star5') stars5;@ViewChildren('Star4') stars4;
	@ViewChildren('Star3') stars3;@ViewChildren('Star2') stars2;@ViewChildren('Star1') stars1;
	
	noReview:boolean;
	
	//For Display Status of Product stars
	displayStars:boolean;
	
	//Details of Product Stored
	product:{};
	
	//order-by variable 
	Otype:string;Oby:boolean;
	
	//For Storing Description and other features 
	viewProductDetails:[{}];
	
	//Product Average Star
	productAverageStar:number;

	allReviews:boolean;	positiveReviews:boolean;negativeReviews:boolean;	
	
	//Prime Image Variable
	productPrimeImage = new Array();
	
	//Stores Product Colors AVailable for the product
	colors:string[];
	
	//Calculate Percentage Off in real-time
	percentageOff:number;
	
	//Total number stars in the view
	stars = [1,2,3,4,5];

	//To store star counts
	star5Count: number;star4Count: number;star3Count: number;star2Count: number;star1Count: number;

	//Stores Product Sizes Available
	sizesAvailable:string[];
	
	//Stores Product Count
	productCount:number;
	
	//Stores Selected Size 
	productSizeSelected:string;
	
	//Number of reviews for the product
	productReviews:string;
	
	//For selecting image number for image switching
	imageNo:number;
	
	//Array of all Specification Main Headings and Sub-Headings
	MainHeadings:string[];
	SubHeadings = new Array();
	
	//For setting status of the product when favorite
	favStatus:boolean;
	
	//For star box toggle
	starBoxStatus:string;
	generalOffers:any;
	
	customer:any;
	clothSizeChartStatus:boolean;shoeSizeChartStatus:boolean;
	
	constructor(private productViewService : ProductViewService,private eleRef: ElementRef,private router:Router){}

	ngOnInit(){
		this.clothSizeChartStatus=this.shoeSizeChartStatus=true;
		this.noReview =false;
		this.allReviews = true;
		this.positiveReviews = false;
		this.negativeReviews =false;	
		this.starBoxStatus ="doNotShowBox";
		this.displayStars = false;
		this.viewProductDetails =[ { main: "Main Heading",sub:[{subname:"Sub Heading",subValue:"Value"}]} ];
		this.favStatus = this.productViewService.getFavStatus();
		this.product = this.productViewService.getProductDetails();
		this.customer = this.productViewService.getCustomerDetails();
		console.log("view product");
		console.log(this.product);
		if(this.product["starCount"]!=null){
			this.star5Count = this.product["starCount"]["5"];
			this.star4Count = this.product["starCount"]["4"];
			this.star3Count = this.product["starCount"]["3"];
			this.star2Count = this.product["starCount"]["2"];
			this.star1Count = this.product["starCount"]["1"];
		}
		if(this.product["item"]["item_category"]=='Shoes'){
			this.clothSizeChartStatus=false;
			this.shoeSizeChartStatus=true;
		}
		else{
			this.clothSizeChartStatus=true;
			this.shoeSizeChartStatus=false;			
		}
		//Fetching Image to display as main
		this.imageNo = this.productViewService.getImageNumber();
		this.generalOffers = this.productViewService.getGeneralOffers();

		//Getting Keys colors of the product 
		this.colors = Object.keys(this.product["item"]["item_imagelinks"]);

		var color;
		if(this.product["color"]!=null){
			color = this.product["color"];
		}
		else{
			color = this.colors[0];
		}
		
		var itemcode = this.product["item"]["item_code"];
		
		this.productViewService.setasLastViewed(color,itemcode);
		
		//Setting as favorite if user had already made it favorite
		if(this.favStatus == true){
			document.getElementById("favoriteIcon").style.color = "red";
		} 
		if(this.product["productReviewers"][0] != null && this.product["productReviewers"][0]["reviewComment"] !="null"){
			this.productReviews = this.product["productReviewers"].length.toString();
			this.displayStars = true;
		}
		else{
			this.productReviews = "No";
		}
		
		//Getting Key Sizes of the product
		if(this.product["sizeCount"]!= null){	
			this.sizesAvailable = Object.keys(this.product["sizeCount"]);
			this.productSizes = this.sizesAvailable;	
		}

		var imageurl;var colorForImage;
		if(this.product["color"]!=null){
			var selectedColor = this.product["color"].toLocaleLowerCase();
			var colorOfArray,SelectColor;
			for(var c=0;c<this.colors.length;c++){
				colorOfArray = this.colors[c].toLocaleLowerCase();
				if(colorOfArray == selectedColor){
					SelectColor = this.colors[c];
				}
			}
		}
		else{
			SelectColor= this.colors[0];
		}
		//Setting Prime or Main Image
		if(this.product["item"]["item_imagelinks"][SelectColor]==null || this.product["item"]["item_imagelinks"][SelectColor] == undefined){
			this.productPrimeImage[0]="http://3nity.com.my/wp-content/themes/3Nity/assets/img/no-product-image.png";
		}
		else{
			for(var img =0;img<this.product["item"]["item_imagelinks"][SelectColor].length;img++){
				var immgLink =this.product["item"]["item_imagelinks"][SelectColor][img];
				if(immgLink.match(/\.(jpeg|jpg|gif|png|JPG)$/) == null){
					this.productPrimeImage[img] ="https://usstore.biohorizons.com/content/images/thumbs/default-image_450.png";		
				}
				else{
					this.productPrimeImage[img] = this.product["item"]["item_imagelinks"][SelectColor][img]
				}
			}
		}

		if(this.imageNo == null || this.imageNo == undefined){
			this.imageNo = 0;
		}

		this.productMImage.nativeElement.setAttribute("src",this.productPrimeImage[this.imageNo]);
		
		//Getting and setting Main Heading and Sub Heading of Descriptions
		this.MainHeadings = Object.keys(this.product["item"]["item_desc"]);
		for(var i=0;i<this.MainHeadings.length;i++){
			this.SubHeadings[i] =Object.keys(this.product["item"]["item_desc"][this.MainHeadings[i]]);
			this.viewProductDetails[i]={main: this.MainHeadings[i],sub:[]};
			for(var j=0;j<this.SubHeadings[i].length;j++){
				this.viewProductDetails[i]["sub"][j] ={ 
					subname:this.SubHeadings[i][j],
					subValue:this.product["item"]["item_desc"][this.MainHeadings[i]][this.SubHeadings[i][j]]
				};	
			}								
		}
	}

	ngAfterViewInit() {

		//Setting Colors available for the product
		var i = 0; // to loop through every color of product json
		


		this.allColors.toArray().find((e) => {
			e.nativeElement.setAttribute("style","background:"+this.colors[i].toLowerCase());
			i++;	
		});

		//Setting Percentage for product
		var percent =100-(this.product["item"]["item_sp"]/this.product["item"]["item_mrp"])*100;
		this.percentageOff = parseInt(""+percent);
			
		//Enabling Pinch Zoom in Prime Image
		jQuery(this.eleRef.nativeElement).find('.pannable-image').ImageViewer();

		//Setting Selected Size and Count
		if(this.product["sizeCount"]!=null){
			this.productSizeSelected =this.product["sizeSelected"];	

			this.productCount = this.product["sizeCount"][this.productSizeSelected];		
			var selectorOffset= document.getElementById("sizeSelector").style.display = "none";
			this.productSizes.toArray().find((e) => {
				e.nativeElement.setAttribute("style","cursor:default");
				if(this.productSizeSelected ==e.nativeElement.innerHTML) {
					e.nativeElement.setAttribute("style","background:green;color:#fff;");
					var eleoffSetLeft = e.nativeElement.offsetLeft;
				}
			});
		}
		else{
			this.productCount=0;
		}

		//Calculating Average Star for product
		var starcount,sum;
		var totcount=0,totSum=0;
		this.productAverageStar= 0;
		var starsArray=[];	
		
		if(this.product["starCount"] != null){
			starsArray= Object.keys(this.product["starCount"]);
			sum=0;
			this.productAverageStar= 0;
			for(var j=0;j<starsArray.length;j++){
				starcount = this.product["starCount"][starsArray[j]];
				sum = starsArray[j] * starcount +sum;
				totcount = totcount + starcount;
			}
			this.productAverageStar = Math.round(sum / totcount);
		}
			
		//Setting Total Star for the product
		if(this.productAverageStar != NaN && this.productAverageStar != undefined){
			this.allStars.toArray().find((e) => {		
				if(e.nativeElement.id <=this.productAverageStar){
					e.nativeElement.setAttribute("style","color: yellow;");
				}
			});	
		}
		
		//Setting Total Star for the product
		this.stars5.toArray().find((e) => {
			if(e.nativeElement.id <=5){
				e.nativeElement.setAttribute("style","color: yellow;");
			}
		});
		
		this.stars4.toArray().find((e) => {
			if(e.nativeElement.id <=4){
				e.nativeElement.setAttribute("style","color: yellow;");
			}
		});
		
		this.stars3.toArray().find((e) => {
			if(e.nativeElement.id <=3){
				e.nativeElement.setAttribute("style","color: yellow;");
			}
		});
		
		this.stars2.toArray().find((e) => {
			if(e.nativeElement.id <=2){
				e.nativeElement.setAttribute("style","color: yellow;");
			}
		});
		
		this.stars1.toArray().find((e) => {
			if(e.nativeElement.id <=1){
				e.nativeElement.setAttribute("style","color: yellow;");
			}
		});

		var reviewCount = 0;
		if(this.product["productReviewers"][0]!=null){
			//Setting Reviews Components
			for(var i=0;i<this.product["productReviewers"].length;i++){
				var date = new Date(this.product["productReviewers"][i]["timeStamp"].toString().slice(0, 15));
				this.product["productReviewers"][i]["timeStamp"] = date;
				if(this.product["productReviewers"][i].reviewComment == 'null'){
					reviewCount = reviewCount + 1;
				}
				if(reviewCount == this.product["productReviewers"].length){
					this.noReview = true;
				}
		
				this.customersStars.toArray().find((e) => {	
					var rem = ""+e.nativeElement.id %10;
					var custNo =  parseInt("" + e.nativeElement.id /10);
					if(""+i==""+custNo){
						if(rem<=this.product["productReviewers"][i].reviewRating){
							e.nativeElement.setAttribute("style","color: yellow;");
						}	
					}	
				});				
			}
			for(var i=0;i<this.product["productReviewers"].length;i++){
				this.product["productReviewers"][i]["reviewRating"]	= parseInt(this.product["productReviewers"][i]["reviewRating"]);		
			}
		}
		document.getElementById('latestReviews').style.background="#909090";
		document.getElementById('negativeReviews').style.background="#fff";	
		document.getElementById('positiveReviews').style.background="#fff";
	}

	compareInstore(){
		this.productViewService.setNextPage('compare-instore-selector');
		var group,category,subcategory;
		group=this.product["item"]["item_group"];
		category=this.product["item"]["item_category"];
		subcategory=this.product["item"]["item_subcategory"] ;	
		this.productViewService.getSimilarProduct(group,category,subcategory);
		this.router.navigate(['/loading']);
	}

	compareOnline(){
		//this.productViewService.setNextPage("compare_online");
		//this.router.navigate(['/loading']);
	}

	selectSize(size,selector){
		this.productSizes.toArray().find((e) => {
			if(e.nativeElement.id ==size.id){
				e.nativeElement.setAttribute("style","background:green!important;color:#fff;");
				this.productCount = this.product["sizeCount"][size.innerHTML];
				//Setting Selector on the selected Item
				var distance = e.nativeElement.offsetLeft+20;
				//selector.setAttribute("style","position:absolute;left:"+distance+"px;top:150px;");
			}
			else{
				e.nativeElement.setAttribute("style","background:#fff;color:#000;");
			}
		});
	}

	//On color Select
	colorChange(color){
		this.productViewService.setFavStatus(this.favStatus);
		this.productViewService.setColorForProduct(color.id);
		this.productViewService.switchCases("product-view-switch");
		this.router.navigate(['/interface']);
	}

	changeImage(image){
		this.productViewService.setFavStatus(this.favStatus);
		this.productViewService.setImageNumber(image.id);
		this.productViewService.switchCases("product-view-switch");
		this.router.navigate(['/interface']);
	}

	addToFavorites(icon,product){
		if(document.getElementById(icon.id).style.color == "red"){
			document.getElementById(icon.id).style.color ="#222222";
			this.favStatus = false;		
		}
		else{
			this.favStatus = true;
			document.getElementById(icon.id).style.color ="red";
		}
		this.productViewService.setAsFavoriteProduct(this.favStatus);
	}

	starTableDropdown(id){
		this.starBoxStatus;
		if(this.starBoxStatus == "doNotShowBox"){
			document.getElementById("starBox").setAttribute("style","display : block");	
			this.starBoxStatus = "showBox";
		}
		else if(this.starBoxStatus == "showBox"){
			document.getElementById("starBox").setAttribute("style","display : none");	
			this.starBoxStatus = "doNotShowBox";
		}
	}

	reviewSort(status){
		if(status == 'date'){
			document.getElementById('latestReviews').style.background="#909090";
			document.getElementById('negativeReviews').style.background="#fff";	
			document.getElementById('positiveReviews').style.background="#fff";
			this.Otype = 'timeStamp'
			this.Oby =false;
		}
		else{
			this.Otype = 'reviewRating';
			if (status ==true){
				document.getElementById('negativeReviews').style.background="#909090";		
				document.getElementById('latestReviews').style.background="#fff";	
				document.getElementById('positiveReviews').style.background="#fff";
				this.Oby = true;
			}
			else{
				document.getElementById('positiveReviews').style.background="#909090";
				document.getElementById('latestReviews').style.background="#fff";	
				document.getElementById('negativeReviews').style.background="#fff";
				this.Oby = false;	
			}	
		}
	}
}	