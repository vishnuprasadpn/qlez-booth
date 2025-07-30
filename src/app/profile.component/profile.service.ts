import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class ProfileService {

	constructor(private appService: AppDataShareService) {}

	getCustomerDetails(){
		return this.appService.customer;
	}

	sendSessionData(){
		this.appService.sendSessionData();
	}

	setProfileChange(customer){
		this.appService.setCustomerUpdate(customer);
	}

	getNotificationsCount(){
		return this.appService.totalCustomerNotificationsCount;
	}
	
}