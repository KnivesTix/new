import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccPaymentComponent } from './acc-payment.component';

describe('AccPaymentComponent', () => {
  let component: AccPaymentComponent;
  let fixture: ComponentFixture<AccPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
