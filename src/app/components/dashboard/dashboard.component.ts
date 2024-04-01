import { InputService } from '../../services/input.service';
import {
  Component,
  Inject,
  Injectable,
  Output,
  EventEmitter,
  NgZone,
} from '@angular/core';

import { CalendarOptions, Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Chart } from 'chart.js/auto';
import { SharedDataService } from '../../services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  counter: number = 0;
  zone_data: any;

  dataString: any;
  intakeProposals: any;
  auditTrailForm!: any;
  currentDate: Date = new Date();
  month_year_now: Date = new Date();
  monthYearString: string = '';
  line_graph_year_selection: string = '';
  current_year_string: string = '';

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
  months_of_year: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  proposal_status_stats: string[] = ['Proposal', 'In Progress', 'Complete'];
  proposal_status_stats_color: string[] = [
    'rgba(246,120,65,0.5)',
    'rgba(51,189,175,0.5)',
    'rgba(201,222,90,0.5)',
  ];

  department_project_count: number[] = [];

  proposalIntakeForm!: any;
  proposalIntakesDisplay!: any;
  proposalData!: any;
  proposalDetailsEmployee!: any;

  all_proposals!: any;
  proposal_approved!: any;
  proposal_done!: any;

  data_line = [{}];
  data_line_two = [{}];

  proposalDetails!: any;
  proposalDetailsDisplay!: any;
  proposal_action_plan_details!: any;
  proposalActionPlans!: any;
  userDetails!: any;
  userDetail!: any;
  proposalFilterDetails!: any;
  allProposalIntakes!: any;
  AllDocumentProposals!: any;
  proposalCounts!: any;

  user_fname: string = '';
  user_mname: string = '';
  user_lname: string = '';
  user_tenure: string = '';
  user_department: string = '';
  user_email: string = '';

  years_proposal_collections: string[] = [];

  allUsers!: any;
  proposalDetailsFilterByCurrentUser!: any;
  proposalIntakeFilterByCurrentUser!: any;
  proposal_counts!: any;

  userId: string = '';
  roleName: string = '';

  proposals_list: any;
  intakes_list: any;

  done_projects_count: number = 0;
  approved_projects_count: number = 0;

  constructor(
    private sharedData: SharedDataService,
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datepipe: DatePipe,
    @Inject(DOCUMENT) private document: Document
  ) {} // constructor()

  public chartData_dps = [
    { label: 'In-Progress', value: 0 },
    { label: 'Done', value: 0 },
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    headerToolbar: {
      left: '', // Display navigation buttons
      center: '',
      right: '', // Remove any default buttons on the right
    },
  };

  onViewAllIntakeRecords() {
    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((data) => (this.intakeProposals = data));
  }

  ngOnInit() {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.saveAuditTrailLog('View Dashboard');
      this.onLoadAllNotifications();

      this.onLoadAllProposalActionPlan();
      this.onViewAllStudentProposal();
      this.onViewAllStudentProposalByUser(this.userId);
      this.onViewAllProposalRecords();

      this.getUserDetails();

      this.onViewAllProposalsForCount();
      this.onCountSortDepartmentProposals();
      this.generateBarGraph();
    } else {
      this.router.navigate(['/login']);
    }

    this.monthYearString = `${this.currentDate.toLocaleString('default', {
      month: 'long',
    })} ${this.currentDate.getFullYear()}`;
  } // ngOnInit()

  ngAfterInit() {
    this.dataString = localStorage.getItem('localData');

    this.current_year_string = String(
      this.datepipe.transform(new Date(), 'yyyy')
    );

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.userId = jsonString._id;
      this.roleName = jsonString.role;
      this.saveAuditTrailLog('View Dashboard');
      this.onLoadAllNotifications();

      this.onLoadAllProposalActionPlan();
      this.onViewAllStudentProposal();
      this.onViewAllStudentProposalByUser(this.userId);
      this.onViewAllProposalRecords();

      this.getUserDetails();

      this.onViewAllProposalsForCount();
      this.onCountSortDepartmentProposals();
      this.onViewLineGraph(this.current_year_string);
      this.generateBarGraph();
    } else {
      this.router.navigate(['/login']);
    }
  } // ngAfterInit()

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

  generateBarGraph() {
    let labels: string[] = [
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

    let data_department: number[] = [];
    let data_organization: number[] = [];

    let proposal_document_list: any;
    let proposal_all_list: any;

    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((response: any) => {
        proposal_all_list = response;

        this.inputService
          .getProposalService(this.router.url)
          .subscribe((response: any) => {
            proposal_document_list = response;

            for (const p_document of proposal_document_list) {
              proposal_all_list.push({
                _id: p_document._id,
                user_id: p_document.user_id,
                departments: p_document.sponsor_department,
                target_beneficiary: p_document.target_beneficiary,
                status: p_document.status,
              });
            }

            for (const dept_label of labels) {
              if (this.proposals_list) {
                let proposals_department_array = [];
                let proposals_department_count = 0;

                let proposals_organization_array = [];
                let proposals_organization_count = 0;

                proposals_department_array = proposal_all_list.filter(
                  (pl_item: any) => {
                    return pl_item.departments.includes(dept_label);
                  }
                );

                proposals_organization_array = proposal_all_list.filter(
                  (pl_item: any) => {
                    return pl_item.departments.includes(dept_label);
                  }
                );

                proposals_department_count = Object.keys(
                  proposals_department_array
                ).length;
                proposals_organization_count = Object.keys(
                  proposals_organization_array
                ).length;

                data_department.push(proposals_department_count);
                data_organization.push(proposals_organization_count);
              }
            }
          });
      });

    const ctx = document.getElementById(
      'barChartOverallReport'
    ) as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Department',
            data: data_department,
            backgroundColor: ['#700f1d', '#700f1d'],
            borderColor: ['#700f1d', '#700f1d'],
            borderWidth: 1,
          },
          {
            label: 'Organization',
            data: data_organization,
            backgroundColor: ['#f9c20c', '#f9c20c'],
            borderColor: ['#f9c20c', '#f9c20c'],
            borderWidth: 1,
          },
        ],
      },

      options: {}, // Add custom options as needed
    });
  } // generateBarGraph

  line_proposed_filter_by_year() {
    this.onViewLineGraph(this.line_graph_year_selection);
  } // line_proposed_filter_by_yea

  onViewLineGraph(current_year_value: string) {
    const project_numbers: number[] = [];
    var project_numbers_by_month: number[][] = [[]];

    const ctx_line_graph_projects = document.getElementById(
      'lineGraph-projects'
    ) as HTMLCanvasElement;

    let ChartGraph = new Chart(ctx_line_graph_projects, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ], // Your x-axis labels

        datasets: [
          {
            label: '',
            data: [{}], // line 1
            backgroundColor: 'rgba(255, 99, 132, 0.0)',
            borderColor: 'rgba(255, 99, 132, 0)',
          },
        ],
      },
      // Additional options for scales, grid lines, tooltips, etc.
    });

    //ChartGraph.data.labels?.push("");

    if (this.years_proposal_collections) {
      if (this.proposals_list) {
        for (const proposal_data of this.proposals_list) {
          var year_value = String(
            this.datepipe.transform(proposal_data.createdAt, 'YYYY')
          );
          this.years_proposal_collections.push(year_value);
        }

        const unique_years_array = new Set(this.years_proposal_collections);
        this.years_proposal_collections = Array.from(unique_years_array);
      }
    } // if this.years_proposal_collections

    let proposed_list_count: Number[] = [];
    let inprogress_list_count: Number[] = [];
    let completed_list_count: Number[] = [];

    let proposed_list_array: any;
    let inprogress_list_array: any;
    let completed_list_array: any;

    if (this.proposals_list) {
      for (var m = 0; m < 12; m++) {
        let month_number = m + 1;

        proposed_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('3') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(current_year_value)
          );
        });

        inprogress_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('1') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(current_year_value)
          );
        });

        completed_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('2') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(current_year_value)
          );
        });

        if (proposed_list_array) {
          proposed_list_count[m] = Object.keys(proposed_list_array).length;
        }

        if (inprogress_list_array) {
          inprogress_list_count[m] = Object.keys(inprogress_list_array).length;
        }

        if (completed_list_array) {
          completed_list_count[m] = Object.keys(completed_list_array).length;
        }
      }
    }

    //proposed_list_count = Object.keys(proposed_list_array).length;

    this.proposal_status_stats.forEach((item, index) => {
      // x: Month Label
      // y: No. of Projects

      this.data_line = [];

      if (item === 'Proposal') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: proposed_list_count[mm],
          });
        }
      }

      if (item === 'In Progress') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: inprogress_list_count[mm],
          });
        }
      }

      if (item === 'Complete') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: completed_list_count[mm],
          });
        }
      }

      ChartGraph.data.datasets.push({
        label: item,
        data: this.data_line,
        backgroundColor: this.proposal_status_stats_color[index],
        borderColor: this.proposal_status_stats_color[index],
      });
    });
  } // onViewLineGraph()

  onViewLineGraph2() {
    const ctx_line_graph_projects = document.getElementById(
      'lineGraph-projects'
    ) as HTMLCanvasElement;

    let ChartGraph = new Chart(ctx_line_graph_projects, {
      type: 'line',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ], // Your x-axis labels

        datasets: [
          {
            label: '',
            data: [{}], // line 1
            backgroundColor: 'rgba(255, 99, 132, 0.0)',
            borderColor: 'rgba(255, 99, 132, 0)',
          },
        ],
      },
      // Additional options for scales, grid lines, tooltips, etc.
    });

    //ChartGraph.data.labels?.push("");

    if (this.years_proposal_collections) {
      if (this.proposals_list) {
        for (const proposal_data of this.proposals_list) {
          var year_value = String(
            this.datepipe.transform(proposal_data.createdAt, 'YYYY')
          );
          this.years_proposal_collections.push(year_value);
        }

        const unique_years_array = new Set(this.years_proposal_collections);
        this.years_proposal_collections = Array.from(unique_years_array);
      }
    } // if this.years_proposal_collections

    let proposed_list_count: Number[] = [];
    let inprogress_list_count: Number[] = [];
    let completed_list_count: Number[] = [];

    let proposed_list_array: any;
    let inprogress_list_array: any;
    let completed_list_array: any;

    if (this.proposals_list) {
      for (var m = 0; m < 12; m++) {
        let month_number = m + 1;

        proposed_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('3') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(this.line_graph_year_selection)
          );
        });

        inprogress_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('1') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(this.line_graph_year_selection)
          );
        });

        completed_list_array = this.proposals_list.filter((p_item: any) => {
          return (
            p_item.status.includes('2') &&
            this.datepipe
              .transform(p_item.createdAt, 'MM')
              ?.includes(String(month_number)) &&
            this.datepipe
              .transform(p_item.createdAt, 'YYYY')
              ?.includes(this.line_graph_year_selection)
          );
        });

        if (proposed_list_array) {
          proposed_list_count[m] = Object.keys(proposed_list_array).length;
        }

        if (inprogress_list_array) {
          inprogress_list_count[m] = Object.keys(inprogress_list_array).length;
        }

        if (completed_list_array) {
          completed_list_count[m] = Object.keys(completed_list_array).length;
        }
      }
    }

    //proposed_list_count = Object.keys(proposed_list_array).length;

    this.proposal_status_stats.forEach((item, index) => {
      // x: Month Label
      // y: No. of Projects

      this.data_line = [];

      if (item === 'Proposal') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: proposed_list_count[mm],
          });
        }
      }

      if (item === 'In Progress') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: inprogress_list_count[mm],
          });
        }
      }

      if (item === 'Complete') {
        for (var mm = 0; mm < 12; mm++) {
          this.data_line.push({
            x: mm + 1,
            y: completed_list_count[mm],
          });
        }
      }

      ChartGraph.data.datasets.push({
        label: item,
        data: this.data_line,
        backgroundColor: this.proposal_status_stats_color[index],
        borderColor: this.proposal_status_stats_color[index],
      });
    });
  } // onViewLineGraph()

  addCounter(iteration_count: number) {
    this.counter += iteration_count;
  } // addCounter

  getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getUserDetails() {
    this.inputService
      .getUserAccounts(this.router.url)
      .subscribe((data: any) => {
        this.userDetails = data;

        this.userDetail = this.userDetails.filter((item: any) => {
          return item._id.includes(this.userId);
        });

        this.user_fname = this.userDetail[0].fname;
        this.user_mname = this.userDetail[0].mname;
        this.user_lname = this.userDetail[0].lname;
        this.user_email = this.userDetail[0].email;
        this.user_department = this.userDetail[0].department;
        this.user_tenure = this.userDetail[0].tenure;
      });
  } // getUserDetails()

  sortByDate(data: any[], property: string, descending = false): any[] {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDate

  onLoadAllProposalActionPlan() {
    this.inputService
      .getProposalActionPlanService(this.router.url)
      .subscribe((data: any) => {
        this.proposalActionPlans = data;
      });
  } // onLoadAllProposalActionPlan()

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

    if (criteria === 'objectives') {
      return_value = objective_string;
    }

    if (criteria === 'activity_title') {
      return_value = activity_title;
    }

    if (criteria === 'activity_details') {
      return_value = activity_details;
    }

    return return_value;
  } // getProposalActionPlanDetails()

  onViewAllProposalsForCount() {
    let approved_list: any;
    let done_list: any;

    this.inputService
      .getProposalService(this.router.url)
      .subscribe((data: any) => {
        this.proposals_list = data;

        // alert(Object.keys(this.proposalIntakeForm).length);

        this.proposalIntakeForm.forEach((item: any) => {
          this.proposals_list.push({
            proposal_root_id: item.proposal_root_id,
            proposal_type: 'proposal_intake',
            project_title: item.project_title,
            target_beneficiary: item.target_beneficiary,
            target_period: item.target_date,
            sponsor_department: item.departments,
            venue: item.target_area,
            createdAt: item.date_submitted,
            status: item.status,
            revision_remarks: item.revision_remarks,
            revision_remarks_date_time: item.revision_remarks_date_time,
            revision_by_user_id: item.revision_by_user_id,
          });
        });

        if (this.proposals_list) {
          done_list = this.proposals_list.filter((item_done: any) => {
            return item_done.status.includes('2');
          });

          approved_list = this.proposals_list.filter((item_approved: any) => {
            return item_approved.status.includes('1');
          });

          this.approved_projects_count = Object.keys(approved_list).length;
          this.done_projects_count = Object.keys(done_list).length;

          this.generateProgressChart(
            this.approved_projects_count,
            this.done_projects_count
          );

          this.onViewLineGraph(this.current_year_string);
        }
      });
  } // onViewAllProposalsForCount()

  onCountSortDepartmentProposals() {
    let count_dept_details: any;
    let temp_intake_array: any;
    let temp_proposal_on_going: any;
    let temp_proposal_completed: any;
    let proposal_intake_list: any;
    let proposal_document_list: any;
    let proposal_all_list: any;

    this.proposal_counts = [];

    let department_list: any[] = [
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

    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((response: any) => {
        proposal_all_list = response;

        this.inputService
          .getProposalService(this.router.url)
          .subscribe((response: any) => {
            proposal_document_list = response;

            for (const p_document of proposal_document_list) {
              proposal_all_list.push({
                _id: p_document._id,
                user_id: p_document.user_id,
                departments: p_document.sponsor_department,
                target_beneficiary: p_document.target_beneficiary,
                status: p_document.status,
              });
            }

            for (const dept_item of department_list) {
              temp_intake_array = [];

              temp_intake_array = proposal_all_list.filter((p_filter: any) => {
                return (
                  p_filter.departments.includes(dept_item) ||
                  p_filter.status === '1' ||
                  p_filter.status === '2'
                );
              });

              temp_proposal_on_going = proposal_all_list.filter(
                (p_filter: any) => {
                  return (
                    p_filter.departments.includes(dept_item) &&
                    p_filter.status === '1'
                  );
                }
              );

              temp_proposal_completed = proposal_all_list.filter(
                (p_filter: any) => {
                  return (
                    p_filter.departments.includes(dept_item) &&
                    p_filter.status === '2'
                  );
                }
              );

              this.proposal_counts.push({
                departments: dept_item,
                item_count:
                  Object.keys(temp_proposal_on_going).length +
                  Object.keys(temp_proposal_completed).length,
                on_going: Object.keys(temp_proposal_on_going).length,
                completed: Object.keys(temp_proposal_completed).length,
              });
            }

            this.proposal_counts = this.sortByDepartmentItemCount(
              this.proposal_counts,
              'item_count',
              true
            );
          });
      });
  } // onViewCountDepartmentProposals()

  sortByDepartmentItemCount(
    data: any[],
    property: string,
    descending: boolean = true
  ) {
    return data.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return descending ? comparison * -1 : comparison;
    });
  } // sortByDepartmentItemCount()

  onViewAllProposalRecords() {
    this.inputService
      .getProposalService(this.router.url)
      .subscribe((data: any) => {
        this.proposalDetails = data;
        this.proposalDetailsDisplay = data;
        this.AllDocumentProposals = data;

        this.proposalIntakeForm.forEach((item: any) => {
          this.proposalDetailsDisplay.push({
            proposal_root_id: item.proposal_root_id,
            proposal_type: 'proposal_intake',
            project_title: item.project_title,
            target_beneficiary: item.target_beneficiary,
            target_period: item.target_date,
            venue: item.target_area,
            createdAt: item.date_submitted,
            status: item.status,
            revision_remarks: item.revision_remarks,
            revision_remarks_date_time: item.revision_remarks_date_time,
            revision_by_user_id: item.revision_by_user_id,
          });
        });

        this.proposalDetailsDisplay = this.proposalDetailsDisplay.filter(
          (p_item_filter: any) => {
            return (
              p_item_filter.proposal_root_id === '' ||
              p_item_filter.proposal_root_id === null ||
              p_item_filter.proposal_root_id === undefined ||
              p_item_filter.proposal_root_id === ' -- '
            );
          }
        );

        if (this.proposalDetails) {
          this.proposalDetailsFilterByCurrentUser = this.proposalDetails.filter(
            (item: any) => {
              return item.user_id === this.userId;
            }
          );

          this.proposalDetailsFilterByCurrentUser =
            this.proposalDetailsFilterByCurrentUser.filter((item: any) => {
              return (
                item.proposal_root_id === '' ||
                item.proposal_root_id === ' -- ' ||
                item.proposal_root_id === undefined ||
                item.proposal_root_id == null
              );
            });
        } // if this.proposalDetails

        let all_proposal_intakes: any;

        this.inputService
          .getIntakeFormService(this.router.url)
          .subscribe((data) => {
            all_proposal_intakes = data;

            all_proposal_intakes.forEach((item_intake: any) => {
              this.all_proposals.push({
                proposal_root_id: item_intake.proposal_root_id,
                proposal_type: 'proposal_intake',
                project_title: item_intake.project_title,
                target_beneficiary: item_intake.target_beneficiary,
                target_period: item_intake.target_date,
                venue: item_intake.target_area,
                createdAt: item_intake.date_submitted,
                status: item_intake.status,
                revision_remarks: item_intake.revision_remarks,
                revision_remarks_date_time:
                  item_intake.revision_remarks_date_time,
                revision_by_user_id: item_intake.revision_by_user_id,
              });
            });

            this.proposal_done = this.all_proposals.filter((item: any) => {
              return item.status.includes('2');
            });

            this.proposal_approved = this.all_proposals.filter((item: any) => {
              return item.status.includes('1');
            });

            this.done_projects_count = Object.keys(this.proposal_done).length;
            this.approved_projects_count = Object.keys(
              this.proposal_approved
            ).length;
          }); // getIntakeFormService for all_proposal_intakes

        this.proposalDetails = this.sortByDate(
          this.proposalDetails,
          'createdAt',
          true
        );

        if (this.proposalDetailsFilterByCurrentUser) {
          this.proposalDetailsFilterByCurrentUser = this.sortByDate(
            this.proposalDetailsFilterByCurrentUser,
            'createdAt',
            true
          );
        }
      });
  } /// onViewAllProposalRecords()

  generateProgressChart(approved_projects: number, done_projects: number) {
    this.chartData_dps = [
      { label: 'In-Progress', value: approved_projects },
      { label: 'Done', value: done_projects },
    ];

    const ctx_dps = document.getElementById(
      'pieChart-progress-report'
    ) as HTMLCanvasElement;

    new Chart(ctx_dps, {
      type: 'pie',
      data: {
        labels: this.chartData_dps.map((d) => d.label),
        datasets: [
          {
            backgroundColor: ['#700f1d', '#f9c20c'],
            data: this.chartData_dps.map((d) => d.value),
          },
        ],
      },
      options: {}, // Add custom options as needed
    });
  } // generateProgressChart()

  onViewAllStudentProposal() {
    this.proposalIntakeForm = this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((data: any) => {
        this.proposalIntakeForm = data;
        this.allProposalIntakes = data;
      });
  } // onViewAllStudentProposal()

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

  onViewAllStudentProposalByUser(user_id_student: string) {} // onViewAllStudentProposalByUser()

  onViewDocumentReport(projectId: string) {
    this.router.navigate(['/view-document-report', projectId, 'notif']);
  } // onViewDocumentReport()

  onLoadAllNotifications() {
    this.inputService
      .getNotificationService(this.router.url)
      .subscribe((data: any) => {
        this.sharedData.setDataArray(data);
      });
  } // onLoadAllNotifications()

  onViewDocumentReports() {
    this.router.navigate(['/document-reports']);
  } // onViewDocumentReports()

  initializeAuditTrail(actionTaken: string): void {
    this.auditTrailForm = this.fb.group({
      user_id: this.userId,
      role: this.roleName,
      action_taken: actionTaken,
      action_date_time: new Date(),
    });
  } // initializeAuditTrail()

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
