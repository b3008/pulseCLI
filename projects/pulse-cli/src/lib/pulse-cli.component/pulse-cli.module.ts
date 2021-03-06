import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { PulseCLIComponent } from './pulse-cli.component';
import { CommandOutputComponentModule} from '../components/command-output.component/command-output.module';
import { CommandLineComponentModule } from '../components/command-line.component/command-line.module';
import { HelpItemComponent } from '../components/help-item/help-item.component'
import { PipesModule } from '../pipes.module';
import { SafeHtmlPipe } from '../safe-html';
@NgModule({

  declarations: [
    PulseCLIComponent,
    HelpItemComponent,
    // SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    CommandOutputComponentModule,
    CommandLineComponentModule,
    PipesModule

  ],
  exports: [PulseCLIComponent]
})
export class PulseCLIModule { }
