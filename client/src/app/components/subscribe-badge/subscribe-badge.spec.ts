import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeBadge } from './subscribe-badge';

describe('SubscribeBadge', () => {
  let component: SubscribeBadge;
  let fixture: ComponentFixture<SubscribeBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
