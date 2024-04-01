import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-document-reports',
  templateUrl: './document-reports.component.html',
  styleUrl: './document-reports.component.scss',
})
export class DocumentReportsComponent implements OnInit {
  userId: string = '';
  role_name: string = '';
  user_account_department: string = '';
  dataString: any;
  searchInput: string = '';
  currentDate: Date = new Date();

  auditTrailForm!: any;
  proposalDetails!: any;
  proposalDetailsCSCB!: any;
  proposalActionPlans!: any;
  proposalIntakes!: any;
  allProposals!: any;
  proposalFilterDetails!: any;
  allUsers!: any;

  userDetails!: any;
  proposal_action_plan_details!: any;

  proposalDetailsFilterByEmployeeUser!: any;
  proposalDetailsFilterByCSCBUser!: any;

  implementationReports!: any;
  implementationDetails!: any;

  constructor(
    private sharedData: SharedDataService,
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.role_name = jsonString.role;
      this.userId = jsonString._id;
      this.user_account_department = jsonString.department;

      this.saveAuditTrailLog('View Proposal Table');
      this.getAllUsers();
      this.onLoadAllProposalActionPlan();
      this.onClickAllRecords();
      this.onLoadAllNotifications();
      this.onLoadAllImplementationReports();
    } else {
      this.router.navigate(['/login']);
    }
  } // ngOnInit()

  ngAfterInit() {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.role_name = jsonString.role;
      this.userId = jsonString._id;
      this.user_account_department = jsonString.department;

      this.saveAuditTrailLog('View Proposal Table');
      this.getAllUsers();
      this.onLoadAllProposalActionPlan();
      this.onClickAllRecords();
      this.onLoadAllNotifications();
      this.onLoadAllImplementationReports();
    } else {
      this.router.navigate(['/login']);
    }
  } // ngAfterInit()

  hasProposalRootId(proposal_id: string): boolean {
    let has_proposal_root_id = false;

    this.proposalFilterDetails = this.allProposals.filter(
      (item_filter: any) => {
        return item_filter.proposal_id.includes(proposal_id);
      }
    );

    if (this.proposalFilterDetails) {
      this.proposalFilterDetails.forEach((p_item: any) => {
        if (p_item.proposal_root_id !== ' -- ') {
          has_proposal_root_id = true;
        }
      });
    }

    return has_proposal_root_id;
  } // hasProposalRootId

  getLastDocumentRevision(
    proposal_root_id: string,
    criteria_string: string,
    criteria_default_value: string
  ): string {
    let return_value = '';
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;

    if (this.allProposals) {
      this.proposalFilterDetails = this.allProposals.filter((p_item: any) => {
        return p_item.proposal_root_id.includes(proposal_root_id);
      });

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

  onLoadAllNotifications() {
    this.inputService
      .getNotificationService(this.router.url)
      .subscribe((data: any) => {
        this.sharedData.setDataArray(data);
      });
  } // onLoadAllNotifications()

  onLoadAllProposalActionPlan() {
    this.inputService
      .getProposalActionPlanService(this.router.url)
      .subscribe((data: any) => {
        this.proposalActionPlans = data;
      });
  } // onLoadAllProposalActionPlan()

  onClickAllRecords() {
    this.inputService
      .getProposalService(this.router.url)
      .subscribe((data: any) => {
        this.proposalDetails = data;
        this.allProposals = data;

        this.proposalDetails = this.proposalDetails.filter((p_item: any) => {
          return p_item.proposal_root_id === ' -- ';
        });

        this.proposalDetailsFilterByCSCBUser = this.proposalDetails.filter(
          (cscb_filter: any) => {
            return cscb_filter.proposal_root_id === ' -- ';
          }
        );

        this.proposalDetailsFilterByEmployeeUser = this.proposalDetails.filter(
          (item: any) => {
            return item.user_id.includes(this.userId);
          }
        );

        this.proposalDetailsFilterByEmployeeUser =
          this.proposalDetailsFilterByEmployeeUser.filter(
            (employee_filter: any) => {
              return employee_filter.proposal_root_id === ' -- ';
            }
          );

        // for sorting of proposal list in descending order

        if (this.proposalDetailsFilterByEmployeeUser) {
          this.proposalDetailsFilterByEmployeeUser = this.sortByDate(
            this.proposalDetailsFilterByEmployeeUser,
            'createdAt',
            true
          );
        }

        if (this.proposalDetails) {
          this.proposalDetails = this.sortByDate(
            this.proposalDetails,
            'createdAt',
            true
          );
        }

        this.proposalDetailsCSCB = this.proposalDetails.filter(
          (item_filter: any) => {
            return item_filter.sponsor_department.includes(
              this.user_account_department
            );
          }
        );

        this.proposalDetailsCSCB = this.proposalDetailsCSCB.filter(
          (item_filter: any) => {
            return item_filter.proposal_root_id === ' -- ';
          }
        );
      });
  } /// onClickAllRecords()

  onViewDocumentReport(projectId: string) {
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog('View Proposal Document (ID:' + projectId + ')');
    this.router.navigate(['/view-document-report', projectId, 'none']);
  } // onViewDocumentReport()

  onLoadAllImplementationReports() {
    this.inputService
      .getImplementationService(this.router.url)
      .subscribe((data: any) => {
        this.implementationReports = data;
      });
  } // onLoadAllImplementationReports()

  onViewImplementationReport(proposal_id: string) {
    let implementation_id = '';
    implementation_id = this.getImplementationDetails(
      proposal_id,
      'implementation_id'
    );
    this.router.navigate([
      '/view-implementation-report',
      implementation_id,
      'none',
    ]);
  } // onViewImplementationReport()

  getImplementationDetails(proposal_id: string, criteria_string: string) {
    let return_value = '';

    if (this.implementationReports) {
      this.implementationDetails = this.implementationReports.filter(
        (item: any) => {
          return item.proposal_id.includes(proposal_id);
        }
      );
    } // this.implementationReports

    if (this.implementationDetails) {
      this.implementationDetails.forEach((i_item: any) => {
        if (criteria_string === 'implementation_id') {
          return_value = i_item._id;
        }
      });
    } // this.implementationDetails

    return return_value;
  } // getImplementationDetails()

  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  getProposalStatus(statusID: string): string {
    let string_value = '';

    switch (statusID) {
      case '0':
        string_value = 'Disapproved';
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

  getAllUsers() {
    this.inputService.getUserAccounts(this.router.url).subscribe((data) => {
      this.allUsers = data;
    });
  } // getUserDetails

  getUserDetails(user_id: string): String {
    let return_value = '';

    this.userDetails = this.allUsers.filter((item_filter: any) => {
      return item_filter._id.includes(user_id);
    });

    let firstname = this.userDetails[0].fname;
    let middlename = this.userDetails[0].mname;
    let lastname = this.userDetails[0].lname;

    let fullname = firstname + ' ' + middlename + ' ' + lastname;
    fullname = fullname.toUpperCase();

    return_value = fullname;

    return return_value;
  } // getUserDetails

  getProposalActionPlanDetails(proposalId: string, criteria: string): string {
    let return_value = '';

    this.proposal_action_plan_details = this.proposalActionPlans.filter(
      (item: any) => {
        return item.proposal_id.includes(proposalId);
      }
    );

    let time_frame_start =
      this.proposal_action_plan_details[0].time_frame_start;
    let time_frame_end = this.proposal_action_plan_details[0].time_frame_end;
    let objective_string = this.proposal_action_plan_details[0].objectives;
    let activity_title = this.proposal_action_plan_details[0].activity_title;
    let activity_details =
      this.proposal_action_plan_details[0].activity_details;

    if (criteria === 'objectives') {
      return_value = time_frame_start;
    }

    if (criteria === 'time_frame_start') {
      return_value = time_frame_start;
    }

    if (criteria === 'time_frame_end') {
      return_value = time_frame_end;
    }

    return return_value;
  } // getProposalActionPlanDetails()

  onSearchChange() {
    if (this.searchInput === '') {
      this.onClickAllRecords();
    }
  }

  onClickSearch() {
    this.saveAuditTrailLog(
      'Search Proposals, Keyword: ' + this.searchInput.toLowerCase() + ''
    );

    this.proposalDetailsFilterByEmployeeUser =
      this.proposalDetailsFilterByEmployeeUser.filter((item: any) => {
        return (
          item.project_title
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          item.sponsor_department
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          item.createdAt
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          item.target_beneficiary
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      });

    this.proposalDetailsCSCB = this.proposalDetailsCSCB.filter((item: any) => {
      return (
        item.project_title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.sponsor_department
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.target_beneficiary
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    });

    this.proposalDetails = this.proposalDetails.filter((item: any) => {
      return (
        item.project_title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.sponsor_department
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.createdAt.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.target_beneficiary
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    });
  } // onClickSearch()

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

  onInputImplementationIntake() {
    try {
      this.router.navigate(['']);
    } catch (error) {}
  }

  onInputImplementationProposal(proposal_id: string) {
    try {
      this.router.navigate(['/implementation-report', proposal_id]);
    } catch (error) {}
  } // onInputImplementationProposal

  onAddClickIntake() {
    this.router.navigate(['project-proposal-student']);
  }
  onAddClickEmployeeProposal() {
    this.router.navigate(['project-proposal']);
  }
}
