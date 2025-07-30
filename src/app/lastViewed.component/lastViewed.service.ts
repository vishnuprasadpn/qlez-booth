import {Injectable} from "@angular/core";

import {Http,Headers,Response} from "@angular/http";

import {Observable} from 'rxjs/observable';

import 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class LastViewedService {

	constructor(private appService: AppDataShareService) {}

	getLastViewedProducts(){

		return this.appService.lastViewedProductsThumb;

	}

	setViewProduct(product){

		this.appService.setProductViewItemFrmLast(product);

	}

	setNextpage(newNextPage){

		this.appService.nextPage = newNextPage;

	}

}