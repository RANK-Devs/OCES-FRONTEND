import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCompilationComponent } from './project-compilation.component';

describe('ProjectCompilationComponent', () => {
  let component: ProjectCompilationComponent;
  let fixture: ComponentFixture<ProjectCompilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCompilationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectCompilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
