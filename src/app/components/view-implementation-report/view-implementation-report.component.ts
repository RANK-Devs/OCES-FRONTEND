import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common'; 
import { apiUrls } from '../../api.urls';
import { nextTick } from 'process';
import { SharedDataService } from '../../services/shared-data.service'; 
import jsPDF, { jsPDFAPI } from 'jspdf'; 

@Component({
  selector: 'app-view-implementation-report',
  templateUrl: './view-implementation-report.component.html',
  styleUrl: './view-implementation-report.component.scss'
})
export class ViewImplementationReportComponent {


   
  @ViewChild('content',{static:false}) el!: ElementRef;
  

  proposalID: string = "";
  implementationID: string = "";
  notifID: string = "";

  fileUploads!:any;
  fileUploadFilter!:any;
  cloud_file_path: string = "";
  cloud_file_paths: string[] = [];


  userDetails!:any;
  allUsers!:any;

  implementationReports!:any;
  implementationReportDetails!:any;


  proposalDetails!:any;
  proposalGetDetails!:any;

  proposalIntakes!:any;
  proposalIntakeDetails!:any;

  accomplished_objective: string = "";
  brief_narrative: string = "";
  project_topic: string = "";
  activity_speakers: string = "";

  project_title: string = "";
  sponsor_department: string = "";
  venue: string = "";
  target_beneficiary: string = "";

  implementation_report_title: string = "";

  project_volunteers: string = "";
  designation: string = "";
  participation_type: string = "";
  prep_start_time: string = "";
  prep_end_time: string = "";
  learnings: string = "";
  project_strengths: string = "";
  project_weakness: string = "";
  project_improvement: string = "";
  project_counterpart: string = "";
  project_particulars: string = "";
  project_amount: string = "";

  constructor(
    private sharedData: SharedDataService,
    private renderer: Renderer2,
    private actRoute: ActivatedRoute, private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe,
    private http:HttpClient){}

  ngOnInit(){

    const id = this.actRoute.snapshot.paramMap.get('id');
    const notif_id = this.actRoute.snapshot.paramMap.get('notif_id');



    if(id){

      this.implementationID = id;    

      this.getAllUsers();
      this.onLoadProposalDocuments();
      this.onLoadProposalIntakes();
      this.onLoadImplementationReports(this.implementationID);
     

    
      
    }

    if(notif_id){
      this.notifID = notif_id; 
    }

  

  } // ngOnInit()

  ngAfterInit(){

    const id = this.actRoute.snapshot.paramMap.get('id');
    const notif_id = this.actRoute.snapshot.paramMap.get('notif_id');



    if(id){

      this.implementationID = id;    

      this.getAllUsers();
      this.onLoadProposalDocuments();
      this.onLoadProposalIntakes();
      this.onLoadImplementationReports(this.implementationID);
     

    
      
    }

    if(notif_id){
      this.notifID = notif_id; 
    }
    
  } // ngAfterInit()

 
  
  makePDF(){

    let date_string = String(this.datePipe.transform(new Date(),"MM-dd-yyyy hhmmss"));
    this.implementation_report_title = "IMPLEMENTATION_REPORT_PROPOSAL_"+date_string;

    let pdf = new jsPDF({
      unit: "pt",
      orientation: "p"
    });
    
    pdf.html(this.el.nativeElement,{
      callback: (pdf) =>{       
        pdf.save(""+this.implementation_report_title+".pdf");
      }
    })
   } // makePDF

  onLoadImplementationReports(implementation_id:string){

    this.inputService.getImplementationService(this.router.url).subscribe((data)=>{
      
      this.implementationReports = data;

      this.implementationReportDetails = this.implementationReports.filter((item:any)=>{

        return item._id.includes(implementation_id);
  
      });


      let proposal_id = '';
      let proposal_type = '';

      if(this.implementationReportDetails){

          this.implementationReportDetails.forEach((i_item:any)=>{


            proposal_id = i_item.proposal_id;
            proposal_type = i_item.proposal_type;
            this.proposalID = proposal_id;

          
          });

        
          if(proposal_type === 'proposal_intake'){

            if(this.proposalIntakes){

              this.proposalIntakeDetails = this.proposalIntakes.filter((item:any)=>{
                return item._id.includes(proposal_id);
              });

              this.project_title = this.proposalIntakeDetails[0].project_title;
              this.venue = this.proposalIntakeDetails[0].target_area;
              this.sponsor_department = this.proposalIntakeDetails[0].departments;
              this.target_beneficiary = this.proposalIntakeDetails[0].target_beneficiary;
          
              if(this.implementationReportDetails){
        
                this.implementationReportDetails.forEach((item:any)=>{
        
                    this.accomplished_objective = item.accomplished_objective;
                    this.brief_narrative = item.brief_narrative;
                    this.project_topic = item.project_topic;
                    this.proposalID =  item.proposal_id;
                    this.activity_speakers = item.activity_speaker;

                    this.project_volunteers = item.project_volunteers;
                    this.designation = item.designation;
                    this.participation_type = item.participation_type;
                    this.prep_start_time = item.prep_start_time;
                    this.prep_end_time = item.prep_end_time;
                    this.learnings = item.learnings;
                    this.project_strengths = item.project_strengths;
                    this.project_weakness = item.project_weakness;
                    this.project_improvement = item.project_improvement;
                    this.project_counterpart = item.project_counterpart;
                    this.project_particulars = item.project_particulars;
                    this.project_amount = item.project_amount;
                  
                  
                });
                
              } // if this.implementationReportDetails is set

            } // if this.proposalIntakes is set
           
          } // if proposal_type = proposal_intake

          if(proposal_type === 'proposal_document'){

            this.proposalGetDetails = this.proposalDetails.filter((item:any)=>{
              return item._id.includes(proposal_id);
            });
      
          
          
            this.project_title = this.proposalGetDetails[0].project_title;
            this.venue = this.proposalGetDetails[0].venue;
            this.sponsor_department = this.proposalGetDetails[0].sponsor_department;
            this.target_beneficiary = this.proposalGetDetails[0].target_beneficiary;
        
            if(this.implementationReportDetails){
      
              this.implementationReportDetails.forEach((item:any)=>{
      
                  this.accomplished_objective = item.accomplished_objective;
                  this.brief_narrative = item.brief_narrative;
                  this.project_topic = item.project_topic;
                  this.proposalID =  item.proposal_id;
                  this.activity_speakers = item.activity_speaker;

                  this.project_volunteers = item.project_volunteers;
                  this.designation = item.designation;
                  this.participation_type = item.participation_type;
                  this.prep_start_time = item.prep_start_time;
                  this.prep_end_time = item.prep_end_time;
                  this.learnings = item.learnings;
                  this.project_strengths = item.project_strengths;
                  this.project_weakness = item.project_weakness;
                  this.project_improvement = item.project_improvement;
                  this.project_counterpart = item.project_counterpart;
                  this.project_particulars = item.project_particulars;
                  this.project_amount = item.project_amount;
                
              });
              
            }

          } // if proposal_type =  proposal_document

      

      } // if this.implementationReportDetails is set
    
   


    });

   
  }// onLoadImplementationReports()

  onLoadProposalDocuments(){

    this.inputService.getProposalService(this.router.url).subscribe(data=>{

      this.proposalDetails = data;
    
    });

  } // onLoadProposalDocuments()

  viewUploadedImages(){

    this.router.navigate(['/view-uploaded-images',this.proposalID]);

  } // viewUploadedImages



  onLoadProposalIntakes(){

    this.inputService.getIntakeFormService(this.router.url).subscribe((data:any)=>{
      this.proposalIntakes = data;
    })

  } // onLoadProposalIntakes()


  viewFileUpload(){

    this.inputService.getFileUploadService(this.router.url).subscribe((data:any)=>{

      this.fileUploads = data;

      this.fileUploadFilter = this.fileUploads.filter((item_filter:any)=>{

        return item_filter.proposal_id.includes(this.proposalID) && item_filter.file_type.includes("pdf");

      }); // this.fileUploadFilter

      if(this.fileUploadFilter){

        this.fileUploadFilter.forEach((item_filter:any)=>{

          window.open(item_filter.cloud_file_path,"_blank");

        });

      } // if this.fileUploadFilter

    });

  } // viewFileUpload()
  
  getAllUsers(){

    this.inputService.getUserAccounts(this.router.url).subscribe((data)=>{

      this.allUsers = data;  

    });

 
  } // getUserDetails

  getUserDetails(user_id: string): String{

    let return_value = "";

    this.userDetails = this.allUsers.filter((item_filter:any)=>{

      return item_filter._id.includes(user_id);

    });

    let firstname = this.userDetails[0].fname;
    let middlename = this.userDetails[0].mname;
    let lastname = this.userDetails[0].lname;

    let fullname = firstname+" "+middlename+" "+lastname;
    fullname = fullname.toUpperCase();

    return_value = fullname;

    return return_value;

  } // getUserDetails


  getUserRole(user_id: string): String{

    let return_value = "";

    this.userDetails = this.allUsers.filter((item_filter:any)=>{

      return item_filter._id.includes(user_id);

    });

    let role_name = this.userDetails[0].role; 

    return_value = role_name;
    return return_value;

  } // getUserRole()

 

  semesterTranslate(semId:string){
    let semTranslate = "";
    switch(semId){
      case '1':semTranslate = "1st Semester";break;
      case '2':semTranslate = "2nd Semester";break;
      case '3':semTranslate = "Summer";break;
    }
    return semTranslate;
  }

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
  }

 

}
