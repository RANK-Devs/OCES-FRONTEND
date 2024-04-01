import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationReportComponent } from './implementation-report.component';

describe('ImplementationReportComponent', () => {
  let component: ImplementationReportComponent;
  let fixture: ComponentFixture<ImplementationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImplementationReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplementationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
