import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'; 
import { InputService } from '../../../services/input.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrl: './audit-trail.component.scss'
})
export class AuditTrailComponent {

  userAccountForm!:any;
  filteredAccountForm!:any;
  auditTrailForm!:any;
  auditTrailAll!:any;
  audit_super_admin!:any;
  audit_employee!:any;
  audit_student!:any;

  constructor(private router: Router, private fb: FormBuilder,
    private inputService: InputService,private datePipe: DatePipe){

  }

  ngOnInit(){
    this.onLoadAllUsers();
    this.onClickAllRecords();
  }

  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  onClickAccountAdministration(){
    this.router.navigate(['/account-admin']);
  }

  onLoadAllUsers(){

   this.inputService.getUserAccounts(this.router.url).subscribe((data) => {
    this.userAccountForm = data;
   });

  }

  getUserAccountFullName(userId:string): string{

    let fname = "", mname = "", lname = "";
    let string_value = "";

    this.filteredAccountForm = this.userAccountForm.filter((item:any)=>{

      return item._id.includes(userId);

    });

    this.filteredAccountForm.forEach((item_each:any) => {

      lname = item_each.lname;
      mname = item_each.mname;
      fname = item_each.fname;

    });

    string_value = fname.toUpperCase()+" "+mname.toUpperCase()+" "+lname.toUpperCase(); 
    

    return string_value;

  }



  onClickAllRecords(){
    this.inputService
    .getAuditTrailService(this.router.url)
    .subscribe((data) => {
      this.auditTrailForm = data         
      
    });

    if(this.auditTrailForm){
      this.auditTrailAll = this.sortByDate(this.auditTrailForm,"action_date_time",true);
    }
    
   
  } // onClickAllRecords()

  getFormattedDate(stringDate:string): string {

    let formattedStringToDate: Date = new Date(stringDate);
    return this.datePipe.transform(formattedStringToDate,'MMM-dd-yyyy') || '';

  }

  getFormattedTime(stringDate:string): string {

    let formattedStringToDate: Date = new Date(stringDate);
    return this.datePipe.transform(formattedStringToDate,'HH:mm:ss') || '';

  }

}
