import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentOutcomeComponent } from './view-document-outcome.component';

describe('ViewDocumentOutcomeComponent', () => {
  let component: ViewDocumentOutcomeComponent;
  let fixture: ComponentFixture<ViewDocumentOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDocumentOutcomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDocumentOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
