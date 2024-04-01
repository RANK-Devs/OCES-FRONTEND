import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeAssessmentComponent } from './outcome-assessment.component';

describe('OutcomeAssessmentComponent', () => {
  let component: OutcomeAssessmentComponent;
  let fixture: ComponentFixture<OutcomeAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutcomeAssessmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutcomeAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
