import { Component, Inject, PLATFORM_ID, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../services/input.service';
import { DatePipe } from '@angular/common'; 
import { SharedDataService } from '../../services/shared-data.service'; 

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrl: './topnav.component.scss'
})
export class TopnavComponent {

  proposalIntakeForm: any;
  notificationObject:any;
  notificationForm:any;
  pendingProposalLength: any = [];
  pendingNotificationLength:any = [];
  filteredForNotification:any;
  @Input() CurrentMenuTitle: string = "";
  menu: any = [];
  jsonString: any;
  filterMenu: any;
  userId: string = "";
  loggedInRole: string = "";
  currentDate: Date = new Date();  

  constructor(private sharedData: SharedDataService, private fb: FormBuilder,private router:Router,private inputService: InputService, private datePipe: DatePipe){

  }

  ngOnInit(){

    this.filterMenu = this.menu;



    this.jsonString = localStorage.getItem('localData');
    
    if(this.jsonString){

      const jsonData = JSON.parse(this.jsonString);

      this.loggedInRole = jsonData.role;

      this.userId = jsonData._id;     
       
      this.onClickAllRecords();    
      this.onLoadAllNotificationRecords(this.loggedInRole);

    }else{
      this.router.navigate(['/login']);
    }
  
   

  } // ngOnInit

  onClickAllRecords(){

    this.inputService
    .getIntakeFormService(this.router.url)
    .subscribe((data) => {
      this.proposalIntakeForm = data;
      this.filteredForNotification = this.proposalIntakeForm.filter((item:any)=>{            
        return item.status.includes("3");
      });

      this.filteredForNotification = this.sortByDate(this.filteredForNotification,'date_submitted', true);
      if(this.filteredForNotification){
        this.pendingProposalLength = Object.keys(this.filteredForNotification).length;
      }
      
    });
  } // onClickAllRecords()

  onLoadAllNotificationRecords(loggedInRole: string){

    this.sharedData.dataList$.subscribe((data:any) => {

      this.notificationObject = data;

      this.notificationObject = this.notificationObject.filter((item:any) => {

        if(loggedInRole === 'Super Admin'){
       
          return item.role_visibility.includes(loggedInRole) && item.notification_status.includes("new");            

        }

        if(loggedInRole === 'Student'){
          
          if(item.send_to_id_only !== '' && this.userId === item.send_to_id_only){

            return item.role_visibility.includes(loggedInRole) && item.send_to_id_only.includes(this.userId) && item.notification_status.includes("new");
            
          }

        }

        if(loggedInRole === 'Employee'){
          
          if(item.send_to_id_only !== '' && this.userId === item.send_to_id_only){

            return item.role_visibility.includes(loggedInRole) && item.send_to_id_only.includes(this.userId) && item.notification_status.includes("new");
            
          }

        }

      });
    
      this.pendingNotificationLength = Object.keys(this.notificationObject).length;
      this.notificationObject = this.sortByDate(this.notificationObject,"date_time_added", true);
      

    });
  } // onLoadAllNotificationRecords()

  onViewAllNotificationRecords(loggedInRole: string){

    this.inputService
    .getNotificationService(this.router.url)
    .subscribe((data) => {

      this.notificationObject = data;

      this.notificationObject = this.notificationObject.filter((item:any) => {

        if(loggedInRole === 'Super Admin'){

          return item.role_visibility.includes(loggedInRole) && item.notification_status.includes("new");            

        }

        if(loggedInRole === 'Student'){
          
          if(item.send_to_id_only !== '' && this.userId === item.send_to_id_only){

            return item.role_visibility.includes(loggedInRole) && item.send_to_id_only.includes(this.userId) && item.notification_status.includes("new");
            
          }

        }

      });
    
      this.pendingNotificationLength = Object.keys(this.notificationObject).length;

      this.notificationObject = this.sortByDate(this.notificationObject,"date_time_added", true);
      
    });
  } // onViewAllNotificationRecords()

  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  onViewDocumentReport(notifId: string, projectId: string, pathLink: string){
    //window.open('view-document-report/'+projectId+'','_target');
    let notif_id = '';

    if(notifId !== ''){
      
      notif_id = notifId;
      
    }


    if(this.loggedInRole === 'Student'){
        
      this.onUpdateNotification(notif_id,"done");

    }

    if(this.loggedInRole === 'Employee'){
        
      this.onUpdateNotification(notif_id,"done");

    }

    this.router.navigate(['/'+pathLink+'',projectId,notif_id]);
   
  } // onViewDocumentReport()

  onUpdateNotification(notif_id:string, notif_status:string){

    this.notificationForm = this.fb.group({
    
      _id:notif_id,
      notification_status: notif_status,     
    
    });


    this.inputService.updateNotificationService(this.notificationForm.value).subscribe(
      (response) => {

        console.log('Notification details update succesfully', response); 

      },
      (error) => {
        console.error('Error saving notification updates', error);
        // Handle error logic if needed
      }
    );

  } // onUpdateNotification

 
  onViewNotificationIntake(){
    this.router.navigate(['/student-reports']);
  }

  onViewProfile(){
    this.router.navigate(['/user-profile']);
  }

  onLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
 
}
