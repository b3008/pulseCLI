import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'markdown-display',
  templateUrl: './markdown-display.component.html',
  styleUrls: ['./markdown-display.component.scss'],
})
export class MarkdownDisplayComponent implements OnInit {

  public text: string;

  constructor() {
    
    this.text = 'Hello World';
  }

  ngOnInit(){

  }
}
