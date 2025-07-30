import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class ForgotIDService {

	constructor(private appService: AppDataShareService) {}

	getCustomerByDetails(contact,pass){
		this.appService.getCustomerByDetails(contact,pass);
	}

	getCustomer(){
		return this.appService.readCustDt.cust;
	}

	getSearchStatus(){
		return this.appService.customerManualSearchStatus;
	}
}