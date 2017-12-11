import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsTodayComponent } from './appointments-today.component';

describe('AppointmentsTodayComponent', () => {
  let component: AppointmentsTodayComponent;
  let fixture: ComponentFixture<AppointmentsTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentsTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
