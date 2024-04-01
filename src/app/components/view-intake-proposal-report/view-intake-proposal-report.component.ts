import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common'; 
import { SharedDataService } from '../../services/shared-data.service'; 

import jsPDF, { jsPDFAPI } from 'jspdf'; 



@Component({
  selector: 'app-view-intake-proposal-report',
  templateUrl: './view-intake-proposal-report.component.html',
  styleUrl: './view-intake-proposal-report.component.scss'
})
export class ViewIntakeProposalReportComponent {

  
  @ViewChild('content',{static:false}) el!: ElementRef;
  
  proposalIntakes!:any;
  proposalIntakeID: string = "";
  notifID: string = "";

  organization_type: string = "";
  name_of_organization: string = "";
  date_established: string = "";

  contact_person: string = "";
  contact_person_position: string = "";
  contact_number: string = "";

  adviser_name: string = "";
  adviser_date_signature: string = "";
  adviser_contact_number: string = "";

  num_members: string = "";
  organizational_expertise: string = "";

  title_of_activity: string = "";
  activity_purpose: string = "";
  reason_for_choosing_community_sector: string = "";
  target_date: string = "";
  target_area: string = "";
  target_beneficiary: string = "";
  num_beneficiary: string = "";
  classification_community_extension_project: string = "";

  target_objectives: string = "";
  target_activities: string = "";
  time_frame_start: string = "";
  time_frame_end: string = "";
  budget: string = "";
  beneficiaries: string = "";
  progress_indicator: string = "";

  submitted_by_name: string = "";
  submitted_by_position: string = "";

  pdfsource: string = "";
  administrativeRole: boolean = false;
  studentRole: boolean = false;
  employeeRole: boolean = false;

  role_name: string = "";
  studentForm!: FormGroup;
  notificationForm!: FormGroup;
  auditTrailForm!:any;
  proposalDetailsForm!:any;
  updateProposalDetailsForm!:any;
  proposedActionPlan!:any;

  updateProposalIntakeForm!:any;
  proposalIntake!:any;

  proposal_from: string = "";  
  proposalID: string = "";
  proposal_status: string = "";
  currentDate: Date = new Date();
  jsonDataString: any;

  allUsers!:any;
  allProposals!:any;
  proposalDetailsFilter!:any;
  userDetails!:any;
  intakeProposalRevisionVersions!:any;

  intake_proposal_title: string = "";

  userId: string = "";

  proposal_user_id:string = "";
  selected_proposal_id:string = "";
  selected_project_title:string = "";
  dataString:any;


  filterProposalData: any;

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

    this.dataString = localStorage.getItem('localData');
    
    if(id){

      this.proposalIntakeID = id;       
      this.getProposalIntake(this.proposalIntakeID);
      this.getAllRevisionVersions(this.proposalIntakeID);

    }

    if(notif_id){
      this.notifID = notif_id; 
    }


    if(this.dataString){

      const jsonString = JSON.parse(this.dataString);   
      this.role_name = jsonString.role;
      this.userId = jsonString._id;

    }else{

      this.router.navigate(['/login']);

    }

    this.onLoadAllUsers();
   
  } // ngOnInit()

  
  makePDF(){

    let date_string = String(this.datePipe.transform(new Date(),"MM-dd-yyyy hhmmss"));
    this.intake_proposal_title = "STUDENT_INTAKE_PROPOSAL_"+date_string;

    let pdf = new jsPDF({
      unit: "pt",
      orientation: "p"
    });
    
    pdf.html(this.el.nativeElement,{
      callback: (pdf) =>{       
        pdf.save(""+this.intake_proposal_title+".pdf");
      }
    })
   } // makePDF

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
  
   hasRevisions(proposal_root_id: string): boolean{

    let return_value = false;
    let filter_proposal_details: any;
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;

    let intake_proposal_revisions: any;
    intake_proposal_revisions = this.intakeProposalRevisionVersions;

      if(intake_proposal_revisions){

        filteredProposal =  intake_proposal_revisions.slice(-1)[0];

        if(filteredProposal){

          filter_count_with_proposal_root_id = Object.keys(filteredProposal).length;

        }
       
      } /// if intake_proposal_revisions

   

    if(filter_count_with_proposal_root_id > 0){
      return_value = true;
    }

    return return_value;

  } // hasRevision

   getAllRevisionVersions(proposal_root_id: string){

    this.inputService.getIntakeFormService(this.router.url).subscribe((revision_data:any)=>{

      this.intakeProposalRevisionVersions = revision_data.filter((item_filter:any)=>{

        return item_filter.proposal_root_id.includes(proposal_root_id);

      });      

    });

  } // getAllRevisionVersions

  onViewIntakeReport(projectId: string){
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog("View Intake Proposal Document (ID:"+projectId+")");
    this.router.navigate(['/view-intake-proposal-report',projectId,"none"]);
    
  } // onViewIntakeReport

 
  onViewRevisionIntakeReport(projectId: string){
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog("View Intake Proposal Document (ID:"+projectId+")");
    window.open('/view-intake-proposal-report/'+projectId+"/none","_blank");
    
  } // onViewIntakeReport

  getProposalIntake(proposal_intake_id:string){

    this.inputService.getIntakeFormService(this.router.url).subscribe(data=>{
      this.proposalIntakes = data;

      this.proposalIntakes = this.proposalIntakes.filter((item_filter:any)=>{

        return item_filter._id.includes(proposal_intake_id);

      });

      let pi = this.proposalIntakes;

      this.organization_type = this.proposalIntakes[0].organization_type;
      this.name_of_organization = this.proposalIntakes[0].organization_name;
      this.date_established = this.proposalIntakes[0].organization_date_established;
      this.contact_person = this.proposalIntakes[0].contact_person;
      this.contact_person_position = this.proposalIntakes[0].contact_person_position;
      this.contact_number = this.proposalIntakes[0].contact_number;
      this.adviser_name =  pi[0].adviser_name;
      this.adviser_date_signature = pi[0].adviser_date_signature;
      this.adviser_contact_number = pi[0].adviser_contact_number;
      this.num_members = pi[0].num_members;
      this.organizational_expertise = pi[0].organizational_expertise;

      this.title_of_activity = pi[0].project_title;
      this.activity_purpose = pi[0].activity_purpose;
      this.reason_for_choosing_community_sector = pi[0].reason_for_choosing_community_sector;
      this.target_date = pi[0].target_date;
      this.target_area = pi[0].target_area;
      this.target_beneficiary = pi[0].target_beneficiary;
      this.num_beneficiary = pi[0].num_beneficiary;
      this.classification_community_extension_project = pi[0].classification_community_extension_project;

      this.target_objectives = pi[0].target_objectives;
      this.target_activities = pi[0].target_activities;
      this.time_frame_start = pi[0].time_frame_start;
      this.time_frame_end = pi[0].time_frame_end;
      this.budget = pi[0].budget;
      this.beneficiaries = pi[0].beneficiaries;
      this.progress_indicator = pi[0].progress_indicator;


    });

  } // getProposalIntake()



  onLoadProposalDetails(proposalID: string){

    this.inputService.getProposalService(this.router.url).subscribe((data:any) => {

      this.proposalDetailsForm = data;

      this.proposalDetailsForm = this.proposalDetailsForm.filter((item:any) => {

        return item._id.includes(proposalID);

      });   

      if(this.proposalDetailsForm){

        this.proposal_status = this.proposalDetailsForm[0].status;
        this.proposal_user_id = this.proposalDetailsForm[0].user_id;
        this.selected_proposal_id = this.proposalDetailsForm[0]._id;
        this.selected_project_title = this.proposalDetailsForm[0].project_title;

      }
   
      

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
  } // onLoadAllNotifications()

  onLoadAllUsers(){
    this.inputService.getUserAccounts(this.router.url).subscribe((data:any)=>{

      this.allUsers = data;

    });
  } // onLoadAllUsers();

  onLoadAllProposals(){

    this.inputService.getProposalService(this.router.url).subscribe((data:any) => {

      this.allProposals = data;

    });

  } // onLoadAllProposals()

  getProposalDetails(proposal_id:string): string{

    let return_value = '';

    this.proposalDetailsFilter = this.allProposals.filter((item:any) => {

      return item._id.includes(proposal_id);

    });

    let project_title = '';
    let venue = '';
    let target_beneficiary = '';
    let department_sponsor = '';

    project_title = this.proposalDetailsFilter[0].project_title;

    return_value = project_title;

    return return_value;

  } // getProposalDetails();

  onViewDocumentReport(proposal_ID:string){
    // this.proposalID for current proposal document
    // proposal_ID for selected/clicked proposal document, usually on revision

    this.router.navigate(['/view-document-report',this.proposalID,"none"]).then(() => {
      window.open('/view-document-report/'+proposal_ID+'/none','_target');
    });
  } // onViewDocumentReport()

  getUserDetails(user_id:string): string{

    let return_value = '';

    if(this.userDetails){

      this.userDetails = this.allUsers.filter((item:any) => {
        return item._id.includes(user_id);
      });
  
      let fullname = '';

      let fname = this.userDetails[0].fname;
      let mname = this.userDetails[0].mname;
      let lname = this.userDetails[0].lname;
      let r_name = this.userDetails[0].role;
      fullname =  fname+" "+mname+" "+lname;
  
      return_value = fullname.toUpperCase()+" ("+r_name+")";


    }

  


    return return_value;
  } // getUserDetails()

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

  onPrint(proposalId:string){

    this.router.navigate(['/print-document-pdf',proposalId]).then(()=>{
      //window.open('/print-document-pdf/'+proposalId+'/'+notifId+'','_blank');
    });

  } // onPrint()


    onReviseProposal(proposalID: string){

      this.router.navigate(['/revise-document-report',proposalID, this.notifID]);

    } // onReviseProposal

    onReviseIntakeProposal(proposalID: string){

      this.router.navigate(['/revise-intake-proposal-report',proposalID, this.notifID]);

    } // onReviseIntakeProposal


  onPromptDisapprove(notifId: string, userId:string, proposalID:string,projectTitle:string){

    Swal.fire({
      title: 'Disapprove this Proposal?',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        this.onDisapprove(notifId, userId, proposalID, projectTitle);

      }
    });

  } // onPromptDisapprove

  
  onDisapprove(notifId: string, userId:string, proposalID:string, projectTitle:string){

    this.saveAuditTrailLog("Disapproval of Proposal ID: "+proposalID);
    this.disapproveProposal(proposalID, userId, notifId, projectTitle);  

  
  } // onDisapprove

  disapproveProposal(proposalId: string, sendToUserId: string,notifId: string, projectTitle:string){
    
    this.proposalDetailsForm = this.fb.group({
      _id: proposalId,
      status: "0"
    });


    //console.log("console log: "+proposalId);
    this.disapprove_process(notifId, projectTitle, proposalId, sendToUserId);

  } // disapproveProposal
  
  disapprove_process(notifId: string, projectTitle: string, proposalId: string, sendToUserId: string){

  

    this.inputService.updateIntakeFormService(this.proposalDetailsForm.value).subscribe((response) => {

      this.onUpdateNotification(notifId,"done");
     
      this.insertNotification("Proposal Disapproved", "Project Title: "+projectTitle+"", "/view-document-report", "Proposal",proposalId, "Employee", "new", sendToUserId, this.userId,this.role_name);
  
      this.onLoadAllNotifications();

     Swal.fire('Proposal Disapproved!\n Event: '+projectTitle);
      this.router.navigate(['/archive']);

    },(error) => {
      console.error('Error disapproving proposal', error);
    });

  }// disapprove_process()

  onPromptRevise(notifId: string, userId: string, proposalId:string,projectTitle:string){

    Swal.fire({
      title: 'Request Revision of Proposal',
      input: 'text',
      text: 'Specify the Details of Revision',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',      
    }).then((result) => {
      if (result.isConfirmed) {

        let revisionRemarksString = '';
        revisionRemarksString = result.value;

        console.log("notifId: "+notifId);
        console.log("userId: "+userId);
        console.log("proposalId: "+proposalId);
        console.log("Project Title: "+projectTitle);
        
        this.onRevise(notifId, proposalId, userId, projectTitle, revisionRemarksString);

      }
    });

  } // onPromptRevise

  
  onRevise(notifId:string, proposalId:string,  userId:string, projectTitle:string, revisionRemarks: string){

    this.onUpdateNotification(notifId,"done");
    
    this.saveAuditTrailLog("Request for Revision of Proposal ID: "+proposalId);

    this.updateProposalDetailsForm = this.fb.group({

      _id: proposalId,        
      status: "4",
      revision_remarks: revisionRemarks,
      revision_remarks_date_time: new Date(),
      revision_by_user_id: this.userId         
  
     });

     this.updateProposalIntakeForm = this.fb.group({
      
      _id: proposalId,
      status: "4",
      revision_remarks: revisionRemarks,
      revision_remarks_date_time: new Date(),
      revision_by_user_id: this.userId

     });

  this.inputService.updateIntakeFormService(this.updateProposalIntakeForm.value).subscribe((response)=>{

    this.insertNotification("Intake Proposal is Requested to Revise", "Project Title: "+projectTitle+"", "/view-intake-proposal-report", "Proposal",proposalId, "Super Admin,Admin,Student", "new", userId, this.userId,this.role_name);
  
    this.onLoadAllNotifications();

    Swal.fire('Intake Proposal will be subject for Revision\n Event: '+projectTitle);

    this.router.navigate(['/archive']);

  }, (error)=>{

    console.log(error);

  });

 
  


  } // onRevise


  onPromptApprove(notifId:string, userId:string,proposalID:string,projectTitle:string){

    Swal.fire({
      title: 'Approve this Proposal?',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        this.onApprove(notifId, userId,proposalID, projectTitle);

      }
    });

  } // onPromptApprove

  onApprove(notifId:string, userId:string, proposalID:string, projectTitle:string){

      this.saveAuditTrailLog("Approval of Proposal ID: "+proposalID);

      this.approveProposal(proposalID, notifId, projectTitle, userId);  
   
  } // onApprove

  approveProposal(proposalId: string, notifId: string, projectTitle: string, sendToUserId: string){

   
    this.proposalIntakes = this.fb.group({
      _id: proposalId,
      status:"1"
    });

    this.inputService.updateIntakeFormService(this.proposalIntakes.value).subscribe((response) => {

      this.onUpdateNotification(notifId,"done");
     
      this.insertNotification("Proposal Intake Approved!", "Project Title: "+projectTitle+"", "/view-intake-proposal-report", "Proposal",proposalId, "Student", "new", sendToUserId, this.userId,this.role_name);
  
      this.onLoadAllNotifications();

     Swal.fire('Proposal Approved!\n Event: '+projectTitle);
      this.router.navigate(['/archive']);

    },(error) => {
      console.error('Error saving notification updates', error);
    });

  } // approveProposal()





 
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
