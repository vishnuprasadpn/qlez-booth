import {Injectable} from "@angular/core";

import {Http,Headers,Response} from "@angular/http";

import {Observable} from 'rxjs/observable';

import 'rxjs/Rx';

import 'rxjs/add/operator/map';

import { AppDataShareService } from '../app.shareData';

@Injectable()
export class NotificationService {

	constructor(private appService: AppDataShareService) {}
	
	getAllGeneralOffers(){
		return this.appService.generalOffers;
	}
}