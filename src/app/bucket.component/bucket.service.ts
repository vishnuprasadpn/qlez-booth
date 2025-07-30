import {Injectable} from "@angular/core";
import {Http,Headers,Response} from "@angular/http";
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppDataShareService } from '../app.shareData';

@Injectable()
export class BucketService {

	constructor(private appService: AppDataShareService) {}

	getProductsDetails(){
		return this.appService.bucketProductsThumb;
	}

	setSelectedProduct(product){
		this.appService.setProductViewItemfrmBucket(product);
	}

	setNextpage(newNextPage){
		this.appService.nextPage = newNextPage;
	}

}