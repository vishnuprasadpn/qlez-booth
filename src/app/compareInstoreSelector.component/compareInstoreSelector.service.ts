import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class CompareInstoreSelectorService {
	constructor(private appService: AppDataShareService) {}

	getComparingProduct(){
		return this.appService.productViewItem;
	}
	getCompareProducts(){
		return this.appService.compareInstoreProductsThumb;
	}

	setProductsToCompare(products){
		this.appService.setComparingProducts(products);
	}

	setNextPage(nextpage){
		this.appService.nextPage=nextpage;
		this.appService.sessionClosed=false;
	}

}