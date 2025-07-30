import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { BucketService } from './bucket.service';

@Component({
    selector: 'bucket',
    templateUrl:'./bucket.component.html',
    styleUrls: ['./bucket.component.css'],
    providers:[BucketService] 
})

export class BucketComponent implements OnInit{
	myBucket:[{}];

	constructor(private bucketService: BucketService,private router :Router,private eleRef: ElementRef){}

	ngOnInit(){
		this.myBucket =this.bucketService.getProductsDetails();
	}

	selectedProduct(product){
		this.bucketService.setSelectedProduct(product);
		this.bucketService.setNextpage("product_view");
		document.getElementById("myBucket").style.height="0%";	
		this.router.navigate(['/loading']);
	}

}