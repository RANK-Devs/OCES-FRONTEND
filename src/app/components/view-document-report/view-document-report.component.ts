import { Component, ElementRef, ViewChild } from '@angular/core';
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
  selector: 'app-view-document-report',
  templateUrl: './view-document-report.component.html',
  styleUrl: './view-document-report.component.scss'
})
export class ViewDocumentReportComponent {

  @ViewChild('content',{static:false}) el!: ElementRef;

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

  proposal_from: string = "";  
  proposalID: string = "";
  proposal_status: string = "";
  notifID: string = "";
  currentDate: Date = new Date();
  jsonDataString: any;
  document_title: string = "";

  allUsers!:any;
  allProposals!:any;
  proposalFilter!:any;
  proposalDetailsFilter!:any;
  userDetails!:any;
  proposalDocumentRevisionVersions!:any;

  
  userId: string = "";

  proposal_user_id:string = "";
  selected_proposal_id:string = "";
  selected_project_title:string = "";



  filterProposalData: any;

  constructor(
    private sharedData: SharedDataService,
    private actRoute: ActivatedRoute, private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe,
    private http:HttpClient){}

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
    const notif_id = this.actRoute.snapshot.paramMap.get('notif_id');



    if(id){
      this.proposalID = id;         
    }

    if(notif_id){
      this.notifID = notif_id; 
    }
    
  
    this.onLoadProposalDetails(this.proposalID);
    this.onLoadProposedActionPlan(this.proposalID);
    this.onLoadAllNotifications();
    this.onLoadAllUsers();  
    this.onLoadAllProposals();
    this.getAllRevisionVersions(this.proposalID);


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

        if(this.role_name === 'Admin'){
          this.administrativeRole = true;
          this.studentRole = false;
          this.employeeRole = false;
        }

        if(this.role_name === 'Employee'){
          this.administrativeRole = false;
          this.studentRole = false;
          this.employeeRole = true;
        }

        this.saveAuditTrailLog("Viewing of Document, Proposal ID: "+this.proposalID);
    }
    
  

  } // ngOnInit


  makePDF(){

    let date_string = String(this.datePipe.transform(new Date(),"MM-dd-yyyy hhmmss"));
    this.document_title = "OCES_PROPOSAL_DOCUMENT_"+date_string;

    let pdf = new jsPDF({
      unit: "pt",
      orientation: "p"
    });
    
    pdf.html(this.el.nativeElement,{
      callback: (pdf) =>{       
        pdf.save(""+this.document_title+".pdf");
      }
    })
   } // makePDF

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

  hasProposalRootId(proposal_id: string): boolean{

    let has_proposal_root_id = false;

    this.inputService.getProposalService(this.router.url).subscribe((data:any)=>{

      this.proposalFilter = data.filter((p_item:any)=>{

        return p_item.proposal_id.includes(proposal_id);
        
      });

      if(this.proposalFilter){

        this.proposalFilter.forEach((item:any)=>{
          if(item.proposal_root_id !== ' -- '){
            has_proposal_root_id = true;
          }
        });

      }

    });

    return has_proposal_root_id;

  } // hasProposalRootId
  
  
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


  this.inputService.updateProposalService(this.updateProposalDetailsForm.value).subscribe((response) => {


    this.insertNotification("Proposal is Requested to Revise", "Project Title: "+projectTitle+"", "/view-document-report", "Proposal",proposalId, "Super Admin,Admin,Employee", "new", userId, this.userId,this.role_name);
  
    this.onLoadAllNotifications();

    Swal.fire('Proposal will be subject for Revision\n Event: '+projectTitle);

    this.router.navigate(['/archive']);

      
    },(error) => {

      //Swal.fire('Error '+error);
      console.log(error);

    });
  


  } // onRevise

  onViewRevisionDocumentReport(projectId: string){
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog("View Proposal Document (ID:"+projectId+")");
    window.open('/view-document-report/'+projectId+"/none","_blank");
    
  } // onViewIntakeReport

  getAllRevisionVersions(proposal_root_id: string){

    this.inputService.getProposalService(this.router.url).subscribe((revision_data:any)=>{

      this.proposalDocumentRevisionVersions = revision_data.filter((item_filter:any)=>{

        return item_filter.proposal_root_id.includes(proposal_root_id);

      });      

    });

  } // getAllRevisionVersions

  getLastDocumentRevision(proposal_root_id: string, criteria_string: string, criteria_default_value: string): string{

    let return_value = '';
    let filter_proposal_details: any;
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;

    if(this.allProposals){

      filter_proposal_details = this.allProposals.filter((p_item:any)=>{

        return p_item.proposal_root_id.includes(proposal_root_id);

      });

     

      if(filter_proposal_details){

        filteredProposal =  filter_proposal_details.slice(-1)[0];

        if(filteredProposal){

          filter_count_with_proposal_root_id = Object.keys(filteredProposal).length;

          if(criteria_string === "status"){
            return_value = this.getProposalStatus(filteredProposal.status);
          }    

        }
       

      } /// if filter_proposal_details

    } // if this.allProposals

    if(filter_count_with_proposal_root_id < 1){
      return_value = this.getProposalStatus(criteria_default_value);
    } // filter_count_with_proposal_root_id < 1

    return return_value;

  } // getLastDocumentRevision

  hasRevisions(proposal_root_id: string): boolean{

    let return_value = false;
    let filter_proposal_details: any;
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;

    if(this.allProposals){

      filter_proposal_details = this.allProposals.filter((p_item:any)=>{

        return p_item.proposal_root_id.includes(proposal_root_id);

      });

     

      if(filter_proposal_details){

        filteredProposal =  filter_proposal_details.slice(-1)[0];

        if(filteredProposal){

          filter_count_with_proposal_root_id = Object.keys(filteredProposal).length;

        

        }
       

      } /// if filter_proposal_details

    } // if this.allProposals

    if(filter_count_with_proposal_root_id > 0){
      return_value = true;
    }

    return return_value;

  } // hasRevision

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

    this.proposalDetailsForm = this.fb.group({
      _id: proposalId,
      status:"1"
    });

    this.inputService.updateProposalService(this.proposalDetailsForm.value).subscribe((response) => {

      this.onUpdateNotification(notifId,"done");
     
      this.insertNotification("Proposal Approved!", "Project Title: "+projectTitle+"", "/view-document-report", "Proposal",proposalId, "Employee", "new", sendToUserId, this.userId,this.role_name);
  
      this.onLoadAllNotifications();

     Swal.fire('Proposal Approved!\n Event: '+projectTitle);
      this.router.navigate(['/archive']);

    },(error) => {
      console.error('Error saving notification updates', error);
    });

  } // approveProposal()




  onDisapprove(notifId: string, userId:string, proposalID:string, projectTitle:string){

    this.saveAuditTrailLog("Approval of Proposal ID: "+proposalID);
    this.disapproveProposal(proposalID, userId, notifId, projectTitle);  

  
  } // onDisapprove

  disapproveProposal(proposalId: string, sendToUserId: string,notifId: string, projectTitle:string){
    
    this.proposalDetailsForm = this.fb.group({
      _id: proposalId,
      status:"0"
    });

    this.inputService.updateProposalService(this.proposalDetailsForm.value).subscribe((response) => {

      this.onUpdateNotification(notifId,"done");
     
      this.insertNotification("Proposal Disapproved", "Project Title: "+projectTitle+"", "/view-document-report", "Proposal",proposalId, "Employee", "new", sendToUserId, this.userId,this.role_name);
  
      this.onLoadAllNotifications();

     Swal.fire('Proposal Disapproved!\n Event: '+projectTitle);
      this.router.navigate(['/archive']);

    },(error) => {
      console.error('Error saving notification updates', error);
    });
  } // disapproveProposal

 
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
