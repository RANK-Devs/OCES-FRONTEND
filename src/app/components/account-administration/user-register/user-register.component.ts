import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { confirmPasswordValidator } from '../../../validators/confirmPasswordValidator';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
})
export class UserRegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fname: ['', Validators.required],
        mname: ['', Validators.required],
        lname: ['', Validators.required],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            this.emailValidator,
          ]),
        ],
        department: ['', Validators.required],
        tenure: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        role: ['', Validators.required],
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  emailValidator(
    controlMail: AbstractControl
  ): { [key: string]: boolean } | null {
    const email: string = controlMail.value;
    if (
      email &&
      !(email.endsWith('@hau.edu.ph') || email.endsWith('@student.hau.edu.ph'))
    ) {
      return { invalidEmail: true };
    }
    return null;
  }

  onRegister() {
    this.authService.registerService(this.registerForm.value).subscribe({
      next: (res) => {
        Swal.fire('User Created');
        this.registerForm.reset();
        this.router.navigate(['/account-admin']);
      },
      error: (err) => {
        console.log('i am an err');
      },
    });
    // const userRoleControl = this.registerForm.get('userRole');

    // if (userRoleControl) {
    //   const userRoleValue = userRoleControl.value;

    //   if (userRoleValue === 'Admin') {

    //   } else {
    //     console.log('error');
    //     }
    //   }
  }
}

// else if (userRoleValue === 'Employee') {
//   this.authService.employeeService(this.registerForm.value)
//   .subscribe({
//     next:(res)=>{
//       Swal.fire({
//         title: "Good job!",
//         text: "You clicked the button!",
//         icon: "success",
//       });
//       this.registerForm.reset();
//       this.router.navigate(['login']);
//     },
//     error:(err)=>{
//       console.log(err);
//     }
//   })
// } else if (userRoleValue === 'Student') {
//   this.authService.StudentService(this.registerForm.value)
//     .subscribe({
//       next:(res)=>{
//         Swal.fire("User Created");
//         this.registerForm.reset();
//         this.router.navigate(['login']);
//       },
//       error:(err)=>{
//         console.log(err);
//       }
//     })
// } else if (userRoleValue === 'Super Admin') {
//   this.authService.superAdminService(this.registerForm.value)
//     .subscribe({
//       next:(res)=>{
//         Swal.fire("User Created");
//         this.registerForm.reset();
//         this.router.navigate(['login']);
//       },
//       error:(err)=>{
//         console.log(err);
//       }
//     })
// }
