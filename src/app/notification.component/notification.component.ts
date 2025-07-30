import { Component,OnInit } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'notification-page',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  providers:[NotificationService]
})


export class NotificationComponent implements OnInit{

    generalOffers:any;
  	constructor(private notificationService:NotificationService){}

  	ngOnInit(){
      //Fetching General Offers in the store
      this.generalOffers =this.notificationService.getAllGeneralOffers();
    }

    ngAfterViewInit(){ 
    	//Setting visibility of header
    	document.getElementById("header").style.visibility = "visible";
      document.getElementById("myReview").style.display = "none";
    }

    //Toggles Notification List Options
  	openSection(blockName){
  		if(blockName == "reviewsBlock"){  		
      	if(document.getElementById(blockName).style.display == "none") {
      		document.getElementById(blockName).style.display = "block";
      		document.getElementById("offersBlock").style.display = "none";
      	}
    		else{
      		document.getElementById(blockName).style.display = "none";	
  		  }
    	}
  		else if(blockName == "offersBlock"){
    		if(document.getElementById(blockName).style.display == "block"){ 		
     		  document.getElementById(blockName).style.display = "none";
    		}
    		else{
    			document.getElementById(blockName).style.display = "block";
    			document.getElementById("reviewsBlock").style.display = "none";	
    		}
    	}
    }

    openBucket(){
      document.getElementById("myBucket").style.height="100%";
    }
}