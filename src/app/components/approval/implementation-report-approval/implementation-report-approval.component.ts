import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-implementation-report-approval',
  templateUrl: './implementation-report-approval.component.html',
  styleUrl: './implementation-report-approval.component.scss'
})
export class ImplementationReportApprovalComponent {

  dataString:any;

  constructor(private router:Router){}

  ngOnInit(){
    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
    }else{
      this.router.navigate(['/login']);
    }
  }
}
