import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { PulseCLIModule } from 'pulse-cli';
import { PulseCLIModule } from '../../projects/pulse-cli/src/lib/pulse-cli.component/pulse-cli.module';
import { PipesModule } from '../../projects/pulse-cli/src/lib/pipes.module';
import { AboutComponent } from './about/about.component';




@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PulseCLIModule,
    PipesModule
  ],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule { }
