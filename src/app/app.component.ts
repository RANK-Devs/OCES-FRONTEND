import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'client';
  routeData: any;
  
  current_menu: any;
  isLoggedIn: any;
  isPrint:any;

  constructor(private router:Router, private activatedRoute: ActivatedRoute){
    
  }


  ngOnInit(){
  
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.routeData = this.activatedRoute.firstChild?.snapshot.data;
      this.current_menu = this.routeData.title;
      
      if(this.current_menu == "Login" || this.current_menu == "ForgetPassword"){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }

      if(this.current_menu == "Print Document"){
        this.isPrint = true;
      }else{
        this.isPrint = false;
      }
      
    })

    

  

    
  
   
  }


  
}
