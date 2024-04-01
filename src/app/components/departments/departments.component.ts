import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputService } from '../../services/input.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {

  dataString: any;
  searchInputValue: string = "";
  

  departmentForm!: any;
  filteredData: any;

 
  constructor(
    private fb: FormBuilder,
    private inputService: InputService,
    private router: Router
  ) {}

  ngOnInit(){

    this.dataString = localStorage.getItem('localData');
    
    if(this.dataString){
      const jsonString = JSON.parse(this.dataString);   
    }else{
      this.router.navigate(['/login']);
    }

    this.onClickAllRecords();
  }



  onAddDepartmentForm() {
    this.router.navigate(['add-department']);
  }

  onSearchDepartment(){

  
      this.departmentForm = this.departmentForm.filter((item: any) =>{           

        return item.department_abbrev.toLowerCase().includes(this.searchInputValue.toLowerCase()) ||
          item.department_name.toLowerCase().includes(this.searchInputValue.toLowerCase()) ||
          item.added_by.toLowerCase().includes(this.searchInputValue.toLowerCase()) ||
          item.date_time_added.toLowerCase().includes(this.searchInputValue.toLowerCase());

      })
           
    
    
  }

  onSearchChange(){

    if(this.searchInputValue === ""){ this.onClickAllRecords(); }

  }

  onClickAllRecords(){

    this.inputService
    .getDepartmentFormService(this.router.url)
    .subscribe((data) => (this.departmentForm = data));
  }



 

}
