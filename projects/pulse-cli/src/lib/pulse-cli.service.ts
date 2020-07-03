import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PulseCLIService {

  constructor() { }

  public keyDown: any = {};
  public UI:any = {cli:[]}
}
