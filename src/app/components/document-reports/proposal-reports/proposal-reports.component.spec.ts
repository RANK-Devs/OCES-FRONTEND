import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalReportsComponent } from './proposal-reports.component';

describe('ProposalReportsComponent', () => {
  let component: ProposalReportsComponent;
  let fixture: ComponentFixture<ProposalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
