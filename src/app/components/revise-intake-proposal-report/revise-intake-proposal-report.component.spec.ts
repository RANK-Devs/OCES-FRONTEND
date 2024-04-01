import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviseIntakeProposalReportComponent } from './revise-intake-proposal-report.component';

describe('ReviseIntakeProposalReportComponent', () => {
  let component: ReviseIntakeProposalReportComponent;
  let fixture: ComponentFixture<ReviseIntakeProposalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviseIntakeProposalReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviseIntakeProposalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
