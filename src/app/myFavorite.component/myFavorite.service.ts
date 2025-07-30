import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class MyFavoriteService {

	constructor(private appService: AppDataShareService) {}

	getMyFavoriteProducts(){
		return this.appService.favoriteProductsThumb;
	}

	setViewProduct(product){
		this.appService.setProductViewItemFrmFavorite(product);
	}

	setNextpage(newNextPage){
		this.appService.nextPage = newNextPage;
	}

}