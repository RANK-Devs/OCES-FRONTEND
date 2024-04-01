import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { error } from 'console';
import { InputService } from '../../services/input.service';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public file: any = {};

  loginForm!: FormGroup;
  localStorage: any;
  userDetails!: any;
  userRestricted: boolean = false;
  userNotFound: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private inputService: InputService,
    private router: Router,
    private storage: Storage
  ) {}

  getUserDetails() {
    this.inputService
      .getUserAccounts(this.router.url)
      .subscribe((data: any) => {
        this.userDetails = data;
      });
  } //getUserDetails()

  ngOnInit(): void {
    this.getUserDetails();

    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });
  }

  chooseFile(event: any) {
    this.file = event.target.files[0];
  }

  addData() {
    const storageRef = ref(this.storage, `images/${this.file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, this.file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log('upload is' + progress + '% done');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
          console.log('File available at ', downloadURL);
        });
      }
    );
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.loginService(this.loginForm.value).subscribe({
        next: (res) => {
          // debugger;

          this.getUserDetails();

          let email = this.loginForm.value.email;
          let login_result_count = 0;

          if (this.userDetails) {
            this.userDetails = this.userDetails.filter((user_filter: any) => {
              return user_filter.email.includes(email);
            });
            this.userRestricted = this.userDetails[0].is_restricted;
            login_result_count = Object.keys(this.userDetails).length;
          }

          if (login_result_count > 0) {
            if (this.userRestricted === true) {
              Swal.fire(
                'User is deactivated, Contact administrator for more details'
              );
            } else {
              this.userNotFound = false;
              Swal.fire('Login success');
              localStorage.setItem('localData', JSON.stringify(res.data));
              this.router.navigate(['']);
              this.loginForm.reset();
            }
          } else {
            this.userNotFound = true;
          }
        },
        error: (error) => {
          this.userNotFound = true;
        },
      });
    } else {
      (err: any) => {
        Swal.fire('Error Login', err);
      };
    }
  }
}
