import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class LoadingService{

	constructor(private appService: AppDataShareService) {}
	
	getNextPage(){
		return this.appService.nextPage;
	}

	getContentStatus(){
		return this.appService.productcontentStatus;
	}

	nextPageReset(){
		this.appService.nextPage ="";
	}

	getcompareproductCount(){
		return this.appService.allInstoreCompareProductsData.length;
	}

	compareReviewState(){
		return this.appService.compareReviewsState;
	}

	setCompareReviewStateDefault(){
		this.appService.compareReviewsState=false;
	}

}