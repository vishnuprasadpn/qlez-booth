import { Component,OnInit } from '@angular/core';
import { HeaderComponent } from './header.component/header.component';
import { FooterComponent } from './footer.component/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  
  constructor(){}
  
  ngOnInit(){
  
  	document.getElementById("header").style.visibility = "hidden";
  
  }

}
