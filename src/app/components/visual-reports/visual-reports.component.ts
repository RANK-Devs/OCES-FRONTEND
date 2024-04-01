import { Component, Injectable, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SharedDataService } from '../../services/shared-data.service';
import { InputService } from '../../services/input.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-visual-reports',
  templateUrl: './visual-reports.component.html',
  styleUrl: './visual-reports.component.scss',
})
export class VisualReportsComponent {
  dataString: any;
  currentDate: Date = new Date();
  auditTrailForm!: any;
  userId: string = '';
  role_name: string = '';

  allProposalIntakes!: any;
  proposalIntakeForm!: any;

  proposals_list: any;

  data_line = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 35 },
    { x: 4, y: 50 },
    { x: 5, y: 100 },
    { x: 6, y: 125 },
  ];

  data_line_two = [
    { x: 1, y: 50 },
    { x: 2, y: 30 },
    { x: 3, y: 105 },
    { x: 4, y: 5 },
    { x: 5, y: 70 },
    { x: 6, y: 69 },
  ];

  done_projects_count: number = 0;
  approved_projects_count: number = 0;

  proposal_counts!: any;

  public chartData_dps = [
    { label: 'In-Progress', value: 0 },
    { label: 'Done', value: 0 },
  ];

  public chartData_overall_report = [
    { label: 'Accepted', value: 0 },
    { label: 'Disapproved', value: 0 },
  ];

  labels: string[] = [
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

  data: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor(
    private sharedDataService: SharedDataService,
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.currentDate = new Date();
  }

  ngOnInit() {
    this.dataString = localStorage.getItem('localData');

    if (this.dataString) {
      const jsonString = JSON.parse(this.dataString);
      this.userId = jsonString._id;
      this.role_name = jsonString.role;
    } else {
      this.router.navigate(['/login']);
    }

    this.onViewAllStudentProposal();
    this.onViewAllProposalsForCount();
    this.onCountSortDepartmentProposals();

    this.saveAuditTrailLog('View Visual Reports');

    const ctx_line_graph_projects = document.getElementById(
      'lineGraph-projects'
    ) as HTMLCanvasElement;

    new Chart(ctx_line_graph_projects, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'], // Your x-axis labels
        datasets: [
          {
            label: 'Projects by Month',
            data: this.data_line, // line 1
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            // customization hereeeeeeee
          },
          {
            label: 'Projects by Month - Department',
            data: this.data_line_two, // line 2
            backgroundColor: 'rgba(225, 19, 132, 0.2)',
            borderColor: 'rgba(252, 29, 130, 1)',
            // customization hereeeeeeee for line 2
          },
        ],
      },
      // Additional options for scales, grid lines, tooltips, etc.
    });
  } // ngOnInit

  onViewAllStudentProposal() {
    this.inputService
      .getIntakeFormService(this.router.url)
      .subscribe((data: any) => {
        this.proposalIntakeForm = data;
        this.allProposalIntakes = data;
      });
  } // onViewAllStudentProposal()

  onViewAllProposalsForCount() {
    let approved_list: any;
    let done_list: any;
    let rejected_list: any;

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
            venue: item.target_area,
            createdAt: item.date_submitted,
            status: item.status,
            departments: item.departments,
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

          rejected_list = this.proposals_list.filter((item_approved: any) => {
            return item_approved.status.includes('0');
          });

          this.approved_projects_count = Object.keys(approved_list).length;
          this.done_projects_count = Object.keys(done_list).length;

          let approved_done_count = 0;
          approved_done_count =
            this.approved_projects_count + this.done_projects_count;

          let rejected_count = 0;
          rejected_count = Object.keys(rejected_list).length;

          this.generateProgressPieChart(
            this.approved_projects_count,
            this.done_projects_count
          );
          this.generateProgressPieChartAcceptedRejected(
            approved_done_count,
            rejected_count
          );
        }
      });
  } // onViewAllProposalsForCount()

  onCountSortDepartmentProposals() {
    let count_dept_details: any;
    let temp_intake_array: any;
    let temp_proposal_on_going: any;
    let temp_proposal_completed: any;
    let temp_proposal_rejected: any;
    let proposal_intake_list: any;
    let proposal_document_list: any;
    let proposal_all_list: any;

    this.proposal_counts = [];

    let sba_proposal_list: any;
    let sea_proposal_list: any;
    let sas_proposal_list: any;
    let shtm_proposal_list: any;
    let sed_proposal_list: any;
    let snams_proposal_list: any;
    let soc_proposal_list: any;
    let ccjef_proposal_list: any;
    let bed_proposal_list: any;
    let icsfi_proposal_list: any;

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

              temp_proposal_rejected = proposal_all_list.filter(
                (p_filter: any) => {
                  return (
                    p_filter.departments.includes(dept_item) &&
                    p_filter.status === '0'
                  );
                }
              );

              proposal_all_list = proposal_all_list.filter((filter_p: any) => {
                return (
                  filter_p.status === '2' ||
                  filter_p.status === '1' ||
                  filter_p.status === '0'
                );
              });

              sba_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.includes('SBA');
              });

              sas_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('sas');
              });

              sea_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('sea');
              });

              shtm_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('shtm');
              });

              sed_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('sed');
              });

              snams_proposal_list = proposal_all_list.filter(
                (p_filter: any) => {
                  return p_filter.departments.toLowerCase().includes('snams');
                }
              );

              soc_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('soc');
              });

              ccjef_proposal_list = proposal_all_list.filter(
                (p_filter: any) => {
                  return p_filter.departments.toLowerCase().includes('ccjef');
                }
              );

              bed_proposal_list = proposal_all_list.filter((p_filter: any) => {
                return p_filter.departments.toLowerCase().includes('bed');
              });

              icsfi_proposal_list = proposal_all_list.filter(
                (p_filter: any) => {
                  return p_filter.departments.toLowerCase().includes('icsfi');
                }
              );

              this.proposal_counts.push({
                departments: dept_item,
                item_count:
                  Object.keys(temp_proposal_on_going).length +
                  Object.keys(temp_proposal_completed).length,
                on_going: Object.keys(temp_proposal_on_going).length,
                completed: Object.keys(temp_proposal_completed).length,
                rejected: Object.keys(temp_proposal_rejected).length,
              });
            }

            this.proposal_counts = this.sortByDepartmentItemCount(
              this.proposal_counts,
              'item_count',
              true
            );

            let sba_proposal_number = 0;
            let sea_proposal_count = 0;
            let sas_proposal_count = 0;
            let shtm_proposal_count = 0;
            let sed_proposal_count = 0;
            let snams_proposal_count = 0;
            let soc_proposal_count = 0;
            let ccjef_proposal_count = 0;
            let bed_proposal_count = 0;
            let icsfi_proposal_count = 0;

            sba_proposal_number = Object.keys(sba_proposal_list).length;
            sea_proposal_count = Object.keys(sea_proposal_list).length;
            sas_proposal_count = Object.keys(sas_proposal_list).length;
            shtm_proposal_count = Object.keys(shtm_proposal_list).length;
            sed_proposal_count = Object.keys(sed_proposal_list).length;
            snams_proposal_count = Object.keys(snams_proposal_list).length;
            soc_proposal_count = Object.keys(soc_proposal_list).length;
            ccjef_proposal_count = Object.keys(ccjef_proposal_list).length;
            bed_proposal_count = Object.keys(bed_proposal_list).length;
            icsfi_proposal_count = Object.keys(icsfi_proposal_list).length;

            this.totalProposalCount(
              sba_proposal_number,
              sea_proposal_count,
              sas_proposal_count,
              shtm_proposal_count,
              sed_proposal_count,
              snams_proposal_count,
              soc_proposal_count,
              ccjef_proposal_count,
              bed_proposal_count,
              icsfi_proposal_count
            );
          });
      });
  } // onViewCountDepartmentProposals()

  totalProposalCount(
    sba_proposal_count: number,
    sea_proposal_count: number,
    sas_proposal_count: number,
    shtm_proposal_count: number,
    sed_proposal_count: number,
    snams_proposal_count: number,
    soc_proposal_count: number,
    ccjef_proposal_count: number,
    bed_proposal_count: number,
    icsfi_proposal_count: number
  ) {
    //  ['SBA','SEA','SAS','SHTM','SEd','SNAMS','SoC','CCJEF','BEd','ICSFI'];

    this.data = [
      sba_proposal_count,
      sea_proposal_count,
      sas_proposal_count,
      shtm_proposal_count,
      sed_proposal_count,
      snams_proposal_count,
      soc_proposal_count,
      ccjef_proposal_count,
      bed_proposal_count,
      icsfi_proposal_count,
    ];

    const ctx = document.getElementById('barChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Proposal Count',
            data: this.data,
            backgroundColor: ['#f9c20c'],
            borderColor: ['#f9c20c'],
            borderWidth: 1,
          },
        ],
      },

      options: {}, // Add custom options as needed
    });
  } // totalProposalCount()

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

  generateProgressPieChart(
    approved_projects_count: number,
    done_projects_count: number
  ) {
    this.chartData_dps = [
      { label: 'In-Progress', value: approved_projects_count },
      { label: 'Done', value: done_projects_count },
    ];

    /**

    this.chartData_dps = [
      { label: 'In-Progress', value: this.approved_projects_count },
      { label: 'Done', value: this.done_projects_count }
    ];
esesawawweewaeQAasaw
     */

    const ctx_dps = document.getElementById(
      'pieChart-department-point-system'
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
  } // generateProgressPieChart()

  generateProgressPieChartAcceptedRejected(
    approved_projects_count: number,
    rejected_projects_count: number
  ) {
    const ctx_overall_report = document.getElementById(
      'pieChart-overall-report'
    ) as HTMLCanvasElement;

    this.chartData_overall_report = [
      { label: 'Accepted', value: approved_projects_count },
      { label: 'Disapproved', value: rejected_projects_count },
    ];

    new Chart(ctx_overall_report, {
      type: 'pie',
      data: {
        labels: this.chartData_overall_report.map((d) => d.label),
        datasets: [
          {
            backgroundColor: ['#700f1d', '#f9c20c'],
            data: this.chartData_overall_report.map((d) => d.value),
          },
        ],
      },
      options: {}, // Add custom options as needed
    });
  } // generateProgressPieChart()

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
