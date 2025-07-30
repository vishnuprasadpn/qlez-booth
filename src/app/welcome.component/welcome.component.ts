import { Component,OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})


export class WelcomeComponent{

  	constructor(private welcomeService: WelcomeService,private router: Router){
      document.getElementById("header").style.visibility = "hidden";
      this.welcomeService.startApplicationBackend();
    }

  	//When user clicks on thumbs-up button to login
  	loginFunction(){
      document.getElementById("welcomeLoader").style.display="block";
     
      var status = this.welcomeService.getLoginData();
      //this.router.navigate(['/notifications']);
      this.router.navigate(['/loading']);

      
  		/*if(data.customerName=="" || data.customerName == null){
			  this.router.navigate(['/phoneRegister']);
		  }
      else{
			this.router.navigate(['/notifications']);
		  }*/
  
  	}

}
