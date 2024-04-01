import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdministrationComponent } from './account-administration.component';

describe('AccountAdministrationComponent', () => {
  let component: AccountAdministrationComponent;
  let fixture: ComponentFixture<AccountAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
