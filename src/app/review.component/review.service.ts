import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class ReviewService {

	constructor(private appService: AppDataShareService) {}

	getCustomerToBeReviewedItems(){

		return this.appService.reviews;

	}

	setReviewedProduct(reviewedProduct){

		this.appService.setReviewedProduct(reviewedProduct);

	}

}