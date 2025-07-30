import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class HeaderService {

	constructor(private appService: AppDataShareService) {}

	getAssistance(){
		this.appService.getAssistance();
	}
}