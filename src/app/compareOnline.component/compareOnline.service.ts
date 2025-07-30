import {Injectable} from "@angular/core";

import {Http,Headers,Response} from "@angular/http";

import {Observable} from 'rxjs/observable';

import 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class OnlineCompareService {

	constructor(private appService: AppDataShareService) {}

	getCurrentProduct(){

		return this.appService.productViewItem;
	
	}

	getAmazonProduct(){

		return this.appService.amzOnlineCompare;
	
	}

}