import {Component} from '@angular/core';
import { Http } from '@angular/http';
import { HeaderService } from './header.service';

@Component({
    selector: 'header',
    templateUrl:'./header.component.html',
    styleUrls: ['./header.component.css'],
    providers:[] 
})

export class HeaderComponent{
	
	constructor(private headerService:HeaderService){}

	settings(){
		document.getElementById("navbarID").style.zIndex = "-9999999";
	}

	openHelp(){
		if(document.getElementById("userMenu").style.display=="block"){
			document.getElementById("userMenu").style.display="none";
		}
		else{
			document.getElementById("userMenu").style.display="block";
		}
	}

	showFAQs(){
		document.getElementById("userMenu").style.display="none";
		document.getElementById("FAQContainer").style.height="100%";
	}

	closeFAQ(){
		document.getElementById("FAQContainer").style.height="0%";	
	}

	needAssistance(){
		document.getElementById("userMenu").style.display="none";	
	}

	getAssistance(){
		//this.headerService.getAssistance();
		document.getElementById("userMenu").style.display="none";
		document.getElementById("AssistanceMessage").style.height="100%";
	}

	closeAssistance(){
		document.getElementById("AssistanceMessage").style.height="0%";	
	}
	
}