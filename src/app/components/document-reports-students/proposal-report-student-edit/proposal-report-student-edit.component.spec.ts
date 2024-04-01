import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportStudentEditComponent } from './proposal-report-student-edit.component';

describe('ProposalReportStudentEditComponent', () => {
  let component: ProposalReportStudentEditComponent;
  let fixture: ComponentFixture<ProposalReportStudentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalReportStudentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalReportStudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
