import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputService } from '../../../services/input.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-proposal-report-edit',
  templateUrl: './proposal-report-edit.component.html',
  styleUrl: './proposal-report-edit.component.scss',
})
export class ProposalReportEditComponent {
  departments: string[] = [
    'SBA',
    'SEA',
    'SAS',
    'SEd',
    'SHTM',
    'SNAMS',
    'SoC',
    'CCJEF',
    'BEd',
  ];
  EditProposalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private inputService: InputService,
    private actRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.initializeForm();
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.inputService.getProposalService(id);
  }

  initializeForm() {
    this.EditProposalForm = this.fb.group({
      sponsor_department: ['', Validators.required],
      project_title: ['', Validators.required],
      target_beneficiary: ['', Validators.required],
      venue: ['', Validators.required],
      proposed_objective: ['', Validators.required],
      proposed_activity: ['', Validators.required],
      person_in_charged: ['', Validators.required],
      budget_requirement: ['', Validators.required],
      timeframe: ['', Validators.required],
      proposed_output: ['', Validators.required],
    });
  }
  onEditPropose() {
    this.inputService
      .updateProposalService(this.EditProposalForm.value)
      .subscribe((res) => {
        Swal.fire('Updated Successfully');
        this.EditProposalForm.reset();
        this.router.navigate(['/document-reports']);
      });
    error: () => {
      console.log('Error Update');
    };
  }
}
