import { NgModule } from '@angular/core';
import { environment } from '../environment/environment';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { IconsModule } from './icon/icon.module';
import {SharedDataService} from './services/shared-data.service';
import { FullCalendarModule } from '@fullcalendar/angular'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common'; 
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentReportsComponent } from './components/document-reports/document-reports.component';
import { VisualReportsComponent } from './components/visual-reports/visual-reports.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ImplementationReportComponent } from './components/document-reports/implementation-report/implementation-report.component';
import { ProjectCompilationComponent } from './components/archive/project-compilation/project-compilation.component';
import { OutputAssessmentComponent } from './components/archive/output-assessment/output-assessment.component';
import { OutcomeAssessmentComponent } from './components/archive/outcome-assessment/outcome-assessment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthService } from './services/auth.service';
import { AccountAdministrationComponent } from './components/account-administration/account-administration.component';
import { UsersAccountsComponent } from './components/account-administration/users-accounts/users-accounts.component';
import { AuditTrailComponent } from './components/account-administration/audit-trail/audit-trail.component';
import { ProposalReportStudentComponent } from './components/document-reports-students/proposal-report-student/proposal-report-student.component';
import { ImplementationReportStudentComponent } from './components/document-reports-students/implementation-report-student/implementation-report-student.component';
import { ProposalReportEditComponent } from './components/document-reports/proposal-report-edit/proposal-report-edit.component';
import { ProposalReportStudentEditComponent } from './components/document-reports-students/proposal-report-student-edit/proposal-report-student-edit.component';
import { ImplementationReportStudentEditComponent } from './components/document-reports-students/implementation-report-student-edit/implementation-report-student-edit.component';
import { ImplementationReportEditComponent } from './components/document-reports/implementation-report-edit/implementation-report-edit.component';
import { UserEditComponent } from './components/account-administration/user-edit/user-edit.component';
import { UserRegisterComponent } from './components/account-administration/user-register/user-register.component';
import { ProposalReportApprovalComponent } from './components/approval/proposal-report-approval/proposal-report-approval.component';
import { ImplementationReportApprovalComponent } from './components/approval/implementation-report-approval/implementation-report-approval.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OutcomeAssessmentEditComponent } from './components/archive/outcome-assessment-edit/outcome-assessment-edit.component';
import { DocumentReportsStudentsComponent } from './components/document-reports-students/document-reports-students.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DepartmentsComponent } from './components/departments/departments.component';
import { AddDepartmentComponent } from './components/departments/add-department/add-department.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { ViewDocumentReportComponent } from './components/view-document-report/view-document-report.component';
import { PrintDocumentPdfComponent } from './components/print-document-pdf/print-document-pdf.component';
import { ReviseDocumentReportComponent } from './components/revise-document-report/revise-document-report.component';
import { ProposalReportsComponent } from './components/document-reports/proposal-reports/proposal-reports.component';
import { NgxPrintModule } from 'ngx-print';
import { UserProfileComponent } from './components/account-administration/user-profile/user-profile.component';
import { ViewImplementationReportComponent } from './components/view-implementation-report/view-implementation-report.component';
import { ViewIntakeProposalReportComponent } from './components/view-intake-proposal-report/view-intake-proposal-report.component';
import { CertifyUserComponent } from './components/account-administration/certify-user/certify-user.component';
import { ViewDocumentOutputComponent } from './view-document-output/view-document-output.component';
import { ViewDocumentOutcomeComponent } from './view-document-outcome/view-document-outcome.component'; 
import { NgIconsModule } from '@ng-icons/core';
import { heroUsers } from '@ng-icons/heroicons/outline';


import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore} from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ViewUploadedImagesComponent } from './components/view-uploaded-images/view-uploaded-images.component';
import { ViewUploadedPdfComponent } from './components/view-uploaded-pdf/view-uploaded-pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ReviseIntakeProposalReportComponent } from './components/revise-intake-proposal-report/revise-intake-proposal-report.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,   
    ResetPasswordComponent,
    ForgetPasswordComponent,
    SidenavComponent,
    TopnavComponent,
    DashboardComponent,
    DocumentReportsComponent,
    VisualReportsComponent,
    ScheduleComponent,
    ImplementationReportComponent,
    ProjectCompilationComponent,
    OutputAssessmentComponent,
    OutcomeAssessmentComponent,
    AccountAdministrationComponent,
    UsersAccountsComponent,
    AuditTrailComponent,
    ProposalReportStudentComponent,
    ImplementationReportStudentComponent,
    ProposalReportEditComponent,
    ProposalReportStudentEditComponent,
    ImplementationReportStudentEditComponent,
    ImplementationReportEditComponent,
    UserEditComponent,
    UserRegisterComponent,
    ProposalReportApprovalComponent,
    ImplementationReportApprovalComponent,
    OutcomeAssessmentEditComponent,
    DocumentReportsStudentsComponent,
    LayoutComponent,
    ArchiveComponent,
    ApprovalComponent,
    DepartmentsComponent,
    AddDepartmentComponent,
    ModalDialogComponent,
    ViewDocumentReportComponent,
    PrintDocumentPdfComponent,
    ReviseDocumentReportComponent,
    ProposalReportsComponent,
    UserProfileComponent,
    ViewImplementationReportComponent,
    ViewIntakeProposalReportComponent,
    CertifyUserComponent,
    ViewDocumentOutputComponent,
    ViewDocumentOutcomeComponent,
    ViewUploadedImagesComponent,
    ViewUploadedPdfComponent,
    ReviseIntakeProposalReportComponent,
  ],
  imports: [
    BrowserModule,
    IconsModule,
    NgxExtendedPdfViewerModule,
    FullCalendarModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    NgxPrintModule,
    MatDialogModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    RouterOutlet,
    BrowserAnimationsModule,
    NgxDocViewerModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    AuthService,
    SharedDataService,
    DatePipe,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
