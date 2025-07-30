import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class ProductViewService {

	constructor(private appService: AppDataShareService) {}

	getProductDetails(){		
		return this.appService.productViewItem;
	}

	setColorForProduct(color){
		this.appService.setColorForProduct(color);
	}

	setImageNumber(imageNo){
		this.appService.setImageNumber(imageNo);
	}

	getImageNumber(){
		return this.appService.imageNumber;
	}

	getFavStatus(){
		return this.appService.favSet;
	}

	setFavStatus(status){
		this.appService.setFavSet(status);	
	}

	setAsFavoriteProduct(favoriteStatus){
		this.appService.setMyFavoriteProductsfromView(favoriteStatus);
	}

	setNextPage(nextpage){
		this.appService.nextPage = nextpage;
	}

	getNextPage(){
		return this.appService.nextPage;
	}

	switchCases(switchCase){
		this.appService.switchcase = switchCase;
	}

	setasLastViewed(color,itemcode){
		this.appService.addAsLastViewed(color,itemcode);		
	}

	getGeneralOffers(){
		return this.appService.generalOffers;
	}

	getCustomerDetails(){
		return this.appService.customer;
	}

	getInstoreProductCount(){
		return this.appService.allInstoreCompareProductsData.length;
	}

	getSimilarProduct(group,category,subcategory){
		this.appService.getSimilarProducts(group,category,subcategory);
	}
}