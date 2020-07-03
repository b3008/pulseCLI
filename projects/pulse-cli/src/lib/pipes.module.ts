import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safe-html';
import { CommonModule } from '@angular/common'
@NgModule({
	declarations: [SafeHtmlPipe],
	imports: [CommonModule],
	exports: [SafeHtmlPipe]
})
export class PipesModule {


}
