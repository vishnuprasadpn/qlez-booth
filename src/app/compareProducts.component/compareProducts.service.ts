import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class CompareProductService {

	constructor(private appService: AppDataShareService) {}

	getProductsToCompare(){
		return this.appService.comparingProducts;
	}

	setViewProduct(product){
		this.appService.setProductViewItemFrmCompare(product);
	}

	setFavoriteProducts(productList){
		this.appService.setMyFavoriteProductsfromCompare(productList);
	}

	setNextpage(newNextPage){
		this.appService.nextPage = newNextPage;
	}

}