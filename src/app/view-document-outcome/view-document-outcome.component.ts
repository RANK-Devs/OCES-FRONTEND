import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputService } from '../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'; 
import jsPDF, { jsPDFAPI } from 'jspdf'; 

@Component({
  selector: 'app-view-document-outcome',
  templateUrl: './view-document-outcome.component.html',
  styleUrl: './view-document-outcome.component.scss'
})
export class ViewDocumentOutcomeComponent {

  @ViewChild('content',{static:false}) el!: ElementRef;


  proposals!:any;
  proposalDetails!:any;
  proposalActionPlans!:any;
  proposalActionPlansFiltered!:any;
  proposalDetailFilter!:any;
  proposalDetailFilterApproved!:any;
  allProposalIntakes!:any;

  implementationReports!:any;
  implementation_reports_filter!:any;

  outcomeForm!:any;
  outcomeFilter!:any;

  dataString: any;
  userId: string = "";
  roleName: string = "";
  user_account_department: string = "";
  activity_category_collections: string[] = ['Education','Finance and Business Management','ICT','Micro-Infrastracture, Engineering, and Architectural Works','Values and Spiritual Formation','SNAMS','HRM Related Skills Traning'];

  outcome_title: string = "";
  output_title: string = "";

  selected_dept: string = "";
  selected_cat: string = "";
  selected_sy: string = "";

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datepipe: DatePipe,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(){

    const dept = this.actRoute.snapshot.paramMap.get('id');
    const cat = this.actRoute.snapshot.paramMap.get('cat');
    const sy = this.actRoute.snapshot.paramMap.get('sy');

    if(dept){
      this.selected_dept = dept;
    }

    if(cat){
      this.selected_cat = cat;
    }

    if(sy){
      this.selected_sy = sy;
    }

    this.dataString = localStorage.getItem('localData');
    
    
    if(this.dataString){

      const jsonString = JSON.parse(this.dataString);   
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.user_account_department = jsonString.department;
      
     
    
      this.onViewAllProposals();
      this.onLoadAllProposalActionPlan();
      this.getAllImplementations();
     

    }else{

      this.router.navigate(['/login']);

    } // if this.dataString


  } // ngOnInit()
  
  makePDF(){

    let date_string = String(this.datepipe.transform(new Date(),"MM-dd-yyyy hhmmss"));
    this.outcome_title = "OCES_OUTCOME_REPORT_"+date_string;

    let pdf = new jsPDF({
      unit: "pt",
      orientation: "p"
    });
    
    pdf.html(this.el.nativeElement,{
      callback: (pdf) =>{       
        pdf.save(""+this.outcome_title+".pdf");
      }
    })
   } // makePDF - OUTCOME


   getAllImplementations(){

    this.inputService.getImplementationService(this.router.url).subscribe(data=>{

      this.implementationReports = data;

    });

    let proposal_id_array = [{}];

    if(this.proposals){

      this.proposals = this.proposals.filter((p_item:any)=>{

        if(this.selected_sy !== 'none' && this.selected_dept !== 'none'){
          return p_item.for_schoolyear.includes(this.selected_sy) && p_item.sponsor_department.includes(this.selected_dept);
        }

        if(this.selected_dept === 'none' && this.selected_sy !== 'none'){
          return p_item.for_schoolyear.includes(this.selected_sy)
        }

        if(this.selected_dept !== 'none' && this.selected_sy !== 'none'){
          return p_item.sponsor_department.includes(this.selected_dept);
        }

      });

      this.proposals.forEach((prop_item:any)=>{

        proposal_id_array.push({
          "pid":prop_item._id
        })

      });

    }



    if(this.implementationReports){

      this.implementationReports = this.implementationReports.filter((i_item:any)=>{

        return i_item.activity_category.includes(this.selected_cat);

      });

      this.implementationReports = this.implementationReports.filter((a:any)=> proposal_id_array.some((b:any) => b.pid === a.proposal_id));

    }

    

   } // getAllImplementations()

  

 

 

   getTargetPeriodProposalActionPlans(proposal_id:string): string{

    let return_value = '';

    this.proposalActionPlansFiltered = this.proposalActionPlans.filter((item_search:any)=>{
      return item_search.proposal_id.includes(proposal_id);
    });

    if(this.proposalActionPlansFiltered){
      this.proposalActionPlansFiltered.forEach((item_s:any)=>{
        let time_frame_start_string = String(this.datepipe.transform(item_s.time_frame_start,"MMM dd, yyyy"));
        let time_frame_end_string = String(this.datepipe.transform(item_s.time_frame_end,"MMM dd, yyyy"));
        return_value = time_frame_start_string+" to "+time_frame_end_string
      });
    }

    return return_value;

  } // getTargetPeriodProposalActionPlan

  getAllProposedActionPlanActivities(proposalID:string): any{

    
    if(this.proposalActionPlansFiltered){

      this.proposalActionPlansFiltered = this.proposalActionPlans.filter((item:any)=>{

        return item.proposal_id.includes(proposalID);

      });

    } 
    

    return this.proposalActionPlansFiltered;

} // getAllProposedActionPlan



onViewAllProposals(){

  this.inputService.getProposalService(this.router.url).subscribe((data)=>{
    this.proposals = data;
  });

  this.inputService.getIntakeFormService(this.router.url).subscribe((data)=>{
    this.allProposalIntakes = data;
  
    if(this.allProposalIntakes){

      this.allProposalIntakes.forEach((item_intakes:any)=>{

        let time_frame_end_string = this.getAllProposedActionPlanActivities(item_intakes._id).time_frame_end;


        this.proposals.push({

          proposal_root_id: "",
          _id: item_intakes._id,
          status: item_intakes.status,
          role_name: "",
          proposal_type: "proposal-intake",
          user_id: item_intakes.user_id,
          for_schoolyear: item_intakes.for_schoolyear,
          for_semester: item_intakes.for_semester,
          sponsor_department: item_intakes.departments,
          project_title: item_intakes.project_title,
          target_beneficiary: item_intakes.target_beneficiary,
          venue: item_intakes.target_area,
          time_frame_start: item_intakes.target_date,
          time_frame_end: time_frame_end_string,
          revision_remarks: item_intakes.revision_remarks,
          revision_remarks_date_time: item_intakes.revision_remarks_date_time,
          revision_by_user_id: item_intakes.revision_by_user_id

        });

      });
    } // if this.allProposalIntakes

  });

 

} // onViewAllProposals

  getFromProposal(proposalId: string, criteria_string: string): string{

    let return_value = '';

    this.proposalDetails = this.proposals.filter((item_filter:any) =>{

      return item_filter._id.includes(proposalId);

    });

    if(this.proposalDetails){

      this.proposalDetails.forEach((item:any)=>{

        if(criteria_string === 'for_schoolyear'){
          return_value = item.for_schoolyear;
        }

        if(criteria_string === 'sponsor_department'){
          return_value = item.sponsor_department;
        }

      });

    }

    return return_value;

  } // getFromProposal()

  onLoadAllProposalActionPlan(){
    this.inputService.getProposalActionPlanService(this.router.url).subscribe((data:any)=>{
      this.proposalActionPlans = data;
    });
  } // onLoadAllProposalActionPlan()

 

  checkIfCategoryExistInImplementation(category_item:string): boolean {

    var find_count = 0;
    var exist_category = false;
    
    if(this.implementationReports){

      this.implementation_reports_filter = this.implementationReports.filter((item:any)=>{

        return item.activity_category.includes(category_item);
  
      });
  
      if(this.implementation_reports_filter){
        find_count = Object.keys(this.implementation_reports_filter).length;
      }
  
      if(find_count > 0){
        exist_category = true;
      }

    } // if this.implementationReports
   

    return exist_category;

   } // getAllImplementations()

}
