import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { apiUrls } from '../api.urls';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  registerService(registerObj: any) {
    return this.http.post<any>(
      `${apiUrls.authServiceApi}register`,
      registerObj
    );
  }
  loginService(loginObj: any) {
    return this.http.post<any>(`${apiUrls.authServiceApi}login`, loginObj);
  }
  sendEmailService(email: string) {
    return this.http.post<any>(`${apiUrls.authServiceApi}send-email`, {
      email: email,
    });
  }
  resetPasswordService(resetObj: any) {
    return this.http.post<any>(
      `${apiUrls.authServiceApi}reset-password`,
      resetObj
    );
  }
  isLoggedIn() {
    return !!localStorage.getItem('localData');
  }
}
