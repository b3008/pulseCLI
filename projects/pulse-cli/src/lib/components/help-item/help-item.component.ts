import { Component, Input , ViewChild, ElementRef, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {OpCommand} from '../../command-registry.service/command-registry.service';
import { SafeHtmlPipe } from '../../safe-html';

@Component({
  selector: 'help-item',
  templateUrl: './help-item.component.html',
  styleUrls: ['./help-item.component.scss'],
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe]
})
export class HelpItemComponent implements OnInit {

  @Input('title')  title:string;
  @Input('command-text') commandText:string;
  @Input('description') description:string;
  @Input() public text:string;
  @Input(`allow-toggling`) public allowToggling= true;
  @Input() public  expanded:boolean= false;

  

  public modalText:string;
  public commandObj:OpCommand;  

  
  @ViewChild('expandWrapper', {read: ElementRef, static:false}) expandWrapper;
  

  constructor(private elementRef: ElementRef) {
    
    
  }

  ngOnInit(){}

  public hasText(){
    
    if(!this.text) return false;
    else
    return true;
    
  }
  public isTogglingAllowed(){
    return this.allowToggling;
  }

  toggleExpanded(){
    if(this.hasText()){
      this.expanded= !this.expanded;
    }
  }

  public titleClicked(){
    console.log("title clicked!!")
    if(this.hasText()) {
      this.expanded = true;
    }
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent("commandStringDispatched", {detail:this.commandObj.getCommandTextExample(), bubbles:true}));

  }

}
