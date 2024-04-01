import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationReportEditComponent } from './implementation-report-edit.component';

describe('ImplementationReportEditComponent', () => {
  let component: ImplementationReportEditComponent;
  let fixture: ComponentFixture<ImplementationReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImplementationReportEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImplementationReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
