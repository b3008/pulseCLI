import { Component, OnInit, ElementRef, ViewChild, Input, Renderer2, Inject } from '@angular/core';
// import {SocketService} from '../../services/socket/socket.service';
import { CommandRegistryService } from '../../command-registry.service/command-registry.service';
// import {SuggestionBoxComponent} from '../suggestion-box/suggestion-box.component'


@Component({
  selector: 'command-line',
  templateUrl: './command-line.component.html',
  styleUrls: ['./command-line.component.scss'],
})
export class CommandLineComponent implements OnInit {


  rejectionPhrases = ["no", "nope", "won't happen", "don't know this one", "ouch"];

  text: string;
  textInput: string;
  mode = "normal"; //TODO: determine how command should be parsed, support JS or other modes
  type = "main";

  @Input('command') public command: string;
  @ViewChild('divArea', { read: ElementRef, static: true }) divArea: ElementRef;
  @ViewChild('belowDivArea', { read: ElementRef }) belowDivArea: ElementRef;
  @ViewChild('speechBubbleContent', { read: ElementRef, static: true }) speechBubbleContent: ElementRef;
  @ViewChild('speechBubbleContainer', { read: ElementRef, static: true }) speechBubbleContainer: ElementRef;
  // @ViewChild('suggestionBox', {read:ElementRef}) suggestionBox: SuggestionBoxComponent;


  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private commandRegistry: CommandRegistryService,
  ) {
  }

  ngOnInit() {

  }

  setMode(mode) {
    this.mode = mode;
  }

  keydown(event) {


    switch (event.keyCode) {
      case 9:
        //Tab
        //on Tab, try to match given text with an existing command
        event.preventDefault();
        event.stopPropagation();
        this.autofill();
        break;
      case 38:
        //up
        //on keyup, move backwards though history and paste command
        event.preventDefault();
        event.stopPropagation();
        let newText = this.commandRegistry.getFromHistory(-1);
        if (newText) {
          this.divArea.nativeElement.innerText = newText;
          let selection = window.getSelection();
          selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], newText.length)
        }

        // TODO: cycle through command history
        break;
      case 40:
        //down
        //on keydown move forwards through history and paste command
        event.preventDefault();
        event.stopPropagation();
        let newText2 = this.commandRegistry.getFromHistory(1);
        if (newText2) {
          this.divArea.nativeElement.innerText = newText2;
          let selection2 = window.getSelection();
          selection2.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], newText2.length)
        }

        break;
    }

  }


  autofill() {

    let content = this.divArea.nativeElement.innerText;
    let suggestions = this.commandRegistry.getAutofillSuggestions(content);

    if (suggestions.length === 1) {
      this.divArea.nativeElement.innerText = suggestions[0];
      let selection = window.getSelection();
      selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], suggestions[0].length)
    } 
  }

  public suggestionSelected(event) {
    this.setText(event.detail);
    this.setFocusToCommandLine()

  }



  setFocusToCommandLine() {

    this.divArea.nativeElement.focus();
    let selection = window.getSelection();

    if (this.divArea.nativeElement.childNodes.length) {
      selection.collapse(this.divArea.nativeElement.childNodes[this.divArea.nativeElement.childNodes.length - 1], this.divArea.nativeElement.innerText.length)
    }
    else {
      selection.collapse(this.divArea.nativeElement, this.divArea.nativeElement.innerText.length)
    }
  }



  say(what, howlong) {

    this.speechBubbleContent.nativeElement.innerHTML = what;
    this.showBubbleContainer();

    if (howlong) {
      setTimeout(() => {

        this.hideBubbleContainer()
      }, howlong)
    }
    else {
      //enable closing button

    }
  }

  speak(what) {
    let phrase = new SpeechSynthesisUtterance(what);
    phrase.voice = window.speechSynthesis.getVoices()[11];
    window.speechSynthesis.speak(phrase);
  }

  speakAndSay(what, howlong) {
    this.say(what, howlong);
    this.speak(what);
  }


  keypress(event) {
    // debugger;
    if (event.keyCode == 13) {
      if (event.shiftKey) {
        //TODO: shift+return was pressed, do something different
      }
      else {
        //  Enter was pressed
        let commandString = this.divArea.nativeElement.innerText.trim();

        this.elementRef.nativeElement.dispatchEvent(new CustomEvent('commandIssued', { detail: { command: commandString, local: false, enterIntoHistory: true }, bubbles: true }))
        return false;

      }
    }
  }

  clear() {
    this.renderer.setProperty(this.divArea.nativeElement, 'innerHTML', '')
  }


  public setText(text) {
    this.divArea.nativeElement.innerText = text;
    // let selection = window.getSelection();
    // selection.collapse( this.divArea.nativeElement.childNodes[ this.divArea.nativeElement.childNodes.length-1], this.divArea.nativeElement.innerText.length)
  }


  hideBubbleContainer() {
    this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'opacity', '0');
    setTimeout(() => {
      this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'display', 'none');
    }, 600);
  }

  showBubbleContainer() {
    this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.speechBubbleContainer.nativeElement, 'opacity', '1');
  }



}
