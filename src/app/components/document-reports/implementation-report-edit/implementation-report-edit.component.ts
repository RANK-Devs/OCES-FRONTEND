import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputService } from '../../../services/input.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-implementation-report-edit',
  templateUrl: './implementation-report-edit.component.html',
  styleUrl: './implementation-report-edit.component.scss',
})
export class ImplementationReportEditComponent {
  EditImplementationForm: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private inputService: InputService
  ) {}

  ngOnInit(): void {
    this.EditImplementationForm = this.fb.group({
      dateImplemented: ['', Validators.required],
      timeImplemented: ['', Validators.required],
      accomplishedObjective: ['', Validators.required],
      briefNarrative: ['', Validators.required],
      projectTopic: [''],
      activitySpeaker: [''],
      projectVolunteers: ['', Validators.required],
      designation: ['', Validators.required],
      participationType: ['', Validators.required],
      prepStartTime: ['', Validators.required],
      prepEndTime: ['', Validators.required],
      learnings: ['', Validators.required],
      projectStrengths: ['', Validators.required],
      projectWeakness: ['', Validators.required],
      projectImprovement: ['', Validators.required],
      projectCounterpart: ['', Validators.required],
      projectParticulars: ['', Validators.required],
      projectAmount: ['', Validators.required],
    });
  }

  onEditImplement() {
    this.inputService
      .updateProposalService(this.EditImplementationForm.value)
      .subscribe((res) => {
        Swal.fire('Updated Successfully');
        this.EditImplementationForm.reset();
        this.router.navigate(['/document-reports']);
      });
    error: () => {
      console.log('Error Update');
    };
  }
}

// departments: string[] = [
//   'SBA',
//   'SEA',
//   'SAS',
//   'SEd',
//   'SHTM',
//   'SNAMS',
//   'SoC',
//   'CCJEF',
//   'BEd',
// ];
// EditProposalForm!: FormGroup;

// constructor(
//   private fb: FormBuilder,
//   private router: Router,
//   private inputService: InputService,
//   private actRoute: ActivatedRoute
// ) {}
// ngOnInit() {
//   this.initializeForm();
//   const id = this.actRoute.snapshot.paramMap.get('id');
//   this.inputService.getProposalService(id);
// }

// initializeForm() {
//   this.EditProposalForm = this.fb.group({
//     sponsor_department: ['', Validators.required],
//     project_title: ['', Validators.required],
//     target_beneficiary: ['', Validators.required],
//     venue: ['', Validators.required],
//     proposed_objective: ['', Validators.required],
//     proposed_activity: ['', Validators.required],
//     person_in_charged: ['', Validators.required],
//     budget_requirement: ['', Validators.required],
//     timeframe: ['', Validators.required],
//     proposed_output: ['', Validators.required],
//   });
// }
// onEditPropose() {
//   this.inputService
//     .updateProposalService(this.EditProposalForm.value)
//     .subscribe((res) => {
//       Swal.fire('Updated Successfully');
//       this.EditProposalForm.reset();
//       this.router.navigate(['/document-reports']);
//     });
//   error: () => {
//     console.log('Error Update');
//   };
// }
