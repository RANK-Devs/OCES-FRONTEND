import { Component, ViewChild, ElementRef } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import jsPDF, { jsPDFAPI } from 'jspdf';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
})
export class ArchiveComponent {
  @ViewChild('content', { static: false }) el!: ElementRef;
  @ViewChild('content_output', { static: false }) el_output!: ElementRef;

  dataString: any;
  userId: string = '';
  roleName: string = '';
  user_account_department: string = '';

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
  activity_category_collections: string[] = [
    'Education and Training Programs',
    'Health and Wellness Initiatives',
    'Social Services and Support',
    'Environmental Initiatives',
    'Values and Spiritual Formation',
    'Cultural and Recreational Activities',
    'Advocacy and Awareness Campaigns',
    'Community Building and Networking',
    'Youth and Family Programs',
    'Elderly and Senior Citizen Support',
    'Disaster Relief and Emergency Response',
  ];
  sy_collections: string[] = [];

  auditTrailForm!: any;

  allProposals!: any;
  proposalDetails!: any;

  allProposalIntakes!: any;
  implementationReports!: any;
  implementationReportsFilter!: any;

  allProposedActionPlans!: any;
  proposedActionPlansFiltered!: any;

  proposalFilter!: any;
  proposalIntakeFilter!: any;
  outcomeForm!: any;
  outcomeFilter!: any;
  outcomeFilterSY!: any;

  proposalFilterDetails!: any;

  allUsers!: any;
  AllDocumentProposals!: any;
  userDetails!: any;

  selected_department_filter_outcome: string = '';
  selected_category_filter_outcome: string = '';
  selected_schoolyear_filter_outcome: string = '';

  prep_start_time!: any;
  prep_end_time!: any;

  currentDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datepipe: DatePipe
  ) {}

  initializeAuditTrail(actionTaken: string): void {
    this.auditTrailForm = this.fb.group({
      user_id: this.userId,
      role: this.roleName,
      action_taken: actionTaken,
      action_date_time: new Date(),
    });
  } // initializeAuditTrail()

  onFilterOutcome_department() {
    let proposal_id_array = [{}];

    let filter_department = this.selected_department_filter_outcome;

    this.outcomeFilter = this.allProposals.filter((item: any) => {
      return item.sponsor_department.includes(filter_department);
    });

    if (this.outcomeFilter) {
      this.outcomeFilter.forEach((o_item: any) => {
        proposal_id_array.push({
          pid: o_item._id,
        });
      });
    }

    this.implementationReportsFilter = this.implementationReports.filter(
      (i_filter: any) => {
        return proposal_id_array.some(
          (proposal_array: any) => proposal_array.pid === i_filter.proposal_id
        );
      }
    );

    this.selected_category_filter_outcome = '';
  } // onFilterOutcome_department

  onFilterOutcome_category() {
    this.implementationReportsFilter = this.implementationReports.filter(
      (i_filter: any) => {
        return i_filter.activity_category.includes(
          this.selected_category_filter_outcome
        );
      }
    );
  } // onFilterOutcome_category

  onFilterOutcome_SY() {
    let proposal_id_array = [{}];

    this.outcomeFilterSY = this.allProposals.filter((item: any) => {
      return item.for_schoolyear.includes(
        this.selected_schoolyear_filter_outcome
      );
    });

    if (this.outcomeFilterSY) {
      this.outcomeFilterSY.forEach((o_item: any) => {
        proposal_id_array.push({
          pid: o_item._id,
        });
      });
    }

    this.implementationReportsFilter = this.implementationReports.filter(
      (i_filter: any) => {
        return proposal_id_array.some(
          (proposal_array: any) => proposal_array.pid === i_filter.proposal_id
        );
      }
    );
  } // onFilterOutcome_SY

  onLoadAvailableSY() {
    if (this.allProposals) {
      this.allProposals.forEach((prop_item: any) => {
        this.sy_collections.push(prop_item.for_schoolyear);
      });
    }

    const uniqueSet = new Set(this.sy_collections);
    this.sy_collections = Array.from(uniqueSet);
  } // onLoadAvailableSY()

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

  ngOnInit(): void {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.user_account_department = jsonString.department;

      this.onViewAllProposedActionPlans();
      this.onViewAllProposals();
      this.onViewAllImplementationReports();
      this.onViewAllUsers();
    } else {
      this.router.navigate(['/login']);
    }
  } // ngOnInit()

  ngAfterInit() {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.user_account_department = jsonString.department;

      this.onViewAllProposedActionPlans();
      this.onViewAllProposals();
      this.onViewAllImplementationReports();
      this.onViewAllUsers();
    } else {
      this.router.navigate(['/login']);
    }
  } // ngAfterInit()

  getLastIntakeDocumentRevision(
    proposal_root_id: string,
    criteria_string: string,
    criteria_default_value: string
  ): string {
    let return_value = '';
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;
    let proposal_intakes: any;

    if (this.allProposalIntakes) {
      proposal_intakes = this.allProposalIntakes;

      proposal_intakes = proposal_intakes.filter((p_item_filter: any) => {
        return p_item_filter.proposal_root_id.includes(proposal_root_id);
      });
    } // this.allProposalIntakes

    if (proposal_intakes) {
      filteredProposal = proposal_intakes.slice(-1)[0];

      if (filteredProposal) {
        filter_count_with_proposal_root_id =
          Object.keys(filteredProposal).length;

        if (criteria_string === 'status') {
          return_value = this.getProposalStatus(filteredProposal.status);
        }

        if (criteria_string === 'project_title') {
          return_value = filteredProposal.project_title;
        }

        if (criteria_string === 'departments') {
          return_value = filteredProposal.departments;
        }

        if (criteria_string === 'target_area') {
          return_value = filteredProposal.target_area;
        }

        if (criteria_string === 'date_submitted') {
          return_value = filteredProposal.date_submitted;
        }

        if (criteria_string === 'proposal_id') {
          return_value = filteredProposal._id;
        }

        if (criteria_string === 'target_beneficiary') {
          return_value = filteredProposal.target_beneficiary;
        }

        if (criteria_string === 'num_beneficiary') {
          return_value = filteredProposal.num_beneficiary;
        }
      }
    } /// if proposal_intakes

    if (filter_count_with_proposal_root_id < 1) {
      if (criteria_string === 'status') {
        return_value = this.getProposalStatus(criteria_default_value);
      } else {
        return_value = criteria_default_value;
      }
    } // filter_count_with_proposal_root_id < 1

    return return_value;
  } // getLastIntakeDocumentRevision

  getLastDocumentRevision(
    proposal_root_id: string,
    criteria_string: string,
    criteria_default_value: string
  ): string {
    let return_value = '';
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;

    if (this.AllDocumentProposals) {
      this.proposalFilterDetails = this.AllDocumentProposals.filter(
        (p_item: any) => {
          return p_item.proposal_root_id.includes(proposal_root_id);
        }
      );

      if (this.proposalFilterDetails) {
        filteredProposal = this.proposalFilterDetails.slice(-1)[0];

        if (filteredProposal) {
          filter_count_with_proposal_root_id =
            Object.keys(filteredProposal).length;

          if (criteria_string === 'status') {
            return_value = this.getProposalStatus(filteredProposal.status);
          }

          if (criteria_string === 'project_title') {
            return_value = filteredProposal.project_title;
          }

          if (criteria_string === 'sponsor_department') {
            return_value = filteredProposal.sponsor_department;
          }

          if (criteria_string === 'venue') {
            return_value = filteredProposal.venue;
          }

          if (criteria_string === 'createdAt') {
            return_value = filteredProposal.createdAt;
          }

          if (criteria_string === 'proposal_id') {
            return_value = filteredProposal._id;
          }

          if (criteria_string === 'target_beneficiary') {
            return_value = filteredProposal.target_beneficiary;
          }
        }
      } /// if this.proposalFilterDetails
    } // if this.allProposals

    if (filter_count_with_proposal_root_id < 1) {
      if (criteria_string === 'status') {
        return_value = this.getProposalStatus(criteria_default_value);
      } else {
        return_value = criteria_default_value;
      }
    } // filter_count_with_proposal_root_id < 1

    return return_value;
  } // getLastDocumentRevision

  onViewAllProposals() {
    this.inputService.getProposalService(this.router.url).subscribe((data) => {
      this.allProposals = data;
      this.AllDocumentProposals = data;
    });

    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((data) => {
        this.allProposalIntakes = data;

        if (this.allProposalIntakes) {
          this.allProposalIntakes.forEach((item_intakes: any) => {
            let time_frame_end_string = this.getProposedActionPlansDetails(
              item_intakes._id
            ).time_frame_end;

            if (this.allProposals) {
              this.allProposals.push({
                proposal_root_id: item_intakes.proposal_root_id,
                _id: item_intakes._id,
                status: item_intakes.status,
                role_name: '',
                proposal_type: 'proposal_intake',
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
                revision_remarks_date_time:
                  item_intakes.revision_remarks_date_time,
                revision_by_user_id: item_intakes.revision_by_user_id,
              }); // allProposals push
            } // if isset allProposals
          });
        } // if this.allProposalIntakes

        if (this.allProposals) {
          this.allProposals = this.allProposals.filter((a_item: any) => {
            return (
              a_item.proposal_root_id === '' ||
              a_item.proposal_root_id === null ||
              a_item.proposal_root_id === undefined ||
              a_item.proposal_root_id === ' -- '
            );
          });
        } // if this.allProposals

        this.onLoadAvailableSY();
      });
  } // onViewAllProposals

  getAllProposalDetails(proposal_id: string): any {
    this.proposalDetails = [];

    if (this.allProposals) {
      this.proposalDetails = this.allProposals.filter((item: any) => {
        return item._id.includes(proposal_id);
      });
    }

    return this.proposalDetails;
  } // getAllProposalDetails

  getAllProposalDetail(proposal_id: string, criteria_string: string): string {
    let return_value = '';

    if (this.allProposals) {
      this.proposalDetails = this.allProposals.filter((item: any) => {
        return item._id.includes(proposal_id);
      });
    } // this.allProposals

    if (this.proposalDetails) {
      this.proposalDetails.forEach((item: any) => {
        if (criteria_string === 'sponsor_department') {
          return_value = item.sponsor_department;
        }

        if (criteria_string === 'for_schoolyear') {
          return_value = item.for_schoolyear;
        }

        if (criteria_string === 'for_semester') {
          return_value = item.for_semester;
        }

        if (criteria_string === 'project_title') {
          return_value = item.project_title;
        }

        if (criteria_string === 'target_period') {
          return_value = item.target_period;
        }

        if (criteria_string === 'venue') {
          return_value = item.venue;
        }

        if (criteria_string === 'time_frame_start') {
          return_value = item.time_frame_start;
        }

        if (criteria_string === 'time_frame_end') {
          return_value = item.time_frame_end;
        }

        if (criteria_string === 'target_beneficary') {
          return_value = item.target_beneficary;
        }
      });
    }

    return return_value;
  } // getAllProposalDetail

  getAllProposalDepartment(proposal_id: string): string {
    let department = '';

    if (this.allProposals) {
      this.proposalDetails = this.allProposals.filter((item: any) => {
        return item._id.includes(proposal_id);
      });
    }

    if (this.proposalDetails) {
      this.proposalDetails.forEach((item_filter: any) => {
        department = item_filter.sponsor_department;
      });
    }

    return department;
  } // getAllProposalDepartment

  onViewDocumentReport(projectId: string) {
    this.saveAuditTrailLog('View Document of Proposal (ID:' + projectId + ')');

    //window.open('view-document-report/'+projectId+'','_target');
    this.router.navigate(['/view-document-report', projectId, 'none']);
  } // onViewDocumentReport()

  onViewIntakeReport(projectId: string) {
    this.saveAuditTrailLog(
      'View Intake Proposal Document (ID:' + projectId + ')'
    );
    this.router.navigate(['/view-intake-proposal-report', projectId, 'none']);
  }

  onViewImplementationReport(implementation_id: string) {
    this.router.navigate([
      '/view-implementation-report',
      implementation_id,
      'none',
    ]);
  } // onViewImplementationReport()

  onViewDocumentOutput(proposal_id: string) {
    this.router.navigate(['/view-document-output', proposal_id, 'none']);
  } // onViewDocumentOutput

  onViewOutcome(dept: string, cat: string, sy: string) {
    if (dept === '') {
      dept = 'none';
    }

    if (cat === '') {
      cat = 'none';
    }

    if (sy === '') {
      sy = 'none';
    }

    this.router.navigate(['/view-document-outcome', dept, cat, sy]);
  } // onViewOutcome

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
  } // semesterTranslate

  getProposalStatus(statusID: string): string {
    let string_value = '';

    switch (statusID) {
      case '0':
        string_value = 'Rejected';
        break;
      case '1':
        string_value = 'Approved';
        break;
      case '2':
        string_value = 'Done';
        break;
      case '3':
        string_value = 'Pending';
        break;
      case '4':
        string_value = 'Revise';
        break;
      case '5':
        string_value = 'Implementation';
        break;
      case '6':
        string_value = 'Output';
        break;
      case '7':
        string_value = 'Outcome';
        break;
      case '8':
        string_value = 'Revision Submitted';
        break;
    }

    return string_value;
  } // getProposalStatus

  onViewAllImplementationReports() {
    this.inputService
      .getImplementationService(this.router.url)
      .subscribe((data) => {
        this.implementationReports = data;
        this.implementationReportsFilter = data;
      });
  } // onViewAllImplementationReports

  onViewAllProposedActionPlans() {
    this.inputService
      .getProposalActionPlanService(this.router.url)
      .subscribe((data) => {
        this.allProposedActionPlans = data;
      });
  } // onViewAllProposedActionPlans

  getProposedActionPlansDetails(proposal_id: string): any {
    let proposed_action_plans_filtered = [];

    if (this.allProposedActionPlans) {
      this.proposedActionPlansFiltered = this.allProposedActionPlans.filter(
        (data: any) => {
          return data.proposal_id.includes(proposal_id);
        }
      );

      proposed_action_plans_filtered = this.proposedActionPlansFiltered;
    }

    return proposed_action_plans_filtered;
  } // getProposedActionPlanDetails

  getSummaryTimeFrameFromProposedActionPlan(proposal_id: string): string {
    let timeFrameStart = '';
    let timeFrameEnd = '';
    let time_frame = '';

    let proposal_array_count = 0;

    if (this.allProposedActionPlans) {
      this.proposedActionPlansFiltered = this.allProposedActionPlans.filter(
        (data: any) => {
          return data.proposal_id.includes(proposal_id);
        }
      );

      proposal_array_count = Object.keys(
        this.proposedActionPlansFiltered
      ).length;
    }

    if (proposal_array_count > 0) {
      if (proposal_array_count > 0) {
        proposal_array_count = proposal_array_count - 1;
      }

      timeFrameStart = this.proposedActionPlansFiltered[0].time_frame_start;
      timeFrameEnd =
        this.proposedActionPlansFiltered[proposal_array_count].time_frame_end;

      timeFrameStart = String(
        this.datepipe.transform(timeFrameStart, 'MMM dd, yyyy')
      );
      timeFrameEnd = String(
        this.datepipe.transform(timeFrameEnd, 'MMM dd, yyyy')
      );

      time_frame = timeFrameStart + ' to ' + timeFrameEnd;
    }

    return time_frame;
  } // getTimeFrameEnd

  onViewAllUsers() {
    this.inputService.getUserAccounts(this.router.url).subscribe((data) => {
      this.allUsers = data;
    });
  } // onViewAllUsers

  getUserDetails(userId: string): any {
    this.userDetails = [];
    this.userDetails = this.allUsers.filter((item_filter: any) => {
      return item_filter._id.includes(userId);
    });

    return this.userDetails;
  } // getUserDetails

  getUserFullname(userId: string): string {
    let fullname = '';

    this.userDetails = [];

    if (this.allUsers) {
      this.userDetails = this.allUsers.filter((item_filter: any) => {
        return item_filter._id.includes(userId);
      });
    }

    if (this.userDetails) {
      this.userDetails.forEach((item_user: any) => {
        let fname = item_user.fname;
        let mname = item_user.mname;
        let lname = item_user.lname;

        fullname = fname + ' ' + mname + ' ' + lname;
      });
    }

    return fullname;
  } // getUserFullname

  getUserRoleName(userId: string): string {
    let role_name = '';

    this.userDetails = [];

    if (this.allUsers) {
      this.userDetails = this.allUsers.filter((item_filter: any) => {
        return item_filter._id.includes(userId);
      });
    }

    if (this.userDetails) {
      this.userDetails.forEach((item_user: any) => {
        role_name = item_user.role;
      });
    }

    return role_name;
  } // getRoleName
  getAllProposalManHours(item: any): number {
    if (item && item.prep_start_time && item.prep_end_time) {
      // Parse time frame strings into Date objects
      const prepStartTime: Date = this.parseTimeString(item.prep_start_time);
      const prepEndTime: Date = this.parseTimeString(item.prep_end_time);

      // Check if prepStartTime and prepEndTime are valid dates
      if (prepStartTime && prepEndTime) {
        // Calculate the difference in milliseconds
        const timeDiff: number = Math.abs(
          prepEndTime.getTime() - prepStartTime.getTime()
        );

        // Convert milliseconds to hours and round to the nearest whole number
        const hours: number = Math.round(timeDiff / (1000 * 60 * 60));

        // Return the calculated man-hours
        return hours;
      } else {
        console.error('Invalid preparation time data:', item);
      }
    }
    // Handle cases where item is not available or invalid
    return 0; // Or any other appropriate value
  }

  parseTimeString(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours >= 24 ||
      minutes < 0 ||
      minutes >= 60
    ) {
      console.error('Invalid time string:', timeString);
      // Return a dummy date or throw an error, depending on your preference
      return new Date(0); // Return a dummy date (January 1, 1970, 00:00:00 UTC)
      // Alternatively, you can throw an error
      // throw new Error('Invalid time string');
    }
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}
