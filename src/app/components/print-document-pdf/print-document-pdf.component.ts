import { Component } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service'; 


@Component({
  selector: 'app-print-document-pdf',
  templateUrl: './print-document-pdf.component.html',
  styleUrl: './print-document-pdf.component.scss'
})
export class PrintDocumentPdfComponent {


  timeOutId: any;


  administrativeRole: boolean = false;
  studentRole: boolean = false;
  employeeRole: boolean = false;

  role_name: string = "";
  studentForm!: FormGroup;
  notificationForm!: FormGroup;
  auditTrailForm!:any;
  proposalDetailsForm!:any;
  proposedActionPlan!:any;

  proposal_from: string = "";  
  proposalID: string = "";
  notifID: string = "";
  currentDate: Date = new Date();
  jsonDataString: any;

  
  userId: string = "";


  filterProposalData: any;



  constructor(
    private sharedData: SharedDataService,
    private actRoute: ActivatedRoute, private fb: FormBuilder,
    private inputService: InputService,
    private router: Router){}

    getProposalStatus(statusID: string): string{
      let string_value = '';
  
      switch(statusID){
        case '0':string_value = "Rejected";break;
        case '1':string_value = "Approved";break;
        case '2':string_value = "Done";break;
        case '3':string_value = "Pending";break;
        case '4':string_value = "Revise";break;
        case '5':string_value = "Implementation";break;
        case '6':string_value = "Output";break;
        case '7':string_value = "Outcome";break;
        case '8':string_value = "Revision Submitted";break;
      }
  
      return string_value;
    } // getProposalStatus

    
  ngOnInit(){

    const id = this.actRoute.snapshot.paramMap.get('id');
   

    if(id){
      this.proposalID = id;         
    }


  
    this.onLoadProposalDetails(this.proposalID);
    this.onLoadProposedActionPlan(this.proposalID);
    this.onLoadAllNotifications();


    this.jsonDataString = localStorage.getItem('localData');

    if(this.jsonDataString){

        const jsonData = JSON.parse(this.jsonDataString);
        this.role_name = jsonData.role;
        this.userId = jsonData._id;


        if(this.role_name === 'Student'){
          this.administrativeRole = false;
          this.studentRole = true;
          this.employeeRole = false;
        }

        if(this.role_name === 'Super Admin'){
          this.administrativeRole = true;
          this.studentRole = false;
          this.employeeRole = false;
        }

        if(this.role_name === 'Employee'){
          this.administrativeRole = false;
          this.studentRole = false;
          this.employeeRole = true;
        }

        
    }
    
    this.printOnDelay();
  

  } // ngOnInit

  printOnDelay(){
    this.timeOutId = setTimeout(() => {
      window.print();
    }, 2000)
  }

  ngOnDestroy(){
    if(this.timeOutId){
      clearTimeout(this.timeOutId);
    }
  }

  onLoadProposalDetails(proposalID: string){

    this.inputService.getProposalService(this.router.url).subscribe((data:any) => {

      this.proposalDetailsForm = data;

      this.proposalDetailsForm = this.proposalDetailsForm.filter((item:any) => {

        return item._id.includes(proposalID);

      });   
      

    });
    
  } // onLoadProposalDetails()

  onLoadProposedActionPlan(proposalID: string){

    this.inputService.getProposalActionPlanService(this.router.url).subscribe((data:any)=>{

      this.proposedActionPlan = data.filter((item:any)=>{
        return item.proposal_id.includes(proposalID);
      });

    });

  } // onLoadProposedActionPlan()

  onLoadAllNotifications(){
    this.inputService.getNotificationService(this.router.url).subscribe((data:any) => {

      this.sharedData.setDataArray(data);

    });
  }

  getProposalProjectTitle(proposalId:string): string{

    let return_value = '';
   
    if(this.proposalDetailsForm){
      this.proposalDetailsForm.forEach((item:any) => {

        if(proposalId === item._id){
          return_value = item.project_title;
        }

      });
    }

    return return_value;

  } // getProposalProjectTitle

  



}
