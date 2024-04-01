import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../../services/input.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-proposal-report-student',
  templateUrl: './proposal-report-student.component.html',
  styleUrl: './proposal-report-student.component.scss',
})
export class ProposalReportStudentComponent implements OnInit {
  dataString: any = '';
  userId: string = '';
  role_name: string = '';
  proposed_by_fullname: string = '';
  currentDate: Date = new Date();
  sponsoring_department_collections: string = '';
  s_dept: string = '';

  studentForm!: FormGroup;
  notificationForm!: FormGroup;
  auditTrailForm!: any;
  proposalDetailsForm!: any;
  proposalIntakeForm!: any;
  organizationTypes: string[] = ['Religious', 'Academic', 'Special Interest'];
  departmentNames: string[] = [
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
  communityClassificationTypes: string[] = [
    'Outreach or Dole Out',
    'Semi-Developmental',
    'Developmental',
  ];
  semesterData: string[] = ['1', '2', '3'];
  selectedFile: File | null = null;

  projectTitle: string = '';
  projectTargetPeriod: string = '';
  projectVenue: string = '';
  projectProposedByFullName: string = '';

  date_submitted: String = '';
  project_title: String = '';
  organization_name: String = '';
  organization_type: String = '';
  organization_date_established: String = '';
  for_semester: String = '';
  for_schoolyear: String[] = [
    '2023-2024',
    '2024-2025',
    '2025-2026',
    '2026-2027',
  ];
  departments: String = '';
  contact_person: String = '';
  contact_person_position: String = '';
  contact_number: String = '';
  num_members: String = '';
  organizational_expertise: String = '';
  activity_purpose: String = '';
  reason_for_choosing_community_sector: String = '';
  target_area: String = '';
  target_date: String = '';
  target_beneficiary: String = '';
  num_beneficiary: String = '';
  classification_community_extension_project: String = '';
  adviser_name: String = '';
  adviser_date_signature: String = '';
  adviser_contact_number: String = '';
  target_objectives: String = '';
  target_activities: String = '';
  time_frame_start: String = '';
  time_frame_end: String = '';
  beneficiaries: String = '';
  budget: String = '';
  progress_indicator: String = '';
  status: String = '3'; // default status pending for intake proposal request
  revision_remarks: String = '';
  revision_remarks_date_time: String = '';
  revision_by_user_id: String = '';

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private http: HttpClient,
    private datepipe: DatePipe
  ) {
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
    this.initializeForm();
  }

  onChangeSponsoringDepartment() {
    this.sponsoring_department_collections += this.s_dept + ',';
  }

  onKeyPress(event: KeyboardEvent): void {
    // Get the pressed key
    const inputChar = String.fromCharCode(event.charCode);

    // Define the allowed characters (in this case, only numeric characters starting with 9)
    const allowedChars = /^[9][0-9]{0,9}$/;

    // Get the current input value
    const inputValue = (event.target as HTMLInputElement).value;

    // If the pressed key is not allowed, prevent the input
    if (!allowedChars.test(inputValue + inputChar)) {
      event.preventDefault();
    }
  }

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

      this.saveAuditTrailLog('Proposal Intake Form Inputs');
    }
  } // initializeForm()

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
      Project Title: ${this.project_title}<br>
      Organization Names: ${this.organization_name}<br>
      Organization Types: ${this.organization_type}<br>
      Date Established: ${this.organization_date_established}<br>
      Departments: ${this.departments}<br>
      School Year: ${this.for_schoolyear}<br>
      Semester: ${this.for_semester}<br>
      Contact Person: ${this.contact_person}<br>
      Contact Person Position: ${this.contact_person_position}<br>
      Contact Person Number: ${this.adviser_contact_number}<br>
      No. of Members: ${this.num_members}<br>
      Organization Expertise: ${this.organizational_expertise}<br>
      Activity Purpose: ${this.activity_purpose}<br>
      Reason for Choosing Sector: ${this.reason_for_choosing_community_sector}<br>
      Target: ${this.target_area}<br>
      Target Date: ${this.target_date}<br>
      Target Beneficiary: ${this.target_beneficiary}<br>
      No. of Members: ${this.classification_community_extension_project}<br>
      Adviser Name: ${this.adviser_name}<br>
      Adviser Signed Date: ${this.adviser_date_signature}<br>
      Adviser Contact Number: ${this.adviser_contact_number}<br>
      Target Objectives: ${this.target_objectives}<br>
      Activities: ${this.target_activities}<br>
      Time Frame Start: ${this.time_frame_start}<br>
      Time Frame Ends: ${this.time_frame_end}<br>
      Beneficiaries: ${this.beneficiaries}<br>
      Budget: ${this.budget}<br>
      Progress Indicator: ${this.progress_indicator}<br>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit',
    }).then((result) => {
      if (result.isConfirmed) {
        // Call onProposeEmployee function if the user confirms
        this.onProposeStudent();
      }
    });
  }
  onProposeStudent() {
    this.date_submitted = String(
      this.datepipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss')
    );

    this.proposalIntakeForm = this.fb.group({
      user_id: this.userId,
      proposal_root_id: '',
      date_submitted: this.date_submitted,
      project_title: this.project_title,
      organization_name: this.organization_name,
      organization_type: this.organization_type,
      organization_date_established: this.organization_date_established,
      for_semester: this.for_semester,
      for_schoolyear: this.for_schoolyear,
      departments: this.departments,
      contact_person: this.contact_person,
      contact_person_position: this.contact_person_position,
      contact_number: this.contact_number,
      num_members: '' + this.num_members + '',
      organizational_expertise: this.organizational_expertise,
      activity_purpose: this.activity_purpose,
      reason_for_choosing_community_sector:
        this.reason_for_choosing_community_sector,
      target_area: this.target_area,
      target_date: this.target_date,
      target_beneficiary: this.target_beneficiary,
      num_beneficiary: '' + this.num_beneficiary + '',
      classification_community_extension_project:
        this.classification_community_extension_project,
      adviser_name: this.adviser_name,
      adviser_date_signature: this.adviser_date_signature,
      adviser_contact_number: this.adviser_contact_number,
      target_objectives: this.target_objectives,
      target_activities: this.target_activities,
      time_frame_start: this.time_frame_start,
      time_frame_end: this.time_frame_end,
      beneficiaries: this.beneficiaries,
      budget: '' + this.budget + '',
      progress_indicator: this.progress_indicator,
      status: this.status,
      revision_remarks: this.revision_remarks,
      revision_remarks_date_time: this.revision_remarks_date_time,
      revision_by_user_id: this.revision_by_user_id,
    });

    console.log(this.proposalIntakeForm.value);

    this.inputService
      .createIntakeFormService(this.proposalIntakeForm.value)
      .subscribe(
        (response) => {
          const insertedId = response._id || response.id;

          this.projectTitle = this.proposalIntakeForm.value.project_title;

          this.insertNotification(
            'Proposal Intake Submission',
            'Project Title: ' + this.projectTitle + '',
            '/view-intake-proposal-report',
            'Project Proposal',
            insertedId,
            'Super Admin,Admin',
            'new',
            '',
            this.userId,
            'Student'
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
            'Student Proposal for ' +
              this.projectTitle +
              ' by ' +
              this.projectProposedByFullName +
              '(Student)',
            'info'
          );
          this.router.navigate(['/student-reports']);
        },
        (error) => {
          console.log('Form Input Error for Intake Forms');
        }
      );
  } // onProposeStudenet

  initializeAuditTrail(actionTaken: string): void {
    this.auditTrailForm = this.fb.group({
      user_id: this.userId,
      role: this.role_name,
      action_taken: actionTaken,
      action_date_time: new Date(),
    });
  }

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
