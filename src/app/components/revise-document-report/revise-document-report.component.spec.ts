import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviseDocumentReportComponent } from './revise-document-report.component';

describe('ReviseDocumentReportComponent', () => {
  let component: ReviseDocumentReportComponent;
  let fixture: ComponentFixture<ReviseDocumentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviseDocumentReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviseDocumentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
