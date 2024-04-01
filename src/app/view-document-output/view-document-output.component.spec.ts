import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentOutputComponent } from './view-document-output.component';

describe('ViewDocumentOutputComponent', () => {
  let component: ViewDocumentOutputComponent;
  let fixture: ComponentFixture<ViewDocumentOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDocumentOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDocumentOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
