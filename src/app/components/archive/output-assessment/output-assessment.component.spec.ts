import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputAssessmentComponent } from './output-assessment.component';

describe('OutputAssessmentComponent', () => {
  let component: OutputAssessmentComponent;
  let fixture: ComponentFixture<OutputAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutputAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
