import { NgModule } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CommandOutputComponent } from './command-output.component';
// import { SuggestionBoxComponentModule } from '../suggestion-box/suggestion-box.module';

import { SafeHtmlPipe } from '../safe-html';

@NgModule({
  declarations: [
    CommandOutputComponent,
    SafeHtmlPipe,
  ],
  imports: [
    // IonicModule,
    CommonModule,
    // SuggestionBoxComponentModule,
  CommonModule],
  exports:[
      CommandOutputComponent
  ]
})
export class CommandOutputComponentModule {}
