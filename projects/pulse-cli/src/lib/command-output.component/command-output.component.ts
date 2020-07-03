import {Component, ElementRef, EventEmitter, Output, ViewChild, ViewContainerRef, ChangeDetectorRef, Renderer2, Pipe, PipeTransform, ComponentFactoryResolver, OnInit} from '@angular/core';
import { PulseCLIService } from '../pulse-cli.service';
import {CommandRegistryService} from '../command-registry.service/command-registry.service';

// import { SafeHtmlPipe } from '../safe-html';

declare var window;

@Component({
  selector: 'command-output',
  templateUrl: './command-output.component.html',
  styleUrls: ['./command-output.component.scss'],
})
export class CommandOutputComponent implements OnInit {



  ngOnInit() {}

  @Output() commandOutputComponentInitialized: EventEmitter<any> = new EventEmitter;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  @ViewChild("commandline", { read: ViewContainerRef }) commandLine: ViewContainerRef;
  @ViewChild("nextContainer", { read: CommandOutputComponent }) nextContainer: CommandOutputComponent;


  public isHidden = false;
  public commandString: string;
  public myHTML: string = "";
  
  public ref;

  public splitContainerIndex=0;
  public containedComponent;

  callbacksBeforeDestruction = [];
 
  constructor(public element:ElementRef,
    public viewContainerRef:ViewContainerRef,
    public changeDetector:ChangeDetectorRef,
    public renderer: Renderer2,
    public global : PulseCLIService,
    public commandRegistry:CommandRegistryService) {
    
  }

  ngAfterViewInit(){
    
    this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputComponentInitialized", {bubbles:true}));
    // this.element.nativeElement.scrollIntoView({behavior:"smooth"})

    
    this.renderer.listen(this.element.nativeElement, "saveDocument", (data)=>{
     
      
      this.commandRegistry.parseCommand("import document",{args:{options:{name: data.detail.name, string: data.detail.content, databaseId:data.detail.databaseId, editorRef:data.detail.editorRef}}});
    });

   

  }

  public updateCommandString(commandString){
    this.commandString = commandString
  }
  
  public placeInContainer(htmlString:string){
    
    this.myHTML = htmlString;
  }

  public addHTMLToContainer(htmlString:string){
    this.myHTML+= htmlString;
  }

  public placeViewContainerRefInContainer(componentRef){
    this.viewContainerRef.insert(componentRef.hostView);
  }

  

  public detectChanges(){
    this.changeDetector.markForCheck();
  }

  commandIssued(event){
    
    if(event.detail.local){
    
      event.stopPropagation();
    }
  }


  outputHeaderClicked(){
    
    this.element.nativeElement.dispatchEvent(new CustomEvent("bringCommandOutputToFront", {bubbles:true}));
  }

  outputHeaderMouseDown(event){
    
    
    this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputHeaderHasMouseDown", {bubbles:true, detail:{element:this.element.nativeElement, mouseDownEvent:event}}));
  }

  outputHeaderMouseUp(){
    
    
    this.element.nativeElement.dispatchEvent(new CustomEvent("commandOutputHeaderHasMouseUp", {bubbles:true, detail:this.element.nativeElement}));
  }


  
  hideCommand(){
    // this.commandLine.element.nativeElement.style.display="none";
  }


  addDestructionCallback(f){
    this.callbacksBeforeDestruction.push(f);
  }
  executeDestructionCallbacks(){
    for(let i=0; i<this.callbacksBeforeDestruction.length; i++){
      this.callbacksBeforeDestruction[i]();
    }
  }

  destroyCommandOutput(event){
    
    event.stopPropagation();
    this.executeDestructionCallbacks();
    this.element.nativeElement.dispatchEvent(new CustomEvent("destroyCommandOutput", {bubbles:true}));
  }



}
