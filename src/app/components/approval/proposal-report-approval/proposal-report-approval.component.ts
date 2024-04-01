import { Component } from '@angular/core';
import{ Router } from '@angular/router';

@Component({
  selector: 'app-proposal-report-approval',
  templateUrl: './proposal-report-approval.component.html',
  styleUrl: './proposal-report-approval.component.scss'
})
export class ProposalReportApprovalComponent {

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
