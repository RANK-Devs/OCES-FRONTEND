import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../api.urls';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  constructor(private http: HttpClient) {}

  // Proposal Service
  createProposalService(proposalObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-proposal`,
      proposalObj
    );
  }
  createProposalDetailService(proposalDetailsObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-proposal-details`,
      proposalDetailsObj
    );
  }

  createCommunityOutreachProposal(comProposalObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-community-outreach-proposal`,
      comProposalObj
    );
  }


  createProposalActionPlanService(proposalActionObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-proposal-action-plan`,
      proposalActionObj
    );
  }

  createFileUploadService(createFileUploadObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-file-upload`,
      createFileUploadObj
    );
  }
  
  getProposalService(proposalObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-proposal`,
      proposalObj
    );
  }

  getProposalActionPlanService(proposalObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-proposal-action-plan`,
      proposalObj
    );
  }


  updateProposalService(proposalObj: any) {
    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-proposal`,
      proposalObj
    );
  }

  updateProposalStatus(proposalObj: any) {
    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-proposal-status`,
      proposalObj
    );
  }

  updateUserDetailService(userObj: any) {
    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-user`,
      userObj
    );
  }

  deleteProposalService(proposalObj: any) {
    return this.http.delete<any>(
      `${apiUrls.inputServiceApi}delete-proposal`,
      proposalObj
    );
  }

  // Implementation Service
  createImplementationService(implementationObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-implementation`,
      implementationObj
    );
  }
  getImplementationService(implementationObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-implementation`,
      implementationObj
    );
  }
  updateImplementationService(implementationObj: any) {
    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-implementation`,
      implementationObj
    );
  }
  deleteImplementationService(implementationObj: any) {
    return this.http.delete<any>(
      `${apiUrls.inputServiceApi}create-proposal`,
      implementationObj
    );
  }

  // Department Forms
  
  getDepartmentFormService(departmentObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-department`,
      departmentObj
    );
  }

  createDepartmentFormService(departmentFormObject:any){
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-department-form`,
      departmentFormObject
    );
  } 

  createNotificationService(notifObj:any){
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-notification`,
      notifObj
    );
  } 


  getUserAccounts(userAccountsObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-users`,
      userAccountsObj
    );
  }

  // Intake Forms
  createIntakeFormService(intakeFormObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-intake-form`,
      intakeFormObj
    );
  }
  getIntakeFormService(intakeFormObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-intake-form`,
      intakeFormObj
    );
  }
  getNotificationService(notifObject: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-notification`,
      notifObject
    );
  }

  getAuditTrailService(auditTrailObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-audit-trail`,
      auditTrailObj
    );
  }

  getFileUploadService(fileUploadObj: any) {
    return this.http.get<any>(
      `${apiUrls.inputServiceApi}read-file-upload`,
      fileUploadObj
    );
  }
  
  updateIntakeService(id:string) {
    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-intake`,
      id
    );
  }

  updateIntakeFormService(intakeFormObj: any) {

    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-intake-form/`,
      intakeFormObj
    );    
    

  }

  updateNotificationService(NotifObj: any) {

    return this.http.put<any>(
      `${apiUrls.inputServiceApi}update-notification/`,
      NotifObj
    );    
    

  }
  
  deleteIntakeFormService(intakeFormObj: any) {
    return this.http.delete(
      `${apiUrls.inputServiceApi}delete-intake-form`,
      intakeFormObj
    );
  }


  // AUDIT TRAIL

  createAuditTrailService(auditTrailObj: any) {
    return this.http.post<any>(
      `${apiUrls.inputServiceApi}create-audit-trail`,
      auditTrailObj
    );
  }

}
