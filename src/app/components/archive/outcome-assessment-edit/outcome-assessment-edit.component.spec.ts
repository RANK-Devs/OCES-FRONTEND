import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomeAssessmentEditComponent } from './outcome-assessment-edit.component';

describe('OutcomeAssessmentEditComponent', () => {
  let component: OutcomeAssessmentEditComponent;
  let fixture: ComponentFixture<OutcomeAssessmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutcomeAssessmentEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutcomeAssessmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
