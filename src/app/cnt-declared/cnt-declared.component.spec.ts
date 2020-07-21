import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CntDeclaredComponent } from './cnt-declared.component';

describe('CntDeclaredComponent', () => {
  let component: CntDeclaredComponent;
  let fixture: ComponentFixture<CntDeclaredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CntDeclaredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CntDeclaredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
