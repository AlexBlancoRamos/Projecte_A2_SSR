import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanaPrincipalComponent } from './plana-principal.component';

describe('PlanaPrincipalComponent', () => {
  let component: PlanaPrincipalComponent;
  let fixture: ComponentFixture<PlanaPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanaPrincipalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanaPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
