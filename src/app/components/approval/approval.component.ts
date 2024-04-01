import { Component, OnInit, Pipe, PipeTransform  } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {


  administrativeRole: boolean = false;
  studentRole: boolean = false;
  employeeRole: boolean = false;
  userId: string = "";
  role_name: string = "";
  dataString:any;
  searchInput: string = "";

  proposal_action_plan_details!:any;
  proposalActionPlans!:any;
  userDetails!:any;
  allUsers!:any;

  // IMPLEMENTATION REPORTS
  implementationReports!:any;
  implementationDetails!:any;

  // FOR STUDENTS
  proposalIntakeForm!: any;
  filteredProposalForUser!: any;

  approvedIntakesStudentUser!:any;

  // FOR EMPLOYEES
  proposalForms!:any;
  proposalFormsFilter!:any;

  auditTrailForm!:any;
  currentDate: Date = new Date();

  allProposals!:any;
  allApprovedProposals!:any;
  

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

   

  ngOnInit(): void {
  
    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.role_name = jsonString.role;
      this.userId = jsonString._id;

      this.saveAuditTrailLog("View Student Proposal Table");     
      this.onClickAllRecords();
      this.onLoadAllUsers();
      this.onLoadAllImplementationReports();

    }else{
      this.router.navigate(['/login']);
    }

  
   
  } // ngOnInit()

  ngAfterInit(){

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
      this.role_name = jsonString.role;
      this.userId = jsonString._id;

      this.saveAuditTrailLog("View Student Proposal Table");     
      this.onClickAllRecords();
      this.onLoadAllUsers();
      this.onLoadAllImplementationReports();

    }else{
      this.router.navigate(['/login']);
    }


  } // ngAfterInit()

  onLoadAllImplementationReports(){

    this.inputService.getImplementationService(this.router.url).subscribe((data:any)=>{
      this.implementationReports = data;
    });

  } // onLoadAllImplementationReports()

  onInputImplementationIntakeProposal(intake_id:string) {
    try {
      this.router.navigate(['/implementation-report-student', intake_id]);
    } catch (error) {}
  } // onInputImplementationIntakeProposal

  onInputImplementationProposal(proposal_id:string) {
    try {
      this.router.navigate(['/implementation-report', proposal_id]);
    } catch (error) {}
  } // onInputImplementationProposal

  getImplementationDetails(proposal_id: string, criteria_string: string){

    let return_value = '';

    if(this.implementationReports){
      this.implementationDetails = this.implementationReports.filter((item:any)=>{

        return item.proposal_id.includes(proposal_id);

      });
    } // this.implementationReports

    if(this.implementationDetails){

      this.implementationDetails.forEach((i_item:any)=>{

        if(criteria_string === 'implementation_id'){
          return_value = i_item._id;
        }

      });

    } // this.implementationDetails

    return return_value;

  } // getImplementationDetails()

  onLoadAllUsers(){

    this.inputService.getUserAccounts(this.router.url).subscribe((response)=>{

      this.allUsers = response;

    });

  } // onLoadAllUsers()

  getUserDetails(userID: string, criteria_string: string) : string{

    let return_value = '';

    if(this.allUsers){
      this.userDetails = this.allUsers.filter((item_user:any)=>{
        return item_user._id.includes(userID);
      });
    } // this.allUsers

    if(this.userDetails){
      this.userDetails.forEach((user_item:any)=>{
        if(criteria_string === 'fullname'){
          let fullname = '';
          let fname = '';
          let mname = '';
          let lname = '';


          fname = user_item.fname;
          mname = user_item.mname;
          lname = user_item.lname;

          fullname = fname+" "+mname+" "+lname;

          return_value = fullname;
        }
      });
    } // this.userDetails

    return return_value;

  } // getUserDetails()

  onViewDocumentReport(projectId: string){
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog("View Proposal Document (ID:"+projectId+")");
    this.router.navigate(['/view-document-report',projectId,"none"]);
  } // onViewDocumentReport()

  onViewIntakeDocumentReport(proposal_id: string){
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog("View Proposal Document (ID:"+proposal_id+")");
    this.router.navigate(['/view-intake-proposal-report',proposal_id,"none"]);
  } // onViewIntakeDocumentReport()

  onViewImplementationReport(proposalId: string){

    this.saveAuditTrailLog("View Implementation Report (ID:"+proposalId+")");

    let implementation_id = '';
    implementation_id =  this.getImplementationDetails(proposalId,"implementation_id");  

    this.router.navigate(['/view-implementation-report',implementation_id,"none"]);

  } // onViewImplementationReport()

  onClickAllRecords(){

    this.inputService
    .getIntakeFormService(this.router.url)
    .subscribe((data) => {

     // this.proposalIntakeForm = data;

      this.allProposals = data;

      this.approvedIntakesStudentUser = this.allProposals.filter((item_filter:any)=>{

        return item_filter.status.includes("1") || item_filter.status.includes("2");

      });

      this.approvedIntakesStudentUser =  this.approvedIntakesStudentUser.filter((item_filter:any)=>{

        return item_filter.user_id.includes(this.userId);

      });

      //this.filteredProposalForUser = this.sortByDate(this.filteredProposalForUser,'date_submitted', true);
      
    });


    this.inputService.getProposalActionPlanService(this.router.url).subscribe((data:any)=>{
      this.proposalActionPlans = data;
    });
    
    this.inputService.getProposalService(this.router.url).subscribe((data)=>{

      this.proposalForms = data;
   
      if(this.proposalForms){

        this.proposalForms.forEach((item:any)=>{

        

          var action_plan_count = 0;
         
          this.allProposals.push({
    
            _id: item._id,
            user_id: item.user_id,
            proposal_type: "proposal_document",
            departments: item.sponsor_department,
            date_submitted: item.createdAt,
            project_title: item.project_title,
            target_date: new Date(),            
            target_area: item.venue,
            target_beneficiary: item.target_beneficiary,
            status: item.status
    
          });
  
        });


      }
     
      this.allApprovedProposals = this.allProposals.filter((approved_item:any)=>{

        return approved_item.status.includes("1") || approved_item.status.includes("2");

      });

      // this.getProposalActionPlanDetails(item.user_id, 'time_frame_start')
      // this.getProposalActionPlanDetails(item.user_id, 'time_frame_end')

    });

   
  

  } /// onClickAllRecords()


  getProposalActionPlanDetails(proposalId:string): any {
       
    this.proposal_action_plan_details = this.proposalActionPlans.filter((item:any)=>{
      return item.proposal_id.includes(proposalId);
    });

    
    return this.proposal_action_plan_details;

  } // getProposalActionPlanDetails()



  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

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

  getFormattedDate(stringDate:string): string {

    let formattedStringToDate: Date = new Date(stringDate);
    return this.datePipe.transform(formattedStringToDate,'MMM-dd-yyyy') || '';

  }

  onSearchChange(){

    if(this.searchInput === ""){
      this.onClickAllRecords();
    }

  }

  onClickSearch(){

    this.saveAuditTrailLog("Search Proposals, Keyword: "+this.searchInput.toLowerCase()+"");

    this.proposalIntakeForm = this.proposalIntakeForm.filter((item:any) => {

      return item.fullname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.sponsoring_department.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.project_title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.status.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.associated_with.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.target_beneficiary.toLowerCase().includes(this.searchInput.toLowerCase());

    });

    this.filteredProposalForUser =  this.filteredProposalForUser.filter((item:any) => {

      return item.fullname.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.sponsoring_department.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.project_title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.status.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.associated_with.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      item.target_beneficiary.toLowerCase().includes(this.searchInput.toLowerCase());
      
    });

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
  

  onInputImplementationIntake() {
    try {
      this.router.navigate(['']);
    } catch (error) {}
  }
  onAddClickIntake() {
    this.router.navigate(['project-proposal-student']);
  }

}
