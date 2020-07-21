import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaComponent } from './fba.component';

describe('FbaComponent', () => {
  let component: FbaComponent;
  let fixture: ComponentFixture<FbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
