import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportApprovalComponent } from './proposal-report-approval.component';

describe('ProposalReportApprovalComponent', () => {
  let component: ProposalReportApprovalComponent;
  let fixture: ComponentFixture<ProposalReportApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalReportApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalReportApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
