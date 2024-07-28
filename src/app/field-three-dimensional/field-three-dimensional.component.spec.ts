import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldThreeDimensionalComponent } from './field-three-dimensional.component';

describe('FieldThreeDimensionalComponent', () => {
  let component: FieldThreeDimensionalComponent;
  let fixture: ComponentFixture<FieldThreeDimensionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldThreeDimensionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldThreeDimensionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
