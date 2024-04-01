import { Component, ElementRef, Renderer2 } from '@angular/core';
import { InputService } from '../../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'; 
import { apiUrls } from '../../../api.urls';
import { nextTick } from 'process';
import { SharedDataService } from '../../../services/shared-data.service'; 

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {

  dataString:any;
  userId:string = "";
  roleName: string = "";

  userID: string = "";
  fullName: string = "";
  fname: string = "";
  mname: string = "";
  lname: string = "";
  email: string = "";
  phone: string = "";
  department: string = "";
  tenure: string = "";
  profileImage: string = "";
  role_name: string = "";
  is_restricted: boolean = false;

  createdAt: string = "";
  updatedAt: string = "";

  error_message_display: string[] = [];
  role_values: string[] = ['Super Admin','Admin','Employee','Student','CSCB'];
  dept: string[] = ['SBA','SEA','SAS','SHTM','SED','SNAMS','SoC','SHTM','BEd','CCJEF','ICSFI'];
  tenure_collections: string[] = ['Full Time','Part Time','Student'];

  auditTrailForm!:any;
  allUsers!:any;
  userAccountDetails!:any;
  notificationForm!:any;


  constructor(
    private sharedData: SharedDataService,
    private el: ElementRef,
    private renderer: Renderer2,
    private actRoute: ActivatedRoute, private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe,
    private http:HttpClient){}

  ngOnInit(){


    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
    }else{
      this.router.navigate(['/login']);
    }

    const id = this.actRoute.snapshot.paramMap.get('id');

    if(id){
      this.userID = id;
      this.getUserProfile();
    }
   
    this.onLoadAllNotifications();


  } // ngOnInit()

  insertNotification(notif_title:string, notif_details: string, path_link: string, doc_type: string, doc_id: string, r_visibility: string, notif_status:string, send_to_id: string, sent_by_id: string, sent_by_role: string){
    
    this.notificationForm = this.fb.group({

      notification_title: notif_title,
      notification_details: notif_details,
      path_link: path_link,
      document_type: doc_type,
      document_id: doc_id,
      role_visibility: r_visibility,
      notification_status: notif_status,
      send_to_id_only: send_to_id,
      sent_by_id: sent_by_id,
      sent_by_role: sent_by_role,
      date_time_added: new Date()   
      
    
    });


    this.inputService.createNotificationService(this.notificationForm.value).subscribe(
      (response) => {

        console.log('Notification details submitted successfully:', response); 

      },
      (error) => {
        console.error('Error saving notification details', error);
        // Handle error logic if needed
      }
    );

  } // insertNotification

  getUserProfile(){

    this.inputService.getUserAccounts(this.router.url).subscribe((data)=>{

      this.allUsers = data;
      
      this.userAccountDetails = this.allUsers.filter((item:any)=>{

        return item._id.includes(this.userID);

      });

      this.fullName = this.userAccountDetails[0].fname+" "+this.userAccountDetails[0].mname+" "+this.userAccountDetails[0].lname;
      this.fullName = this.fullName.toUpperCase();

      this.fname = this.userAccountDetails[0].fname;
      this.mname = this.userAccountDetails[0].mname;
      this.lname = this.userAccountDetails[0].lname;

      this.email = this.userAccountDetails[0].email;
      this.createdAt = this.userAccountDetails[0].createdAt;
      this.updatedAt = this.userAccountDetails[0].updatedAt;
      this.tenure = this.userAccountDetails[0].tenure;
      this.profileImage = this.userAccountDetails[0].profileImage;
      this.department = this.userAccountDetails[0].department;
      this.role_name = this.userAccountDetails[0].role;
      this.is_restricted = this.userAccountDetails[0].is_restricted;

      

    });
 
  } // getUserDetails

  onPromptUpdateAccount(){

    

      Swal.fire({
        title: 'Update Profile?',      
        text: 'Make Changes in your Inputs',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',      
      }).then((result) => {
        if (result.isConfirmed) {
  
          let revisionRemarksString = '';
          revisionRemarksString = result.value;
  
          this.onUpdateAccount();
  
        }
      });
  

  } // onPromptUpdateAccount()

  onPromptRestrictAccount(){

    
    Swal.fire({
      title: 'Deactivate this User?',      
      text: 'This will restrict user for accessing the system',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',      
    }).then((result) => {
      if (result.isConfirmed) {

        this.onRestrictAccount(true);

      }
    });


} // onPromptUpdateAccount()

onPromptUnrestrictAccount(){

    
  Swal.fire({
    title: 'Re-activate this User?',      
    text: 'This will unrestrict user from access to system',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',      
  }).then((result) => {
    if (result.isConfirmed) {

      this.onRestrictAccount(false);

    }
  });


} // onPromptUpdateAccount()

  onUpdateAccount(){

    this.userAccountDetails = this.fb.group({

      _id: this.userID,
      fname: this.fname,
      mname: this.mname,
      lname: this.lname,
      email: this.email,
      tenure: this.tenure,
      department: this.department,
      role: this.role_name,
   

    });



    if(this.fname === '' || this.fname == null){
      this.error_message_display.push("First Name is Blank");
    }

    if(this.mname === '' || this.mname == null){
      this.error_message_display.push("Middle Name is Blank");
    }

    if(this.lname === '' || this.lname == null){
      this.error_message_display.push("Last Name is Blank");
    }

    if(this.email === '' || this.email == null){
      this.error_message_display.push("Email Address is Blank");
    }

    if(this.tenure === '' || this.tenure == null){
      this.error_message_display.push("Tenure is Blank");
    }

    if(this.department === '' || this.department == null){
      this.error_message_display.push("Department is Blank");
    }

    if(this.role_name === '' || this.role_name == null){
      this.error_message_display.push("Role Name is Blank");
    }

   

    if(this.error_message_display.length < 1){
      this.inputService.updateUserDetailService(this.userAccountDetails.value).subscribe((response)=>{

        Swal.fire("User Information Updated");
        this.insertNotification("Personal Information Updated", "Your personal information details successfully updated", "/user-profile", "account-management", "none", "Super Admin,Admin,Employee,CSCB,Student", "new", this.userID, this.userId, this.roleName);
  
       
      });
    
    }
   

  } // onUpdateAccount

  onLoadAllNotifications(){
    this.inputService.getNotificationService(this.router.url).subscribe((data:any) => {

      this.sharedData.setDataArray(data);

    });
  } // onLoadAllNotifications()

  onRestrictAccount(is_restrict:boolean){

    this.userAccountDetails = this.fb.group({

      _id: this.userID,   
      is_restricted: is_restrict   

    });

 
   
    this.inputService.updateUserDetailService(this.userAccountDetails.value).subscribe((response)=>{

      if(is_restrict === true){
        Swal.fire("User is now Deactivated");
      }else{
        Swal.fire("User is now Re-activated!");
      }

      this.getUserProfile();
     
      
    });
    

  } // onUpdateAccount

  clearErrorSession(){
    this.error_message_display = [];
  }
  
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
  } // saveAuditTrailLog
  

}
