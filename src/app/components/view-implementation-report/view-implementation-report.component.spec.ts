import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImplementationReportComponent } from './view-implementation-report.component';

describe('ViewImplementationReportComponent', () => {
  let component: ViewImplementationReportComponent;
  let fixture: ComponentFixture<ViewImplementationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewImplementationReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewImplementationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
