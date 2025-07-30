import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { MyFavoriteService } from './myFavorite.service';

@Component({
    selector: 'my-favorite',
    templateUrl:'./myFavorite.component.html',
    styleUrls: ['./myFavorite.component.css'],
    providers:[MyFavoriteService] 
})

export class MyFavoriteComponent implements OnInit{
	@ViewChildren('pStar') pStars;
	myFavoriteProducts:[{}];
	//Number of Stars
	stars = [1,2,3,4,5];
	constructor(private myFavoriteService :MyFavoriteService,private router:Router){}

	ngOnInit(){
		this.myFavoriteProducts = this.myFavoriteService.getMyFavoriteProducts();
	}

	ngAfterViewChecked(){
		this.myFavoriteProducts = this.myFavoriteService.getMyFavoriteProducts();
		if(this.myFavoriteProducts.length>0){
			document.getElementById("noFavProductDiv").style.display="none";
			for(var i =0;i<this.myFavoriteProducts.length;i++){
				this.pStars.toArray().find((e) => {
					var rem = ""+e.nativeElement.id %10;
					var custNo =  parseInt("" + e.nativeElement.id /10);
					if(""+i==""+custNo){
						if(rem<=this.myFavoriteProducts[i]["productRating"]){
							e.nativeElement.setAttribute("style","color: yellow;");
						}	
					}	
				});
			}
		}
		else{
			document.getElementById("noFavProductDiv").style.display="block";
		}

   	}
   	
	viewProduct(product){
		this.myFavoriteService.setNextpage("product_view");
		this.myFavoriteService.setViewProduct(product);
		document.getElementById("myBucket").style.height="0%";
		this.router.navigate(['/interface']);
	}

}