import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationReportStudentEditComponent } from './implementation-report-student-edit.component';

describe('ImplementationReportStudentEditComponent', () => {
  let component: ImplementationReportStudentEditComponent;
  let fixture: ComponentFixture<ImplementationReportStudentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImplementationReportStudentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplementationReportStudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
