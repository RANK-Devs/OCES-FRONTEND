

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { roleConstant } from '../../constant/roleConstant';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {

  current_url: string = "";
  menu: any = [];
  filterMenu: any;
  filterMenuJson: any;
  role: string = '';
  jsonString: any;

  sidePanelVisible:boolean = true;

  constructor(private authService: AuthService, private router:Router) {
    this.menu = roleConstant.menus;
  }

  ngOnInit() {
    
    
    this.filterMenu = this.menu;

    this.jsonString = localStorage.getItem('localData');
    
    if(this.jsonString){

      const jsonData = JSON.parse(this.jsonString);

      const loggedInRole = jsonData.role;

  
       
      this.filterMenu = this.menu.filter((item:any) => {
        return item.role.includes(loggedInRole);
      })

  
    }else{
      this.router.navigate(['/login']);
    }
  
  } // localStorage if isset

  sidenavIsActive(sidenavUrl: string): boolean {

    let sidenavActive = false;

    if(this.router.url === "/"+sidenavUrl){
      sidenavActive = true;
    }

    return sidenavActive;

  }

  sidePanelToggle(){
    
    this.sidePanelVisible = !this.sidePanelVisible;

  } //
 

  onLogout() {
    localStorage.removeItem('localData'); // or localData
  }
}
