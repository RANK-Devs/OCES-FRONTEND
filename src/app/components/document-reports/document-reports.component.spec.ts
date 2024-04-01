import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReportsComponent } from './document-reports.component';

describe('DocumentReportsComponent', () => {
  let component: DocumentReportsComponent;
  let fixture: ComponentFixture<DocumentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
