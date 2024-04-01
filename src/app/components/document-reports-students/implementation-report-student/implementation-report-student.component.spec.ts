import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationReportStudentComponent } from './implementation-report-student.component';

describe('ImplementationReportStudentComponent', () => {
  let component: ImplementationReportStudentComponent;
  let fixture: ComponentFixture<ImplementationReportStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImplementationReportStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplementationReportStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
