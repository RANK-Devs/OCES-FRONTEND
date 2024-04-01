import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormBuilder } from '@angular/forms';
import { InputService } from '../../services/input.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  dataString: any;
 
  userId: string = "";
  role_name: string = "";
  currentDate: Date = new Date();

  intakeProposals!: any;
  actionPlanServices!: any;
  auditTrailForm!:any;
  proposalDetails!:any;
  proposalDetailsFilter!:any;

  events: EventInput[] = [];

  constructor(private fb: FormBuilder,  private inputService: InputService, private router: Router){

    this.currentDate = new Date();
   

  }

  

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };
 

  ngOnInit(){


    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.role_name = jsonString.role;
    }else{
      this.router.navigate(['/login']);
    }

      this.onLoadAllProposals();

      this.inputService.getProposalActionPlanService(this.router.url).subscribe((data) => {

        this.actionPlanServices = data;

        this.actionPlanServices.forEach((item:any) => {

  
          let status_string = '';
          let status_ndx = this.getProposalDetails(item.proposal_id,'status');
          status_string = this.interpretStatus(status_ndx);
          
        
          if(status_ndx === '1' || status_ndx === '2'){

         
            this.events.push({    
           
              title: this.getProposalDetails(item.proposal_id,'project_title')+" ("+status_string+" - From Proposal)",
              start: item.time_frame_start,
              end: item.time_frame_end
      
            });
          
          }
        
          

        });

        this.inputService.getIntakeFormService(this.router.url).subscribe((data:any)=>{

          this.intakeProposals = data;
  
          this.intakeProposals.forEach((intake_data:any)=>{
  
            let status_ndx = intake_data.status;
            let status_string = this.interpretStatus(status_ndx);
            
            if(status_ndx === '1' || status_ndx === '2'){
  
              this.events.push({    
             
                title: intake_data.project_title+"("+status_string+" - From Student Intake)",
                start: intake_data.time_frame_start,
                end: intake_data.time_frame_end
        
              });
  
            }
          
           
          });
  
       
          this.calendarOptions.events = this.events;
  
        }); // intake proposals load view 
       
        
      });


 

    
    
     
      this.saveAuditTrailLog("Viewed Schedule Tracker");
  

  } // ngOnInit()


  onLoadAllProposals(){

    this.inputService.getProposalService(this.router.url).subscribe((data:any)=>{
      this.proposalDetails = data;
    })

  } // onLoadProposals()

  getProposalDetails(proposalId: string, criteria_string:string): string {

    let return_value = '';

    this.proposalDetailsFilter = this.proposalDetails.filter((item_filter:any)=>{
      return item_filter._id.includes(proposalId);
    });

    let project_title = '';
    let target_beneficiary = '';
    let status = '';
    let venue = '';
    let for_semester = '';
    let for_schoolyear = '';
    let role_name = '';
    let user_id = '';

    project_title = this.proposalDetailsFilter[0].project_title;
    target_beneficiary = this.proposalDetailsFilter[0].target_beneficiary;
    status = this.proposalDetailsFilter[0].status;
    venue = this.proposalDetailsFilter[0].venue;
    for_schoolyear = this.proposalDetailsFilter[0].for_schoolyear;
    for_semester = this.proposalDetailsFilter[0].for_semester;
    role_name = this.proposalDetailsFilter[0].role_name;
    user_id = this.proposalDetailsFilter[0].user_id;


    if(criteria_string === 'project_title'){
      return_value = project_title;
    }

    if(criteria_string === 'target_beneficiary'){
      return_value = target_beneficiary;
    }
    
    if(criteria_string === 'status'){
      return_value = status;
    }
    
    if(criteria_string === 'venue'){
      return_value = venue;
    }

    
    if(criteria_string === 'for_semester'){
      return_value = for_semester;
    }

    
    if(criteria_string === 'for_schoolyear'){
      return_value = for_schoolyear;
    }

    
    if(criteria_string === 'role_name'){
      return_value = role_name;
    }

    
    if(criteria_string === 'user_id'){
      return_value = user_id;
    }
   

    return return_value;
   

  } // getProposalDetails()
 

  interpretStatus(status_num: string): string{

    let status = "";

    if(status_num === "1"){
      status = "Approved";
    }

    if(status_num  === "2"){
      status = "Done";
    }

    if(status_num  === "0"){
      status = "Rejected";
    }

    if(status_num  === "3"){
      status = "Pending";
    }

    if(status_num  === "4"){
      status = "For Revision";
    }

    return status;

  }


  
  initializeAuditTrail(actionTaken:string) : void{
    
    this.auditTrailForm = this.fb.group({

      user_id: this.userId,     
      role: this.role_name,
      action_taken: actionTaken,
      action_date_time: new Date()      
    
    });

  }

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

  }

  saveAuditTrailLog(actionString:string):void{
    this.initializeAuditTrail(actionString);
    this.onRecordAuditTrailLogs();
  }
  


}
