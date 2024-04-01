import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualReportsComponent } from './visual-reports.component';

describe('VisualReportsComponent', () => {
  let component: VisualReportsComponent;
  let fixture: ComponentFixture<VisualReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
