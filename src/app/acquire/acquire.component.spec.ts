import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireComponent } from './acquire.component';

describe('AcquireComponent', () => {
  let component: AcquireComponent;
  let fixture: ComponentFixture<AcquireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
