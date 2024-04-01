import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportEditComponent } from './proposal-report-edit.component';

describe('ProposalReportEditComponent', () => {
  let component: ProposalReportEditComponent;
  let fixture: ComponentFixture<ProposalReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalReportEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
