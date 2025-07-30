import { Component,OnInit } from '@angular/core';
import { ForgotIDService } from './ForgotID.service';
import { RouterModule, Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'forgot-id',
  templateUrl: './ForgotID.component.html',
  styleUrls: ['./ForgotID.component.css']
})

export class ForgotIDComponent implements OnInit {
  	
    timedOut = false;
  	timeout:any;timer:any;i:any;lastPing:any;
  	idleState="";subscription:any;flagStatus:any;
    NoCustIDFound:any;customer:any;
  	
    constructor(private forgotIDService:ForgotIDService,private router:Router,private idle: Idle, private keepalive: Keepalive){
  	  	this.flagStatus=this.NoCustIDFound=true;
  		  this.startTimeOut(15);
  	}

  	ngOnInit(){
  		this.timeout=0;
    	document.getElementById("header").style.visibility = "hidden";
    }

  	ngDoCheck(){
  		this.customer = this.forgotIDService.getCustomer();
  		
      if(this.customer!=null && this.customer !=undefined){
  			this.subscription.unsubscribe();
        this.reset();
        this.router.navigate(['/loading']);
  		}
  		var status = this.forgotIDService.getSearchStatus();
      
      if(status==true && this.flagStatus==true){
  			this.customer = this.forgotIDService.getCustomer();
        document.getElementById("loaderDiv").style.display = "none";
  			document.getElementById("customerNotFoundMessage").style.display="block";
  			this.startTimeOut(15);
  			this.flagStatus=false;
  		}
  	}

  	startTimeOut(value){
  		this.idle.setIdle(value);
	    this.idle.setTimeout(value-5);
	    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

	    this.idle.onIdleEnd.subscribe(() => this.idleState = '');
	    this.idle.onTimeout.subscribe(() => {
	      this.idleState = 'Sorry You Have Been Timed out!';
	      if(this.customer==null || this.customer ==undefined){
          this.router.navigate(['/welcome']);
	      }
        this.timedOut = true;
	    });
	    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
	    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
	   
    	this.reset();
  	}

   	reset() {
    	this.idle.watch();
    	this.idleState = '';
    	this.timedOut = false;
  	}

  	openForgotIDOverlay(){
        this.NoCustIDFound=false;
		}

  	closeMessage(){
  		if(document.getElementById("errorMessage").style.display=="block"){
  			document.getElementById("errorMessage").style.display="none";
  		}
  		if(document.getElementById("customerNotFoundMessage").style.display=="block"){
  			document.getElementById("customerNotFoundMessage").style.display="none";
  		}
  	}

  	loginCustomer(contact,password){
  		if(contact.value!="" && password!=""){
  			document.getElementById("errorMessage").style.display="none";

	  		if(contact.value < 9999999999 && contact.value > 1000000000){
				  document.getElementById("contactError").style.display = "none";
				  document.getElementById("loaderDiv").style.display = "block";
				  this.forgotIDService.getCustomerByDetails(contact.value,password.value);
				  this.timer = Observable.timer(2000,1000);
	  		  this.subscription = this.timer.subscribe(this.check);
			  }
			  else{
				  document.getElementById("contactError").style.display = "block";
			  }
	  	}
	  	else{
	  		document.getElementById("errorMessage").style.display="block";	
	  	}
  	}

    backToWelcome(){
      this.router.navigate(['/welcome']);
    }

  	check(){}

}
