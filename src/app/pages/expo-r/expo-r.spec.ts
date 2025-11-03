import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpoR } from './expo-r';

describe('ExpoR', () => {
  let component: ExpoR;
  let fixture: ComponentFixture<ExpoR>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpoR]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpoR);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
