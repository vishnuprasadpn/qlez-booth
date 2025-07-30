import {Component, OnInit,Pipe,PipeTransform,ElementRef,ViewChildren,Input} from '@angular/core';
import { Router} from '@angular/router';
import { Http } from '@angular/http';
import { ProfileService } from './profile.service';

@Component({
    selector: 'profile',
    templateUrl:'./profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers:[ProfileService] 
})

export class ProfileComponent implements OnInit{

	customer:{};
	contactFlag:boolean;
	emailFlag:boolean;
	addressFlag:boolean;
	totalPendingNotifications:number;
	totalPendingNotificationsVisibility: boolean;

	constructor(private profileService: ProfileService,private router: Router){}

	ngOnInit(){
		document.getElementById("contactErrorMessage").style.display = "none";
		document.getElementById("emailErrorMessage").style.display = "none";	
		document.getElementById("addressErrorMessage").style.display = "none";	
		this.contactFlag= true;
		this.emailFlag = true;
		this.addressFlag = true;
		this.customer =this.profileService.getCustomerDetails();
		this.totalPendingNotifications = this.profileService.getNotificationsCount();
	}

	ngAfterViewInit(){
		if(this.totalPendingNotifications == undefined ||this.totalPendingNotifications == 0){
			this.totalPendingNotificationsVisibility = false;
		}
	}


	changeEmail(mail,confirm,edit){
		this.verifyEmail(mail);
		if(this.emailFlag == true){
			this.customer[0]["customerEmail"]=mail.value;
			this.profileService.setProfileChange(this.customer);
			mail.disabled = true;
			mail.setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
			confirm.setAttribute("style","display:none;font-size:25px");
			edit.setAttribute("style","display:block;font-size:25px");
		}
	}

	editEmail(mail,edit,confirm){
		mail.disabled= false;
		mail.setAttribute("style","background:green;color:#fff;font-size:18px");
		confirm.setAttribute("style","display:block;font-size:25px");
		edit.setAttribute("style","display:none;font-size:25px");
	}

	verifyEmail(email){
		var emailA= email.value;
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailA))  
		{  	
			this.emailFlag = true;
			document.getElementById("emailErrorMessage").style.display = "none";		
			document.getElementById(email.id).style.border = "none";
		}
		else{
			this.emailFlag = false;
			document.getElementById(email.id).style.border = "2px solid red";
			document.getElementById("emailErrorMessage").style.display = "block";
		}
	}

	verifyContact(contact){
		var contactN =parseInt(contact.value); 
		if(contactN>9999999999 || contact.value == ""){
			document.getElementById(contact.id).style.border = "2px solid red";
			document.getElementById("contactErrorMessage").style.display = "block";
			this.contactFlag = false;
		}
		else if(contactN<1000000000){
			document.getElementById(contact.id).style.border = "2px solid red";
			document.getElementById("contactErrorMessage").style.display = "block";
			this.contactFlag = false;
		}
		else{
			document.getElementById(contact.id).style.border = "none";
			document.getElementById("contactErrorMessage").style.display = "none";
			this.contactFlag = true;
		}
	}

	changeContact(contact,confirm,edit){
		this.verifyContact(contact);
		if(this.contactFlag == true){
			this.customer[0]["customerContact"]=contact.value;
			this.profileService.setProfileChange(this.customer);
			contact.disabled= true;
			contact.setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
			confirm.setAttribute("style","display:none;font-size:25px");
			edit.setAttribute("style","display:block;font-size:25px");
		}
	}

	editContact(contact,edit,confirm){
		contact.disabled= false;
		contact.setAttribute("style","background:green;color:#fff;font-size:18px");
		confirm.setAttribute("style","display:block;font-size:25px");
		edit.setAttribute("style","display:none;font-size:25px");
	}

	verifyAddresss(address){
		if(address.value == ""){
			this.addressFlag = false;
			document.getElementById(address.id).style.border = "2px solid red";
			document.getElementById("addressErrorMessage").style.display = "block";
		}
		else{
			this.addressFlag = true;
			document.getElementById(address.id).style.border = "none";
			document.getElementById("addressErrorMessage").style.display = "none";
		}
	}

	
	changeAddress(address,confirm,edit){
		this.verifyAddresss(address);
		if(this.addressFlag == true){
			this.customer[0]["customerAddress"]=address.value;
			this.profileService.setProfileChange(this.customer);
			address.disabled= true;
			address.setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
			confirm.setAttribute("style","display:none;font-size:25px");
			edit.setAttribute("style","display:block;padding:7px;font-size:25px");
		}
	}

	editAddress(address,edit,confirm){
		address.disabled= false;
		address.setAttribute("style","background:green;color:#fff;font-size:18px");
		confirm.setAttribute("style","display:block;font-size:25px");
		edit.setAttribute("style","display:none;font-size:25px");
	}

	showProfile(){
		if(document.getElementById("myProfile").style.display == "block") {
			document.getElementById("myProfile").style.display = "none";
			document.getElementById("profileSection").style.background = "none";
			document.getElementById("disp").style.bottom = "auto";
		}
		else{
			document.getElementById("myProfile").style.display = "block";
			document.getElementById("profileSection").style.background = "#C93756";
			document.getElementById("disp").style.bottom = "0";
		}
	}

	logout(){
		this.profileService.sendSessionData();
		this.router.navigate(['/thankyou']);
	}

	closeEdit(){
		//console.log("close edits");
		if(document.getElementById("emailInput").style.background=="green"){
			document.getElementById("emailInput").setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
		}

		if(document.getElementById("contactInput").style.background=="green"){
			document.getElementById("contactInput").setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
		}

		if(document.getElementById("customerAddressInput").style.background=="green"){
			document.getElementById("customerAddressInput").setAttribute("style","background:none;color:#fff;border:none;font-size:18px");
		}
	}
}