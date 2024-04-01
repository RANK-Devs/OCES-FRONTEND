import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirmPasswordValidator';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{
 resetForm! : FormGroup;
 token! : string;

 fb = inject(FormBuilder);
 router  = inject(Router);
 authService = inject(AuthService);
 activatedRoute = inject(ActivatedRoute);

//  constructor(
//   private fb : FormBuilder,
//   private router : Router,
//   private authService : AuthService,
//   private activatedRoute : ActivatedRoute,
//   ) {}

 ngOnInit(): void {
  this.resetForm = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  },
  {
    validator: confirmPasswordValidator('password', 'confirmPassword')
  }
  )

  this.activatedRoute.params.subscribe(val => {
    this.token = val['token'];
    console.log(this.token)
  })
 }

 reset(){
  let resetObj = {
    token: this.token,
    password: this.resetForm.value.password
  }
  this.authService.resetPasswordService(resetObj)
  .subscribe({
    next: (res)=>{
      alert(res.message);
      this.resetForm.reset();
      this.router.navigate(['login']);
    },
    error: (err)=> {
      alert(err.error.message);
    }
  })
 }
}
