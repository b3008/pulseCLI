import { Component, ViewChild, OnInit } from '@angular/core';

import { PulseCLIComponent, PulseCLIService} from '../../projects/pulse-cli/src/public-api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'cliLib';

  @ViewChild('pulse', { read: PulseCLIComponent, static: true }) pulse: PulseCLIComponent;

  ngOnInit(){
      this.pulse.commandRegistry.addCommand("about", "about this probject", "")
      .action((args, commandString,resolve, reject)=>{
          //insert a markdown container
          
      })
  }
}
