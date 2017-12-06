import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsNumberComponent } from './stats-number.component';

describe('StatsNumberComponent', () => {
  let component: StatsNumberComponent;
  let fixture: ComponentFixture<StatsNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
