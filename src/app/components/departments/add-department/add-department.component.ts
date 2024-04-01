import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../../services/input.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss'
})
export class AddDepartmentComponent {

  dataString:any;
  departmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router
  ) {}

  ngOnInit() {

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
    }else{
      this.router.navigate(['/login']);
    }

    this.initializeForm();
  }
  initializeForm() {

      this.departmentForm = this.fb.group({

        department_name: ['', Validators.required],
        department_abbrev: ['', Validators.required],
        added_by: "que",
        date_time_added: new Date()
      
      });
  }

  backToDepartment() {
    this.router.navigate(['/departments']);
  }
  
  onAddDepartment() {
    this.inputService.createDepartmentFormService(this.departmentForm.value).subscribe(
      (response) => {
        console.log('Form submitted successfully:', response);
      
        // Navigate to '/departments' after successful submission
        this.router.navigate(['/departments']);
      
      },
      (error) => {
        console.error('Error submitting form:', error);
        // Handle error logic if needed
      }
    );
  }

}
