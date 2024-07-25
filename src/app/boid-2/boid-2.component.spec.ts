import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boid2Component } from './boid-2.component';

describe('Boid2Component', () => {
  let component: Boid2Component;
  let fixture: ComponentFixture<Boid2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boid2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Boid2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
