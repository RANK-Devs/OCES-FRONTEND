import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDocumentPdfComponent } from './print-document-pdf.component';

describe('PrintDocumentPdfComponent', () => {
  let component: PrintDocumentPdfComponent;
  let fixture: ComponentFixture<PrintDocumentPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrintDocumentPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintDocumentPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
