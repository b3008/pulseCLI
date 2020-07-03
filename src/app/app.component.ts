import { Component, ViewChild } from '@angular/core';

import { PulseCLIComponent, PulseCLIService} from '../../projects/pulse-cli/src/public-api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cliLib';

  @ViewChild('pulse', {read: PulseCLIComponent}) pulse: PulseCLIComponent;

  
}
