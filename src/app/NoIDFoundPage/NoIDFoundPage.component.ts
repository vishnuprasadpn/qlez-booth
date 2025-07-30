import { Component,OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'no-product',
  templateUrl: './NoIDFoundPage.component.html',
  styleUrls: ['./NoIDFoundPage.component.css']
})

export class NoIDFoundComponent implements OnInit {
  
  constructor(private router: Router){
  	setTimeout(() => {
		  this.router.navigate(['/welcome']);
	  }, 4000);
  }
  
  ngOnInit(){
  	document.getElementById("header").style.visibility = "hidden";
  }

}