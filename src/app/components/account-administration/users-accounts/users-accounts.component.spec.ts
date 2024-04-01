import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAccountsComponent } from './users-accounts.component';

describe('UsersAccountsComponent', () => {
  let component: UsersAccountsComponent;
  let fixture: ComponentFixture<UsersAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
