import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentReportComponent } from './view-document-report.component';

describe('ViewDocumentReportComponent', () => {
  let component: ViewDocumentReportComponent;
  let fixture: ComponentFixture<ViewDocumentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDocumentReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDocumentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
