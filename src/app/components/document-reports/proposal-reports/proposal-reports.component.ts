import {
  Component,
  OnInit,
  Inject,
  Injectable,
  Renderer2,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { InputService } from '../../../services/input.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { text } from 'stream/consumers';

@Component({
  selector: 'app-proposal-reports',
  templateUrl: './proposal-reports.component.html',
  styleUrl: './proposal-reports.component.scss',
})
export class ProposalReportsComponent {
  dataString: any = '';
  userId: string = '';
  role_name: string = '';
  user_account_department: string = '';
  proposed_by_fullname: string = '';
  currentDate: Date = new Date();
  sponsoring_department_collections: any[] = [];
  sponsoring_departments: string[] = [];
  sponsoring_department_string: string = '';
  s_dept: string = '';
  input_field_count: number = 1;

  studentForm!: FormGroup;
  notificationForm!: FormGroup;
  auditTrailForm!: any;
  proposalDetailsForm!: any;
  proposalActionPlan!: any;
  proposedActionPlanFields: any[] = [];
  proposedActionPlanItems: any[] = [];

  organizationTypes: string[] = ['Religious', 'Academic', 'Special Interest'];
  departmentNames: string[] = [
    '',
    'SBA',
    'SEA',
    'SAS',
    'SHTM',
    'SEd',
    'SNAMS',
    'SoC',
    'CCJEF',
    'BEd',
    'ICSFI',
  ];
  semesterData: string[] = ['1', '2', '3'];
  selectedFile: File | null = null;

  objectives: string[] = [];
  activity_title: string[] = [];
  activity_details: string[] = [];
  responsible_persons: string[] = [];
  budget_requirements: string[] = [];
  time_frame_start: string[] = [];
  time_frame_end: string[] = [];
  proposed_output: string[] = [];

  projectTitle: string = '';
  projectTargetPeriod: string = '';
  projectVenue: string = '';
  projectProposedByFullName: string = '';

  for_schoolyear: string[] = [
    '2023-2024',
    '2024-2025',
    '2025-2026',
    '2026-2027',
  ];
  for_semester: string = '';
  project_title: string = '';
  target_beneficiary: string = '';
  venue: string = '';

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private http: HttpClient,
    private renderer: Renderer2,
    private datepipe: DatePipe
  ) {
    // MIN AND MAX DATE INPUT
    // MIN DATE is Today
    // MAX DATE + 2 years from Date Today

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = String(
      this.datepipe.transform(
        new Date(today.setFullYear(today.getFullYear() + 2)),
        'yyyy-MM-dd'
      )
    );
  }

  ngOnInit() {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.role_name = jsonString.role;
      this.userId = jsonString._id;
      this.user_account_department = jsonString.department;

      this.initializeForm();
      this.saveAuditTrailLog('Proposal Form Inputs');
    } else {
      this.router.navigate(['/login']);
    }

    this.onUpdateFieldConditions();
  } // ngOnInit

  onUpdateFieldConditions() {
    this.proposedActionPlanItems.push({
      item: 'item' + this.input_field_count + '',
    });
  } // onUpdateFieldConditions for Proposed Action Plan

  onAddInput() {
    this.input_field_count += 1;
    this.onUpdateFieldConditions();
  }

  onSetObjectives(ndx: number, value_any: any) {
    this.objectives[ndx] = value_any.target.value;
  }

  onSetActivityTitle(ndx: number, value_any: any) {
    this.activity_title[ndx] = value_any.target.value;
  }

  onSetActivityDetails(ndx: number, value_any: any) {
    this.activity_details[ndx] = value_any.target.value;
  }

  onSetResponsiblePersons(ndx: number, value_any: any) {
    this.responsible_persons[ndx] = value_any.target.value;
  }

  onSetBudgetRequirements(ndx: number, value_any: any) {
    this.budget_requirements[ndx] = value_any.target.value;
  }

  onSetTimeFrameStart(ndx: number, value_any: any) {
    this.time_frame_start[ndx] = value_any.target.value;
  }

  onSetTimeFrameEnd(ndx: number, value_any: any) {
    this.time_frame_end[ndx] = value_any.target.value;
  }

  onSetProposedOutput(ndx: number, value_any: any) {
    this.proposed_output[ndx] = value_any.target.value;
  }

  onChangeSponsoringDepartment() {
    if (this.checkIfDepartmentExist(this.s_dept) == false) {
      if (this.s_dept.trim() !== '') {
        this.sponsoring_department_collections.push({ item: this.s_dept });
        this.s_dept = '';
      }
    }
  } // onChangeSponsoringDepartment()

  checkIfDepartmentExist(dept_item: string): boolean {
    let exist_dept = false;

    if (this.sponsoring_department_collections) {
      this.sponsoring_department_collections.forEach((item: any) => {
        if (item.item === dept_item) {
          exist_dept = true;
        }
      });
    }

    return exist_dept;
  } // checkIfDepartmentExist

  removeSelectedDepartment(dept_value: string) {
    this.sponsoring_department_collections =
      this.sponsoring_department_collections.filter(
        (item) => item.item !== dept_value
      );
  } // removeSelectedDepartment

  semesterTranslate(semId: string) {
    let semTranslate = '';
    switch (semId) {
      case '1':
        semTranslate = '1st Semester';
        break;
      case '2':
        semTranslate = '2nd Semester';
        break;
      case '3':
        semTranslate = 'Summer';
        break;
    }
    return semTranslate;
  }

  initializeForm() {
    this.dataString = localStorage.getItem('localData');
    const jsonString = JSON.parse(this.dataString);

    if (this.dataString) {
      this.userId = jsonString._id;
      this.role_name = jsonString.role;

      this.proposed_by_fullname =
        jsonString.fname + ' ' + jsonString.mname + ' ' + jsonString.lname;
      this.proposed_by_fullname = this.proposed_by_fullname.toUpperCase();
    } // this.dataString
  } // initializeForm

  convertArrayToStringDepartments() {
    if (this.sponsoring_department_collections) {
      this.sponsoring_department_collections.forEach((item: any) => {
        this.sponsoring_department_string += item.item + ',';
      });
    }
  } // convertArrayToStringDepartments()

  insertNotification(
    notif_title: string,
    notif_details: string,
    path_link: string,
    doc_type: string,
    doc_id: string,
    r_visibility: string,
    notif_status: string,
    send_to_id: string,
    sent_by_id: string,
    sent_by_role: string
  ) {
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
      date_time_added: new Date(),
    });

    this.inputService
      .createNotificationService(this.notificationForm.value)
      .subscribe(
        (response) => {
          console.log('Notification details submitted successfully:', response);
        },
        (error) => {
          console.error('Error saving notification details', error);
          // Handle error logic if needed
        }
      );
  } // insertNotification

  onCheck() {
    Swal.fire({
      title: 'Proceed?',
      html: `Proposed By: ${this.projectProposedByFullName}<br>
      Sponsoring Department: ${this.sponsoring_department_string}<br>
      School Year: ${this.for_schoolyear}<br>
      Semester: ${this.for_semester}<br>
      Project Title: ${this.project_title}<br>
      Venue: ${this.venue}<br>
      Target Beneficiary: ${this.target_beneficiary}<br>
      Objective: ${this.objectives}<br>
      Activity Title: ${this.activity_title}<br>
      Activity Details: ${this.activity_details}<br>
      Responsible Person: ${this.responsible_persons}<br>
      Time Frame Start: ${this.time_frame_start}<br>
      Time Frame End: ${this.time_frame_end}<br>
      Budget: ${this.budget_requirements}<br>
      Proposed Output: ${this.proposed_output}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call onProposeEmployee function if the user confirms
        this.onProposeEmployee();
      }
    });
  }

  onProposeEmployee() {
    this.convertArrayToStringDepartments();

    this.proposalDetailsForm = this.fb.group({
      proposal_root_id: ' -- ',
      user_id: this.userId,
      role_name: this.role_name,
      sponsor_department: this.sponsoring_department_string,
      for_schoolyear: this.for_schoolyear,
      for_semester: this.for_semester,
      project_title: this.project_title,
      target_beneficiary: this.target_beneficiary,
      status: '3',
      venue: this.venue,
      revision_remarks: '',
      revision_remarks_date_time: '',
      revision_by_user_id: '',
    });

    this.inputService
      .createProposalDetailService(this.proposalDetailsForm.value)
      .subscribe(
        (response) => {
          const insertedId = response._id || response.id;

          this.projectTitle = this.proposalDetailsForm.value.project_title;

          //this.insertProposalActionPlan(insertedId, "null", "null","null", "null", "null", "null", "null", "null");

          if (this.proposedActionPlanItems) {
            let ii = 0;

            this.proposedActionPlanItems.forEach((item_plans: any) => {
              let objectiveString = this.objectives[ii];
              let activityTitle = this.activity_title[ii];
              let activityDetails = this.activity_details[ii];
              let responsiblePersons = this.responsible_persons[ii];
              let budgetRequirements = this.budget_requirements[ii];
              let timeFrameStart = this.time_frame_start[ii];
              let timeFrameEnd = this.time_frame_end[ii];
              let proposedOutput = this.proposed_output[ii];

              this.insertProposalActionPlan(
                insertedId,
                objectiveString,
                activityTitle,
                activityDetails,
                responsiblePersons,
                budgetRequirements,
                timeFrameStart,
                timeFrameEnd,
                proposedOutput
              );
              ii += 1;
            });
          }

          this.insertNotification(
            'Proposal Submission',
            'Project Title: ' + this.projectTitle + '',
            '/view-document-report',
            'Project Proposal',
            insertedId,
            'Super Admin,Admin,Employee',
            'new',
            '',
            this.userId,
            'Employee'
          );

          // Navigate to '/student-reports' after successful submission
          this.saveAuditTrailLog(
            'User ' +
              this.projectProposedByFullName +
              ' submitted a proposal entitled ' +
              this.projectTitle +
              ''
          );
          Swal.fire(
            'Successfully Submitted!',
            'Employee Proposal for ' +
              this.projectTitle +
              ' by ' +
              this.projectProposedByFullName +
              '(Employee)',
            'info'
          );
          this.router.navigate(['/document-reports']);
        },
        (error) => {}
      );
  } // onProposeEmployee()

  insertProposalActionPlan(
    proposalId: string,
    objectiveString: string,
    activityTitle: string,
    activityDetails: string,
    responsiblePersons: string,
    budgetRequirements: string,
    timeFrameStart: string,
    timeFrameEnd: string,
    proposedOutput: string
  ) {
    this.proposalActionPlan = this.fb.group({
      proposal_id: proposalId,
      objectives: objectiveString,
      activity_title: activityTitle,
      activity_details: activityDetails,
      responsible_persons: responsiblePersons,
      budget_requirements: budgetRequirements,
      time_frame_start: timeFrameStart,
      time_frame_end: timeFrameEnd,
      proposed_output: proposedOutput,
    });

    this.inputService
      .createProposalActionPlanService(this.proposalActionPlan.value)
      .subscribe((response) => {});
  } // insertProposalActionPlan()

  initializeAuditTrail(actionTaken: string): void {
    let role_name_string = this.role_name;

    if (this.role_name === 'CSCB') {
      role_name_string = 'CSCB-' + this.user_account_department;
    }

    this.auditTrailForm = this.fb.group({
      user_id: this.userId,
      role: role_name_string,
      action_taken: actionTaken,
      action_date_time: new Date(),
    });
  } // initiallizeAuditTrail

  onRecordAuditTrailLogs() {
    this.inputService
      .createAuditTrailService(this.auditTrailForm.value)
      .subscribe(
        (response) => {
          console.log('Data for Audit Trail Submitted Successfully:', response);
        },
        (error) => {
          console.error('Error submitting form of Audit Trail:', error);
          // Handle error logic if needed
        }
      );
  }

  saveAuditTrailLog(actionString: string): void {
    this.initializeAuditTrail(actionString);
    this.onRecordAuditTrailLogs();
  }
}
