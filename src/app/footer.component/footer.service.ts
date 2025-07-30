import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class FooterService {

	constructor(private appService: AppDataShareService) {}

	getCustomerDetails(){

		return this.appService.customer;

	}
	
	getBucketProductCount(){

		return this.appService.bucketProductsCount;

	}

	getPendingReviewProductCount(){

		return this.appService.pendingReviewsCount;

	}

	getCustomerProducts(){
		return this.appService.customerProductsStatus;
	}

}