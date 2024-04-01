import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadedImagesComponent } from './view-uploaded-images.component';

describe('ViewUploadedImagesComponent', () => {
  let component: ViewUploadedImagesComponent;
  let fixture: ComponentFixture<ViewUploadedImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUploadedImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewUploadedImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
