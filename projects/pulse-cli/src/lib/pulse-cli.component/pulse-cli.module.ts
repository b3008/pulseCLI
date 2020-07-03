import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { PulseCLIComponent } from './pulse-cli.component';
import { CommandOutputComponentModule} from '../command-output.component/command-output.module';
import { CommandLineComponentModule} from '../command-line.component/command-line.module';
@NgModule({

  declarations: [PulseCLIComponent],
  imports: [
    CommonModule,
    CommandOutputComponentModule,
    CommandLineComponentModule
  ],
  exports: [PulseCLIComponent]
})
export class PulseCLIModule { }
