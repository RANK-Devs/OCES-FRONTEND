import { Component } from '@angular/core';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-users-accounts',
  templateUrl: './users-accounts.component.html',
  styleUrl: './users-accounts.component.scss'
})
export class UsersAccountsComponent {
  dataString:any;

  constructor(private router:Router){

  }

  ngOnInit(){
    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
    }else{
      this.router.navigate(['/login']);
    }
  }
}
