import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIntakeProposalReportComponent } from './view-intake-proposal-report.component';

describe('ViewIntakeProposalReportComponent', () => {
  let component: ViewIntakeProposalReportComponent;
  let fixture: ComponentFixture<ViewIntakeProposalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewIntakeProposalReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewIntakeProposalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
