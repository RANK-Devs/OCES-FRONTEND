import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifyUserComponent } from './certify-user.component';

describe('CertifyUserComponent', () => {
  let component: CertifyUserComponent;
  let fixture: ComponentFixture<CertifyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertifyUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertifyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
