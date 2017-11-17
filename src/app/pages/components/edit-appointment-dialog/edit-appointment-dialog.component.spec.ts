import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentDialogComponent } from './edit-appointment-dialog.component';

describe('EditAppointmentDialogComponent', () => {
  let component: EditAppointmentDialogComponent;
  let fixture: ComponentFixture<EditAppointmentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppointmentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
