import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportStudentComponent } from './proposal-report-student.component';

describe('ProposalReportStudentComponent', () => {
  let component: ProposalReportStudentComponent;
  let fixture: ComponentFixture<ProposalReportStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalReportStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalReportStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
