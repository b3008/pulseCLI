import { Component, ViewChild, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PulseCLIComponent, PulseCLIService} from '../../projects/pulse-cli/src/public-api';
import {AboutComponent } from './about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, PulseCLIComponent]
})
export class AppComponent implements OnInit{
  title = 'PulseCLI Demo';

  @ViewChild('pulse', { read: PulseCLIComponent, static: true }) pulse: PulseCLIComponent;

  ngOnInit(){
      this.pulse.commandRegistry.addCommand("about", "about this project", "")
      .action((args, commandString,resolve, reject)=>{
          //insert a component
          this.pulse.insertComponent(AboutComponent, "about");
          resolve(this);
      })
  }
}
