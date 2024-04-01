import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm!: FormGroup

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  // constructor(
  //   private fb : FormBuilder,
  //   private authService : AuthService,
  //   private router : Router
  // ) {}

  ngOnInit(): void {
      this.forgetForm = this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email] )]
      })
  }

  forgetPass(){
    this.authService.sendEmailService(this.forgetForm.value.email)
    .subscribe({
      next: (res)=>{
        Swal.fire('Please check your email',res.message);
        Swal.fire()
        this.forgetForm.reset('');
        this.router.navigate(['login']);

      },
      error: (err)=> {
        alert(err.error.message);
      }
    })
  }
}
