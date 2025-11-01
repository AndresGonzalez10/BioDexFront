import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLogin } from './image-login';

describe('ImageLogin', () => {
  let component: ImageLogin;
  let fixture: ComponentFixture<ImageLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
