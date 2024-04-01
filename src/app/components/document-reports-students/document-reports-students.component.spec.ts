import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentReportsStudentsComponent } from './document-reports-students.component';

describe('DocumentReportsStudentsComponent', () => {
  let component: DocumentReportsStudentsComponent;
  let fixture: ComponentFixture<DocumentReportsStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentReportsStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentReportsStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
