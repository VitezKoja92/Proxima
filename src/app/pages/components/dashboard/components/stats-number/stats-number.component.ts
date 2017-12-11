import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-number',
  templateUrl: './stats-number.component.html',
  styleUrls: ['./stats-number.component.scss']
})
export class StatsNumberComponent {
  @Input() statsTitle;
  @Input() stats;
}
