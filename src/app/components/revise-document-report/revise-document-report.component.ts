import { Component, OnInit, Inject, Injectable, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { InputService } from '../../services/input.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { timeStamp } from 'console';


@Component({
  selector: 'app-revise-document-report',
  templateUrl: './revise-document-report.component.html',
  styleUrl: './revise-document-report.component.scss'
})
export class ReviseDocumentReportComponent {


  dataString: any = "";
  userId: string = "";
  role_name: string = "";
  proposed_by_fullname: string = "";
  currentDate: Date = new Date(); 
  sponsoring_department_collections: any[] = [];
  sponsoring_departments: string[] = [];
  sponsoring_department_string: string = "";
  s_dept:string = "";
  input_field_count:number = 0;

  studentForm!: FormGroup;
  notificationForm!: FormGroup;
  auditTrailForm!:any;

  proposalDetails!:any;

  proposalDetailsForm!:any;
  proposalDetailsUpdate!:any;
  proposalActionPlan!:any;
  proposalActionPlans!:any;
  proposedActionPlanFields:any[] = [];
  proposedActionPlanItems: any[] = [];


  organizationTypes: string[] = ['Religious', 'Academic', 'Special Interest'];
  departmentNames: string[] = ['','SBA','SEA','SAS','SHTM','SEd','SNAMS','SoC','CCJEF','BEd','ICSFI'];
  semesterData: string[] = ['1','2','3'];
  selectedFile: File | null = null;
  proposalID: string = "";
  notifId: string = "";

  for_schoolyear: string = "";
  for_semester: string = "";
  project_title: string = "";
  venue: string = "";
  target_beneficiary: string = "";
  proposal_status: string = "";

  new_project_title: string = "";
  new_target_beneficiary: string = "";
  new_for_semester: string = "";
  new_for_schoolyear: string = "";

  objectives:string[] = [];
  activity_title:string[] = [];
  activity_details:string[] = [];
  responsible_persons:string[] = [];
  budget_requirements:string[] = [];
  time_frame_start:string[] = [];
  time_frame_end:string[] = [];
  proposed_output:string[] = [];


  department: string = "";
  projectTitle: string = "";
  projectTargetPeriod: string = "";
  projectVenue: string = "";
  projectProposedByFullName: string = "";
  selected_proposal_root_id: string = "";

  constructor(

    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private actRoute: ActivatedRoute  

  ) {}


  ngOnInit() {
  
    const id = this.actRoute.snapshot.paramMap.get('id');
    const notif_id = this.actRoute.snapshot.paramMap.get('notif_id');
   

    if(id){
      this.proposalID = id;           
    }

    if(notif_id){
      this.notifId = notif_id;
    }
 

    this.onTransferDataToInputFields(this.proposalID);  

  
    this.initializeForm();
    this.saveAuditTrailLog("Proposal Form Inputs");
  

  } // ngOnInit


  onTransferDataToInputFields(proposal_id:string){


    this.proposalDetails = [];

    this.inputService.getProposalService(this.router.url).subscribe((data:any)=>{

      this.proposalDetails = data;     

      this.proposalDetails = this.proposalDetails.filter((item:any)=>{
        return item._id.includes(proposal_id);
      });

      if(this.proposalDetails){

        this.venue = this.proposalDetails[0].venue;
        this.target_beneficiary = this.proposalDetails[0].target_beneficiary;
        this.project_title = this.proposalDetails[0].project_title;
        this.for_schoolyear = this.proposalDetails[0].for_schoolyear;
        this.for_semester = this.proposalDetails[0].for_semester;
        this.department = this.proposalDetails[0].sponsor_department;
        this.proposal_status = this.proposalDetails[0].status;
        this.selected_proposal_root_id = this.proposalDetails[0].proposal_root_id;

        this.transferDepartmentData();

        this.getProposalActionPlans(proposal_id);
        
      }

   

     

    });  
    
    //this.venue =  this.proposalDetails[0].venue;

  } // onTransferDataToInputFields()

  transferDepartmentData(){

  

    if(this.department !== "" || this.department !== null || this.department !== undefined){

      let department_array = [];

      //this.proposedActionPlanItems.push({"item":"item"+this.input_field_count+""});  

      department_array = this.department.split(",") 
      // since this.department is a string variable that saves all departments from the value in the database in one line separated by a comma
      // the split() function converts string containing a delimeter (in this case, a comma) into an array 
      // department_array now holds the values of the departments

      department_array.forEach((d_item:any)=>{

        if(d_item !== null && d_item !== " " && d_item !== undefined && d_item.trim() !== "" && d_item !== "" ){

          this.sponsoring_department_collections.push({"item":d_item});       
          // saves every department name into this.sponsoring_department_collections array
          // d_item is an every value of department names
          // this.sponsoring_department_collections is a ngModel variable which can be declared directly to an input type html element and will display the value on that input element

        }

      }); // iterates values of department_array

    } // tests if this.department, a global variable is not blank in value, null or undefined
   

  } // transferDepartmentData

  onUpdateFieldConditions(){

     this.proposedActionPlanItems.push({"item":"item"+this.input_field_count+""});  
    
  } // onUpdateFieldConditions for Proposed Action Plan
 
  onAddInput(){

    this.input_field_count += 1;
    this.onUpdateFieldConditions();

  } // onAddInput()


  getProposalStatus(statusID: string): string{
    let string_value = '';

    switch(statusID){
      case '0':string_value = "Rejected";break;
      case '1':string_value = "Approved";break;
      case '2':string_value = "Done";break;
      case '3':string_value = "Pending";break;
      case '4':string_value = "For Revision";break;
      case '5':string_value = "Implementation";break;
      case '6':string_value = "Output";break;
      case '7':string_value = "Outcome";break;
      case '8':string_value = "Revision Submitted";break;
    }

    return string_value;
  } // getProposalStatus

  onSetProjectTitle(value_any:any){

    this.project_title = value_any.target.value;

  } // onSetProjectTitle

  onSetTargetBeneficiary(value_any:any){

    this.target_beneficiary = value_any.target.value;

  } // onSetTargetBeneficiary

  onSetForSchoolYear(value_any:any){

    this.for_schoolyear = value_any.target.value;

  } // onSetForSchoolYear

  onSetForSemester(value_any:any){

    this.for_semester = value_any.target.value;

  } // onSetForSemester

  onSetObjectives(ndx:number,value_any:any){
    this.objectives[ndx] = value_any.target.value;
  }

  onSetActivityTitle(ndx:number,value_any:any){
    this.activity_title[ndx] = value_any.target.value;
  }


  onSetActivityDetails(ndx:number,value_any:any){
    this.activity_details[ndx] = value_any.target.value;
  }


  onSetResponsiblePersons(ndx:number,value_any:any){
    this.responsible_persons[ndx] = value_any.target.value;
  }


  onSetBudgetRequirements(ndx:number,value_any:any){
    this.budget_requirements[ndx] = value_any.target.value;
  }


  onSetTimeFrameStart(ndx:number,value_any:any){
    this.time_frame_start[ndx] = value_any.target.value;
  }


  onSetTimeFrameEnd(ndx:number,value_any:any){
    this.time_frame_end[ndx] = value_any.target.value;
  }

  onSetProposedOutput(ndx:number,value_any:any){
    this.proposed_output[ndx] = value_any.target.value;
  }


  onChangeSponsoringDepartment(){

    if(this.checkIfDepartmentExist(this.s_dept) == false){

      if(this.s_dept.trim() !== ''){
        this.sponsoring_department_collections.push({"item":this.s_dept});
        this.s_dept = "";
      }
     
    }    
   
  } // onChangeSponsoringDepartment()

  convertToStringList(){
    
    if(this.sponsoring_department_collections){
      this.sponsoring_department_collections.forEach((item:any)=>{
        this.sponsoring_departments.push(item.item);
      })
    }

  }

  checkIfDepartmentExist(dept_item:string): boolean {

    let exist_dept = false;

    if(this.sponsoring_department_collections){

      this.sponsoring_department_collections.forEach((item:any)=>{

        if(item.item === dept_item){
          exist_dept = true;
        }

      });
      
    }

    return exist_dept;

  } // checkIfDepartmentExist

  removeSelectedDepartment(dept_value:string){

   this.sponsoring_department_collections = this.sponsoring_department_collections.filter(item => item.item !== dept_value);

  } // removeSelectedDepartment

  semesterTranslate(semId:string){
    let semTranslate = "";
    switch(semId){
      case '1':semTranslate = "1st Semester";break;
      case '2':semTranslate = "2nd Semester";break;
      case '3':semTranslate = "Summer";break;
    }
    return semTranslate;
  }



  initializeForm() {

    this.dataString = localStorage.getItem('localData');
    const jsonString = JSON.parse(this.dataString);

    if(this.dataString){

      this.userId = jsonString._id;
      this.role_name = jsonString.role;
  
      this.proposed_by_fullname = jsonString.fname+" "+jsonString.mname+" "+jsonString.lname;
      this.proposed_by_fullname = this.proposed_by_fullname.toUpperCase();

    }

    
    
   
  } // initializeForm

 

  convertArrayToStringDepartments(){

    if(this.sponsoring_department_collections){
      this.sponsoring_department_collections.forEach((item:any)=>{       
        this.sponsoring_department_string += item.item+",";
      });
    }

  } // convertArrayToStringDepartments()

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

  onUpdateRevisionEmployee() {
  
    this.convertArrayToStringDepartments();

    //this.sponsoring_department_string = this.sponsoring_department_string.split(',').map(element => element.trim()).join('');

    let proposal_root_id_value = '';

    if(this.selected_proposal_root_id !== " -- "){
      proposal_root_id_value =  this.selected_proposal_root_id;
    }else{
      proposal_root_id_value =  this.proposalID;
    }

    this.proposalDetailsForm = this.fb.group({
      proposal_root_id: proposal_root_id_value,
      user_id: this.userId,
      role_name: this.role_name,     
      for_schoolyear: this.for_schoolyear,
      for_semester: this.for_semester,
      sponsor_department: this.sponsoring_department_string,
      project_title: this.project_title,
      target_beneficiary: this.target_beneficiary,
      status: "3",
      venue: this.venue,
      revision_remarks: "",
      revision_remarks_date_time: "",
      revision_by_user_id: ""
    });  

    console.log(this.proposalDetailsForm);

    this.createProposalDetailFunction(proposal_root_id_value);
   
  } // onUpdateRevisionEmployee()

  createProposalDetailFunction(proposal_root_id_value: string){

    

    this.inputService.createProposalDetailService(this.proposalDetailsForm.value).subscribe((response) => {

      const insertedId = response._id || response.id;

      this.projectTitle = this.proposalDetailsForm.value.project_title;

     
      if(this.proposedActionPlanItems){

        let ii = 0;

        this.proposedActionPlanItems.forEach((item_plans:any) => {

          let objectiveString = this.objectives[ii];
          let activityTitle = this.activity_title[ii];
          let activityDetails = this.activity_details[ii];
          let responsiblePersons = this.responsible_persons[ii];
          let budgetRequirements = this.budget_requirements[ii];
          let timeFrameStart = this.time_frame_start[ii];
          let timeFrameEnd = this.time_frame_end[ii];
          let proposedOutput = this.proposed_output[ii];       

          this.insertProposalActionPlan(insertedId, objectiveString, activityTitle,activityDetails, responsiblePersons, budgetRequirements, timeFrameStart, timeFrameEnd, proposedOutput);
          ii+=1;
         

        });
      }

      this.onUpdateNotification(this.notifId,"done");
      this.insertNotification("Proposal Revision Submitted", "Project Title: "+this.projectTitle+"", "/view-document-report", "Project Proposal",insertedId, "Super Admin,Admin,Employee", "new", "", this.userId,"Employee");
      this.updateProposalStatusById(proposal_root_id_value, "8");

      // Navigate to '/student-reports' after successful submission
      this.saveAuditTrailLog("User "+this.projectProposedByFullName+" submitted a proposal entitled "+this.projectTitle+"");
      Swal.fire('Successfully Submitted!','Employee Proposal Revision for '+this.projectTitle+' by '+this.projectProposedByFullName+'(Employee)','info');
      this.router.navigate(['/document-reports']);

    },(error) => {

    }); // this.inputService.createProposalDetailService


  } // createProposalDetailFunction()

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

  insertProposalActionPlan(proposalId:string, objectiveString: string, activityTitle:string, activityDetails:string, responsiblePersons: string, budgetRequirements:string,timeFrameStart: string, timeFrameEnd: string, proposedOutput:string){
  

    this.proposalActionPlan = this.fb.group({

      proposal_id: proposalId,
      objectives: objectiveString,
      activity_title: activityTitle,
      activity_details: activityDetails,
      responsible_persons: responsiblePersons,
      budget_requirements: budgetRequirements,
      time_frame_start: timeFrameStart,
      time_frame_end: timeFrameEnd,
      proposed_output: proposedOutput

    });


    this.inputService.createProposalActionPlanService(this.proposalActionPlan.value).subscribe((response) => {});

  } // insertProposalActionPlan()

  getProposalActionPlans(proposal_id: string){

    this.inputService.getProposalActionPlanService(this.router.url).subscribe((data:any)=>{

      this.proposalActionPlans = data.filter((pp_item:any)=>{

        return pp_item.proposal_id.includes(proposal_id);

      });

    
      if(this.proposalActionPlans){

        this.proposalActionPlans.forEach((p_item:any)=>{
  
          let ndx_input = this.input_field_count;
          
          this.objectives[ndx_input] = p_item.objectives;
          this.activity_title[ndx_input] = p_item.activity_title;
          this.activity_details[ndx_input] = p_item.activity_details;
          this.responsible_persons[ndx_input] = p_item.responsible_persons;
          this.budget_requirements[ndx_input] = p_item.budget_requirements;
          this.time_frame_start[ndx_input] = p_item.time_frame_start;
          this.time_frame_end[ndx_input] = p_item.time_frame_end;
          this.proposed_output[ndx_input] = p_item.proposed_output;
        
          this.onAddInput();
  
          console.log(ndx_input);

        });

       
  
     
      
      } // if this.proposalActionPlans
     

    });

 

  } // getProposalActionPlans()

  updateProposalStatusById(proposal_id:string, status_string: string){

    this.proposalDetailsForm = this.fb.group({

      _id: proposal_id,
      status: status_string

    });

    this.inputService.updateProposalService(this.proposalDetailsForm.value).subscribe((response) => {});

  } // updateProposalStatusById
  
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
