import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdComponent } from './upd.component';

describe('UpdComponent', () => {
  let component: UpdComponent;
  let fixture: ComponentFixture<UpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
