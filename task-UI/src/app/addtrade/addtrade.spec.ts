import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addtrade } from './addtrade';

describe('Addtrade', () => {
  let component: Addtrade;
  let fixture: ComponentFixture<Addtrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addtrade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addtrade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
