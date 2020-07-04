import { NgModule } from '@angular/core';
// import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CommandLineComponent } from './command-line.component';
// import { SuggestionBoxComponentModule } from '../suggestion-box/suggestion-box.module';

@NgModule({
  declarations: [
    CommandLineComponent,
  ],
  imports: [
    // IonicModule,
    CommonModule,
    // SuggestionBoxComponentModule,
  CommonModule],
  exports:[
      CommandLineComponent
  ]
})
export class CommandLineComponentModule {}
