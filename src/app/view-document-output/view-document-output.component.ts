import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputService } from '../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import jsPDF, { jsPDFAPI } from 'jspdf'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-document-output',
  templateUrl: './view-document-output.component.html',
  styleUrl: './view-document-output.component.scss'
})
export class ViewDocumentOutputComponent {

  @ViewChild('content_output',{static:false}) el_output!: ElementRef;

  
  dataString: any;  
  userId: string = "";
  roleName: string = "";
  user_account_department: string = "";

  organizationTypes: string[] = ['Religious', 'Academic', 'Special Interest'];
  departmentNames: string[] = ['','SBA','SEA','SAS','SHTM','SEd','SNAMS','SoC','CCJEF','BEd','ICSFI'];
  communityClassificationTypes: string[] = ['Outreach or Dole Out','Semi-Developmental','Developmental'];


  searchInput: string = "";
  search_input: string = "";


  proposalIntakeForm!: any;
  proposalIntakeFilter!:any;
  auditTrailForm!:any;
  proposalDetails!:any;
  proposalDetailsCSCB!:any;
  proposalGetDetails!:any;
  proposalActionPlans!:any;
  proposalActionPlansFiltered!:any;
  proposalDetailFilter!:any;
  proposalDetailFilterApproved!:any;
  userDetails!:any;
  proposal_action_plan_details!:any;
  allUsers!:any;
  proposalDetailsFilterByEmployeeUser!: any;

  implementationReports!:any;
  implementationReportDetails!:any;

  proposalId: string = "";

  output_title: string = "";
  project_title: string = "";
  project_date_implemented: string = "";
  accomplished_objective: string = "";

  
  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datepipe: DatePipe,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(){

    this.dataString = localStorage.getItem('localData');
    
    const id = this.actRoute.snapshot.paramMap.get('id');
    const notif_id = this.actRoute.snapshot.paramMap.get('notif_id');

    if(id){
      this.proposalId = id;
    }


    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.user_account_department = jsonString.department;

      
    
      this.onLoadAllProposalIntake(this.proposalId);
      this.onLoadFilteredImplementationReports(this.proposalId);
      this.onLoadAllProposalActionPlan(this.proposalId);
      this.onViewAllProposalService(this.proposalId);
    

    }else{
      this.router.navigate(['/login']);
    }

    

  } // ngOnInit()
  

   makePDF_output(){

    let date_string = String(this.datepipe.transform(new Date(),"MM-dd-yyyy hhmmss"));
    this.output_title = "OCES_OUTPUT_"+date_string;

    let pdf = new jsPDF({
      unit: "pt",
      orientation: "p"
    });
    
    pdf.html(this.el_output.nativeElement,{
      callback: (pdf) =>{
        pdf.setFontSize(4);
        pdf.save(""+this.output_title+".pdf");
      }
    })

   } // makePDF_output - OUTPUT

   
   sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  
  getUserRole(user_id: string): String{

    let return_value = "";

    if(this.userDetails){

      this.userDetails = this.allUsers.filter((item_filter:any)=>{

        return item_filter._id.includes(user_id);
        
  
      });
  
      let role_name = this.userDetails[0].role; 
  
      return_value = role_name;

    }
   
    return return_value;

  } // getUserRole()


  onLoadAllProposalIntake(proposal_id:string){

    this.inputService.getIntakeFormService(this.router.url).subscribe((data:any)=>{
      
      this.proposalIntakeForm = data;

      this.proposalIntakeFilter = this.proposalIntakeForm.filter((item_filter:any)=>{
        return item_filter._id.includes(proposal_id);
      });

      this.proposalIntakeFilter.forEach((filter_intake:any)=>{

        this.project_title = filter_intake.project_title;

      });

    });

  } // onLoadAllProposalIntake

  onLoadFilteredImplementationReports(proposal_id: string){

    this.inputService.getImplementationService(this.router.url).subscribe((data:any)=>{

      this.implementationReports = data.filter((item_filter:any)=>{

        return item_filter.proposal_id.includes(proposal_id);

      });


      let record_count = 0;
      record_count = Object.keys(this.implementationReports).length;
      

      if(this.implementationReports){
       
        this.implementationReports.forEach((item_filter:any)=>{

          
          this.project_date_implemented = item_filter.date_implemented;
          this.accomplished_objective = item_filter.accomplished_objective;

        });

      }

    });

  } // onLoadAllImplementationReports

  
  
  onLoadAllProposalActionPlan(proposal_id:string){
    this.inputService.getProposalActionPlanService(this.router.url).subscribe((data:any)=>{

      this.proposalActionPlans = data;
      this.proposalActionPlansFiltered = this.proposalActionPlans.filter((item_search:any)=>{
        return item_search.proposal_id.includes(proposal_id);
      });
  
    });
  } // onLoadAllProposalActionPlan()



  getProposalActionPlanDetails(proposalId:string, criteria:string): string{
    
    let return_value = '';



    this.proposal_action_plan_details = this.proposalActionPlans.filter((item:any)=>{
      return item.proposal_id.includes(proposalId);
    });

    if(this.proposal_action_plan_details){

      let time_frame_start = this.proposal_action_plan_details[0].time_frame_start;
      let time_frame_end = this.proposal_action_plan_details[0].time_frame_end;
      let objective_string = this.proposal_action_plan_details[0].objectives; 
      let activity_title = this.proposal_action_plan_details[0].activity_title; 
      let activity_details = this.proposal_action_plan_details[0].activity_details; 

      if(criteria === 'objectives'){
        return_value = objective_string ;
      }

      if(criteria === 'time_frame_start'){
        return_value = time_frame_start;
      }

      if(criteria === 'time_frame_end'){
        return_value = time_frame_end;
      }

      if(criteria === 'activity_title'){
        return_value = activity_title;
      }

      if(criteria === 'activity_details'){
        return_value = activity_details;
      }

    }

    
    
    return return_value;

  } // getProposalActionPlanDetails()


  getProposalActionTargetPeriod(proposalId:string): string{
    
    let return_value = '';



    this.proposal_action_plan_details = this.proposalActionPlans.filter((item:any)=>{
      return item.proposal_id.includes(proposalId);
    });

    let ndx_limit = 0;
    ndx_limit = Object.keys(this.proposal_action_plan_details).length - 1;
    
    if(ndx_limit < 0){
      ndx_limit = 0;
    }

    let target_start_raw = '';
    let target_end_raw = '';

    target_start_raw = this.proposal_action_plan_details[0].time_frame_start;
    target_end_raw = this.proposal_action_plan_details[ndx_limit].time_frame_end;

    let target_start_date = this.datepipe.transform(target_start_raw, 'MMM dd, yyyy');
    let target_end_date = this.datepipe.transform(target_end_raw, 'MMM dd, yyyy')

    return_value = target_start_date+' to '+target_end_date;
    
    return return_value;

  } // getProposalActionPlanDetails()

  onViewAllProposalService(proposal_id: string){
   
    
    this.inputService.getProposalService(this.router.url).subscribe((data:any) => {

      this.proposalDetails = data;         
  
  
      this.proposalDetailFilterApproved = this.proposalDetails.filter((item:any)=>{
  
        return item._id.includes(proposal_id);
  
      });

      let proposal_document_count = 0;

      if(this.proposalDetailFilterApproved){

        proposal_document_count = Object.keys(this.proposalDetailFilterApproved).length;
  
        if(proposal_document_count > 0){

          this.proposalDetailFilter = this.proposalDetailFilterApproved;

          this.project_title = this.proposalDetailFilter[0].project_title;
          
        }
       
      }
     

     


    });

    
   

  } /// onClickAllRecords()



}
