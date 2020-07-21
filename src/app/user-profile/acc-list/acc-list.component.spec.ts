import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccListComponent } from './acc-list.component';

describe('AccListComponent', () => {
  let component: AccListComponent;
  let fixture: ComponentFixture<AccListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
