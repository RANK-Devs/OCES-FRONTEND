import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountAdministrationComponent } from './components/account-administration/account-administration.component';
import { AuditTrailComponent } from './components/account-administration/audit-trail/audit-trail.component';
import { UsersAccountsComponent } from './components/account-administration/users-accounts/users-accounts.component';
import { OutputAssessmentComponent } from './components/archive/output-assessment/output-assessment.component';
import { OutcomeAssessmentComponent } from './components/archive/outcome-assessment/outcome-assessment.component';
import { DocumentReportsComponent } from './components/document-reports/document-reports.component';
import { ImplementationReportComponent } from './components/document-reports/implementation-report/implementation-report.component';
import { ProjectCompilationComponent } from './components/archive/project-compilation/project-compilation.component';
import { ProposalReportStudentComponent } from './components/document-reports-students/proposal-report-student/proposal-report-student.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { VisualReportsComponent } from './components/visual-reports/visual-reports.component';
import { ProposalReportEditComponent } from './components/document-reports/proposal-report-edit/proposal-report-edit.component';
import { ProposalReportStudentEditComponent } from './components/document-reports-students/proposal-report-student-edit/proposal-report-student-edit.component';
import { ImplementationReportStudentEditComponent } from './components/document-reports-students/implementation-report-student-edit/implementation-report-student-edit.component';
import { UserEditComponent } from './components/account-administration/user-edit/user-edit.component';
import { UserRegisterComponent } from './components/account-administration/user-register/user-register.component';
import { ProposalReportApprovalComponent } from './components/approval/proposal-report-approval/proposal-report-approval.component';
import { ImplementationReportApprovalComponent } from './components/approval/implementation-report-approval/implementation-report-approval.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { OutcomeAssessmentEditComponent } from './components/archive/outcome-assessment-edit/outcome-assessment-edit.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DocumentReportsStudentsComponent } from './components/document-reports-students/document-reports-students.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { AppComponent } from './app.component';
import { ImplementationReportEditComponent } from './components/document-reports/implementation-report-edit/implementation-report-edit.component';
import { ApprovalComponent } from './components/approval/approval.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { AddDepartmentComponent } from './components/departments/add-department/add-department.component';
import { ViewDocumentReportComponent } from './components/view-document-report/view-document-report.component';
import { PrintDocumentPdfComponent } from './components/print-document-pdf/print-document-pdf.component'; 
import { ReviseDocumentReportComponent } from './components/revise-document-report/revise-document-report.component';
import { ProposalReportsComponent } from './components/document-reports/proposal-reports/proposal-reports.component';
import { UserProfileComponent } from './components/account-administration/user-profile/user-profile.component'; 
import { ViewImplementationReportComponent } from './components/view-implementation-report/view-implementation-report.component';
import { ViewIntakeProposalReportComponent } from './components/view-intake-proposal-report/view-intake-proposal-report.component';
import { ImplementationReportStudentComponent } from './components/document-reports-students/implementation-report-student/implementation-report-student.component';
import { CertifyUserComponent } from './components/account-administration/certify-user/certify-user.component';
import { ViewDocumentOutputComponent } from './view-document-output/view-document-output.component';
import { ViewDocumentOutcomeComponent } from './view-document-outcome/view-document-outcome.component';
import { ViewUploadedImagesComponent } from './components/view-uploaded-images/view-uploaded-images.component';
import { ViewUploadedPdfComponent } from './components/view-uploaded-pdf/view-uploaded-pdf.component';
import { ReviseIntakeProposalReportComponent } from './components/revise-intake-proposal-report/revise-intake-proposal-report.component';

const routes: Routes = [
  // Pages Routes
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', title: 'Login',component: LoginComponent, data: {title:'Login'} },
  {
    path: 'forget-password',
    title: 'Forget-Password',
    component: ForgetPasswordComponent,
    data: {title:'ForgetPassword'}
  },
  {
    path: 'reset/:token',
    title: 'Reset Password',
    component: ResetPasswordComponent,
    data: {title:'ResetPass'}
  },
  { path: 'register', title: 'Register', component: UserRegisterComponent, data: {title:'Register'}  },
  { path: 'user-profile', title: 'User Account Profile', component: UserProfileComponent, data: {title:'User Profile'}},
  { path: 'user-edit/:id', title: 'Edit User Account Details', component: UserEditComponent, data: {title:'Edit User Account Details'}},
  
  {
    path: '',
    title: 'Home',
    component: AppComponent,
    children: [
      { path: '', title: 'Dashboard', component: DashboardComponent, data: {title:'Dashboard'}  },
      {
        path: 'document-reports',
        title: 'Document Reports',
        component: DocumentReportsComponent,
        data: {title:'Document Reports'} 
      },
      {
        path: 'print-document-pdf/:id',
        title: 'Print Document',
        component:  PrintDocumentPdfComponent ,
        data: {title:'Print Document'} 
      },    

      {
        path: 'departments',
        title: 'Departments',
        component: DepartmentsComponent,
        data: {title:'Departments'} 
      },
      {
        path: 'add-department',
        title: 'Add Department',
        component: AddDepartmentComponent,
        data: {title:'Add Department'} 
      },
      {
        path: 'student-reports',
        title: 'Student Reports',
        component: DocumentReportsStudentsComponent,
        data: {title:'Student Reports'} 
      },
      {
        path: 'approval',
        title: 'Approval',
        component: ApprovalComponent,
        data: {title:'Approval'} 
      },
      {
        path: 'visual-reports',
        title: 'Visual Reports',
        component: VisualReportsComponent,
        data: {title:'Visual Reports'} 
      },
      { path: 'archive', title: 'Archive', component: ArchiveComponent,data: {title:'Archive'}  },
      {
        path: 'account-admin',
        title: 'Account Administration',
        component: AccountAdministrationComponent,
        data: {title:'Account Administration'} 
      },
      {
        path: 'schedule',
        title: 'Schedule Tracker',
        component: ScheduleComponent,
        data: {title:'Schedule Tracker'} 
      },
      {
        path: 'view-document-report/:id/:notif_id',
        title: 'View Document Report',
        component: ViewDocumentReportComponent,
        data: {title:'View Document Report'} 
      },
      {
        path: 'view-implementation-report/:id/:notif_id',
        title: 'View Implementation Report',
        component: ViewImplementationReportComponent,
        data: {title:'View Implementation Report'} 
      },
      {
        path: 'certify-user/:id/:notif_id',
        title: 'Certify User',
        component: CertifyUserComponent,
        data: {title:'Certify User'} 
      },
      {
        path: 'view-document-output/:id/:notif_id',
        title: 'View Output Document',
        component: ViewDocumentOutputComponent,
        data: {title:'View Output Document'} 
      },

      {
        path: 'view-document-outcome/:dept/:cat/:sy',
        title: 'View Outcome Document',
        component: ViewDocumentOutcomeComponent,
        data: {title:'View Outcome Document'} 
      },

      {
        path: 'view-intake-proposal-report/:id/:notif_id',
        title: 'View Intake Proposal Report',
        component: ViewIntakeProposalReportComponent,
        data: {title:'View Intake Proposal Report'} 
      },
      // SUB COMPONENTS
      // Document Reports Subcomponents
      // {
      //   path: 'community-profile',
      //   title: 'Community-Profile',
      //   component: CommunityProfileComponent,
      // },
      // {
      //   path: 'community-profile-edit/:id',
      //   title: 'Document Report Edit',
      //   component: CommunityProfileEditComponent,
      // },
      // {
      //   path: 'project-proposal',
      //   title: 'Project Proposal',
      //   component: ProposalReportComponent,
      // },
      {
        path: 'project-proposal-edit/:id',
        title: 'Project Proposal Edit',
        component: ProposalReportEditComponent,
        data: {title:'Edit Project Proposal'} 
      },
      {
        path: 'implementation-report/:id',
        title: 'Implementation Report',
        component: ImplementationReportComponent,
        data: {title:'Implementation Reports'} 
      },
      {
        path: 'implementation-report-edit/:id',
        title: 'Implementation Report Edit',
        component: ImplementationReportEditComponent,
        data: {title:'Edit Implementation Report'} 
      },
      {
        path: 'project-proposal-student',
        title: 'Student Project Proposal',
        component: ProposalReportStudentComponent,
        data: {title:'Student Project Proposal'} 
      },
      {
        path: 'project-proposal',
        title: 'Project Proposal',
        component: ProposalReportsComponent,
        data: {title:'Project Proposal'} 
      },
      {
        path: 'view-uploaded-images/:id',
        title: 'View Uploaded Images',
        component: ViewUploadedImagesComponent,
        data: {title:'View Uploaded Images'} 
      },
      {
        path: 'view-uploaded-pdf/:id',
        title: 'View Uploaded PDF',
        component: ViewUploadedPdfComponent,
        data: {title:'View Uploaded PDF'} 
      },
      {
        path: 'revise-document-report/:id/:notif_id',
        title: 'Revise Document Proposal',
        component: ReviseDocumentReportComponent,
        data: {title:'Revise Project Proposal'} 
      },
      {
        path: 'revise-intake-proposal-report/:id/:notif_id',
        title: 'Revise Intake Proposal',
        component: ReviseIntakeProposalReportComponent,
        data: {title:'Revise Intake Proposal'} 
      },
      {
        path: 'implementation-report-student/:id',
        title: 'Student Implementation Report',
        component: ImplementationReportStudentComponent,
        data: {title:'Student Implementation Report'} 
      },
      {
        path: 'project-proposal-student-edit/:id',
        title: 'Project Proposal Edit',
        component: ProposalReportStudentEditComponent,
      },
      {
        path: 'implementation-report-students-edit/:id',
        title: 'Implementation Report Edit',
        component: ImplementationReportStudentEditComponent,
        data: {title:'Edit Implementation Report'} 
      },
      // Approvals
      {
        path: 'proposal-approval',
        title: 'Proposal Review',
        component: ProposalReportApprovalComponent,
        data: {title:'Proposal Review'} 
      },
      {
        path: 'implementation-approval',
        title: 'Implementation Review',
        component: ImplementationReportApprovalComponent,
        data: {title:'Implementation Review'} 
      },
      // Archive
      {
        path: 'project-compilation',
        title: 'Project Compilation',
        component: ProjectCompilationComponent,
        data: {title:'Project Compilation'} 
      },
      {
        path: 'ouput-assess',
        title: 'Output Assessment',
        component: OutputAssessmentComponent,
        data: {title:'Output Assessment'} 
      },
      {
        path: 'outcome-assess', // annual is included
        title: 'Outcome Assessment',
        component: OutcomeAssessmentComponent,
        data: {title:'Outcome Assessment'} 
      },
      {
        path: 'outcome-assess/:id',
        title: 'Outcome Assessment Edit',
        component: OutcomeAssessmentEditComponent,
        data: {title:'Edit Outcome Assessment'} 
      },
      // Account Administration
      {
        path: 'audit-trail',
        title: 'Audit Trail',
        component: AuditTrailComponent,
        data: {title:'Audit Trail'} 
      },
      {
        path: 'user-accounts',
        title: 'User Accounts',
        component: UsersAccountsComponent,
        data: {title:'User Accounts'} 
      },

      // Account Edit
      {
        path: 'edit-account/:id',
        title: 'Edit User',
        component: UserEditComponent,
        data: {title:'Edit User'} 
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
