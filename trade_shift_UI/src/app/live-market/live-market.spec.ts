import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMarket } from './live-market';

describe('LiveMarket', () => {
  let component: LiveMarket;
  let fixture: ComponentFixture<LiveMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveMarket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveMarket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
