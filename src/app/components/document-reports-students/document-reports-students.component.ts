import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-reports-students',
  templateUrl: './document-reports-students.component.html',
  styleUrl: './document-reports-students.component.scss',
})
export class DocumentReportsStudentsComponent implements OnInit {
  administrativeRole: boolean = false;
  studentRole: boolean = false;
  employeeRole: boolean = false;
  userId: string = '';
  userDepartment: string = '';
  role_name: string = '';

  dataString: any;
  searchInput: string = '';
  all_proposal_intakes: any;
  proposalIntakeForm!: any;
  proposalIntakeForms!: any;
  proposalIntakeFormStudentUser!: any;
  proposalIntakeFormsCSCB!: any;
  proposalDetails!: any;
  userDetails!: any;
  allUsers!: any;
  filteredProposalForUser!: any;
  auditTrailForm!: any;
  implementationReports!: any;
  implementationDetails!: any;

  currentDate: Date = new Date();

  constructor(
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
      this.userDepartment = jsonString.department;

      this.saveAuditTrailLog('View Student Proposals Table');
      this.onClickAllRecords();
      this.onLoadViewIntakeProposals(this.userId);
      this.getAllUsers();
      this.onLoadAllImplementationReports();
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngAfterInit() {
    this.getAllUsers();
  }

  onLoadAllImplementationReports() {
    this.inputService
      .getImplementationService(this.router.url)
      .subscribe((data: any) => {
        this.implementationReports = data;
      });
  } // onLoadAllImplementationReports()

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

  onViewIntakeReport(projectId: string) {
    //window.open('view-document-report/'+projectId+'','_target');
    this.saveAuditTrailLog(
      'View Intake Proposal Document (ID:' + projectId + ')'
    );
    this.router.navigate(['/view-intake-proposal-report', projectId, 'none']);
  }

  onInputImplementationIntakeProposal(intake_id: string) {
    try {
      this.router.navigate(['/implementation-report-student', intake_id]);
    } catch (error) {}
  } // onInputImplementationIntakeProposal

  onLoadViewIntakeProposals(userIdFilter: string) {
    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((item: any) => {
        this.proposalIntakeForms = item;
        this.all_proposal_intakes = item;

        this.proposalIntakeForms = this.proposalIntakeForms.filter(
          (item_intakes: any) => {
            return item_intakes.proposal_root_id === '';
          }
        );

        this.proposalIntakeFormsCSCB = item;

        this.proposalIntakeForm = this.proposalIntakeForm.filter(
          (item_filter: any) => {
            return (
              item_filter.user_id.includes(userIdFilter) &&
              item_filter.proposal_root_id === ''
            );
          }
        );

        if (this.proposalIntakeForm) {
          this.proposalIntakeForm = this.sortByDate(
            this.proposalIntakeForm,
            'date_submitted',
            true
          );
        }

        if (this.proposalIntakeForms) {
          this.proposalIntakeForms = this.sortByDate(
            this.proposalIntakeForms,
            'date_submitted',
            true
          );
        }

        this.proposalIntakeFormsCSCB = this.proposalIntakeForms.filter(
          (item: any) => {
            return item.departments.includes(this.userDepartment);
          }
        );
      });
  } // onLoadViewIntakeProposals

  getLastIntakeDocumentRevision(
    proposal_root_id: string,
    criteria_string: string,
    criteria_default_value: string
  ): string {
    let return_value = '';
    let filteredProposal: any;
    let filter_count_with_proposal_root_id = 0;
    let proposal_intakes: any;

    if (this.all_proposal_intakes) {
      proposal_intakes = this.all_proposal_intakes;
      proposal_intakes = proposal_intakes.filter((p_item: any) => {
        return p_item.proposal_root_id.includes(proposal_root_id);
      });
    }

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

  getAllUsers() {
    this.inputService.getUserAccounts(this.router.url).subscribe((data) => {
      this.allUsers = data;
    });
  } // getUserDetails

  getUserDetails(user_id: string): String {
    let return_value = '';

    let user_found_count = 0;

    if (this.allUsers) {
      this.userDetails = this.allUsers.filter((item_filter: any) => {
        return item_filter._id.includes(user_id);
      });

      user_found_count = Object.keys(this.userDetails).length;

      if (user_found_count < 1) {
        return_value = ' -- User Account is Deleted -- ';
      } else {
        let firstname = this.userDetails[0].fname;
        let middlename = this.userDetails[0].mname;
        let lastname = this.userDetails[0].lname;

        let fullname = firstname + ' ' + middlename + ' ' + lastname;
        fullname = fullname.toUpperCase();

        return_value = fullname;
      }
    } // if this.userDetails

    return return_value;
  } // getUserDetails

  getUserRole(user_id: string): String {
    let return_value = '';

    this.userDetails = this.allUsers.filter((item_filter: any) => {
      return item_filter._id.includes(user_id);
    });

    let role_name = this.userDetails[0].role;

    return_value = role_name;
    return return_value;
  } // getUserRole()

  onClickAllRecords() {
    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((item: any) => {
        this.proposalIntakeForm = item;
      });
  } /// onClickAllRecords()

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

  onSearchChange() {
    if (this.searchInput === '') {
      this.onClickAllRecords();
    }
  }

  onClickSearch() {
    this.saveAuditTrailLog(
      'Search Proposals, Keyword: ' + this.searchInput.toLowerCase() + ''
    );

    this.proposalIntakeForms = this.proposalIntakeForms.filter((item: any) => {
      return (
        item.project_title
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.departments
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item.date_submmitted
          .toLowerCase()
          .includes(this.searchInput.toLowerCase()) ||
        item._id.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.venue.toLowerCase().includes(this.searchInput.toLowerCase()) ||
        item.target_beneficiary
          .toLowerCase()
          .includes(this.searchInput.toLowerCase())
      );
    });
  }

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

  onInputImplementationIntake() {}

  onAddClickProposal() {
    this.router.navigate(['project-proposal-student']);
  }
}
