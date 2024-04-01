import { Component, ViewChild } from '@angular/core';
import { InputService } from '../../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {


  dataString:any;
  userId:string = "";
  roleName: string = "";

  fullName: string = "";
  email: string = "";
  phone: string = "";
  department: string = "";
  tenure: string = "";
  profileImage: string = "";

  createdAt: string = "";
  updatedAt: string = "";


  auditTrailForm!:any;
  allUsers!:any;
  userAccountDetails!:any;

  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router
  ) {}

   

  ngOnInit(){

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
    }else{
      this.router.navigate(['/login']);
    }

    this.getAllUsers();

  }

  getAllUsers(){

    this.inputService.getUserAccounts(this.router.url).subscribe((data)=>{

      this.allUsers = data;
      
      this.userAccountDetails = this.allUsers.filter((item:any)=>{

        return item._id.includes(this.userId);

      });

      this.fullName = this.userAccountDetails[0].fname+" "+this.userAccountDetails[0].mname+" "+this.userAccountDetails[0].lname;
      this.fullName = this.fullName.toUpperCase();

      this.email = this.userAccountDetails[0].email;
      this.createdAt = this.userAccountDetails[0].createdAt;
      this.updatedAt = this.userAccountDetails[0].updatedAt;
      this.tenure = this.userAccountDetails[0].tenure;
      this.profileImage = this.userAccountDetails[0].profileImage;
      this.department = this.userAccountDetails[0].department;

    });
 
  } // getUserDetails


  initializeAuditTrail(actionTaken:string) : void{
    
    this.auditTrailForm = this.fb.group({

      user_id: this.userId,     
      role: this.roleName,
      action_taken: actionTaken,
      action_date_time: new Date()      
    
    });

  } // initializeAuditTrail

  
  onRecordAuditTrailLogs(){

    this.inputService.createAuditTrailService(this.auditTrailForm.value).subscribe(
      (response) => {
        console.log('Data for Audit Trail Submitted Successfully:', response);      
      },
      (error) => {
        console.error('Error submitting form of Audit Trail:', error);
        // Handle error logic if needed
      }
    );

  } // onRecordAuditTrailLogs()
  
  saveAuditTrailLog(actionString:string):void{
    this.initializeAuditTrail(actionString);
    this.onRecordAuditTrailLogs();
  }
  

}
