import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appointments-today',
  templateUrl: './appointments-today.component.html',
  styleUrls: ['./appointments-today.component.scss']
})
export class AppointmentsTodayComponent {
  @Input() noAppointment;
  @Input() appointmentsToday;
  @Input() appointmentsTodayTitle;
}
