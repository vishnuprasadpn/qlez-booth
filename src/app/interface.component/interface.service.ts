import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class InterfaceService {

	constructor(private appService: AppDataShareService) {}

	getSwitchcase(){
		return this.appService.switchcase;
	}

	setNextPage(nextpage){
		this.appService.nextPage=nextpage;
	}

	getNextPage(){		
		return this.appService.nextPage;
	}

	setSwitchCase(){
		this.appService.switchcase='';	
	}

}