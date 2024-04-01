import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadedPdfComponent } from './view-uploaded-pdf.component';

describe('ViewUploadedPdfComponent', () => {
  let component: ViewUploadedPdfComponent;
  let fixture: ComponentFixture<ViewUploadedPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUploadedPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUploadedPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
