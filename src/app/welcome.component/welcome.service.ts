import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class WelcomeService {

	constructor(private appService: AppDataShareService) {}

	getLoginData(){
		this.appService.startReader()
	}

	startApplicationBackend(){
		this.appService.startApplication();
	}

	getBucketProducts(){
		return  this.appService.bucketProductsThumb;
	}

	getCustomerDetails(){
		this.appService.readCustDt;
	}
}