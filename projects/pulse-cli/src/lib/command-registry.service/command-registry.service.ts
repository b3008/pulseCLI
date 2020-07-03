import { Injectable } from '@angular/core';
import { ViewContainerRef, Injector, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef } from '@angular/core';
// import { MarkdownDisplayComponent } from '../../components/markdown-display/markdown-display.component';
// import { HelpItemComponent } from '../../components/help-item/help-item.component';
// import { Storage } from '@ionic/storage';

// import { ApiService } from "../api/api.service";
import { Subject } from 'rxjs';
// import * as Showdown from 'showdown';

// import about from '../../markdown_texts/about.md'

declare var localStorage;

@Injectable({
  providedIn: 'root'
})
export class CommandRegistryService {

  commands: Object = {};
  doesNotExistCallback: Function;
  commandHistory: Array<string> = [];
  commandHistoryIndex = 0;

  commandSubject = new Subject<any>();

  categories = {};




  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    // public api: ApiService,
    // public storage: Storage
  ) {
    let history = localStorage.history;
    try {
      this.commandHistory = JSON.parse(localStorage.history);
      this.commandHistoryIndex = this.commandHistory.length - 1;
    }
    catch (e) {
      console.warn("could not get history from localStorage")
    }
  }


  public addToHistory(commandString) {
    this.commandHistory.push(commandString);
    this.commandHistoryIndex = this.commandHistory.length;
    if (this.commandHistory.length > 100) this.commandHistory.shift();
    localStorage.history = JSON.stringify(this.commandHistory);
  }

  public getFromHistory(i) {
    this.commandHistoryIndex += i;
    if (this.commandHistoryIndex < 0) this.commandHistoryIndex = 0;
    if (this.commandHistoryIndex > this.commandHistory.length - 1) this.commandHistoryIndex = this.commandHistory.length - 1;
    return this.commandHistory[this.commandHistoryIndex];
  }


  clearStartupCommands() {
    // this.storage.set("startupCommands", []);
  }

  addToStartupCommands(cmd) {
    // this.storage.get("startupCommands").then(cmdList => {
    //   if (!cmdList) cmdList = [];

    //   cmdList.push(cmd);
    //   this.storage.set("startupCommands", cmdList)
    // })
  }

  public  executeStartupCommands() {
    // this.storage.get('startupCommands').then(
    //   async (startupCommands) => {
    //   if (!startupCommands) return;
    //   let promise: any = Promise.resolve();
    //   for (let i = 0; i < startupCommands.length; i++) {
    //     await this.parseCommand(startupCommands[i]);    
    //   }
    // })
  }





  public registerCallbackWhenCommmandDoesNotExist(callback) {

    this.doesNotExistCallback = callback;
  }

  public command(commandName: string, description: string, category: string) {
    let cmd = new OpCommand(commandName, description)
    this.commands[cmd.name] = cmd;

    if (!this.categories[category]) {
      this.categories[category] = [];
    }
    this.categories[category].push(cmd);

    return cmd;
  }

  isOption(string) {
    if (string.indexOf('-') == 0) return true;
  }

  isLongOption(string) {
    if (string.indexOf('--') == 0) return true;
  }

  isSwitch(bstring, index) {
    if (!this.isOption(bstring[index])) return false;
    else {
      if (!bstring[index + 1]) { }
    }

  }


  public findCommandObject(commandNameContainer) {
    //assuming that commandNameContainer is stripped of options
    let commandNamesList = Object.keys(this.commands).sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    });

    let commandObject = null;
    let args = [];
    let remainingCommandsList = commandNamesList;
    let existingCommandCandidate;
    let i = 1;
    while (commandNameContainer[i]) {
      existingCommandCandidate = commandNameContainer.substr(0, i)
      remainingCommandsList = remainingCommandsList.filter(cmd => {
        if (cmd.indexOf(existingCommandCandidate) == 0) {
          return cmd;
        }
      })
      if (remainingCommandsList.length == 1) {
        break;
      } else {
        i++;
      }
    }

    if (remainingCommandsList.length == 1) {

      let restOfContents = commandNameContainer.substr(remainingCommandsList[0].length + 1).trim().split(" ");
      args = restOfContents.filter((item) => {
        return item !== "";
      })
      commandObject = this.commands[remainingCommandsList[0]];
      return [commandObject, args];
    } else if(remainingCommandsList.length==0){
      return[null, null];
    } else if(remainingCommandsList.length>1){
      
      debugger;
      return[null, null];
    }

    
  }

  public replaceQuotedStringsWithIdentifiers(commandString) {
    let quotedStringRegexp = /(["'])((\\{2})*|(.*?[^\\](\\{2})*))\1/g;
    let subStringMap = {}
    let rCmdStr = commandString;

    let quotedSubStrings = commandString.match(quotedStringRegexp);
    //  replace them
    if (quotedSubStrings) {
      for (let i = 0; i < quotedSubStrings.length; i++) {
        let qKey = "_quotStr" + i;
        subStringMap[qKey] = quotedSubStrings[i];
        rCmdStr = rCmdStr.replace(quotedSubStrings[i], qKey);
      }
    }

    return [rCmdStr, subStringMap]
  }


  public parseCommand(commandString, indirectParams?) {

    // this.api.saveCommandHistory(commandString, indirectParams || {}, {}, true);
    if (indirectParams) if (indirectParams.enterIntoHistory) {
      this.addToHistory(commandString);
    }

    // if ((commandString === "help") || (commandString === "?")) {
    //   return new Promise((resolve, reject) => {
    //     this.commands["help"].callback({ helpItems: this.compileHelp() }, "help", resolve, reject)
    //   })
    // }
    


    /*
    parsing strategy: 
      first replace all quoted strings with placeholders, 
      then separate switches from the first part of the string
      then look for positional arguments in first part of the string
      replace found arguments with corresponding quoted strings, if any
      then match argument-value pairs
      replace values with corresponding quoted strings, if any
    */

    let [cmdString, subStringMap] = this.replaceQuotedStringsWithIdentifiers(commandString);




    
    //assuming there are no switches, cmdContainer contains commandName + positional arguments
    let cmdContainer = cmdString;
    //but if there are switches, isolate them
    if (cmdString.indexOf('-') != -1) {
      cmdContainer = cmdString.substr(0, cmdString.indexOf('-')).trim();
    }

    let [commandObject, args] = this.findCommandObject(cmdContainer);

    if (!commandObject) {
      this.doesNotExistCallback({ commandName: cmdContainer });
      return;
    }
    let finalArguments = {}

    for (let i = 0; i < commandObject.arguments.length; i++) {
      //get the argName without braces;
      let argName = commandObject.arguments[i].substr(1, commandObject.arguments[i].length - 2);
      //are any of the positional arguments stand-ins for quoted strings?
      let s = subStringMap[args[i]];
      if (s) {
        //then assign that value instead, but without the quotes
        finalArguments[argName] = s.substr(1, s.length - 2);
      }
      else {
        //otherwise assign the regular value
        finalArguments[argName] = args[i];
      }
    }

    //if indirectParams has any keys, include these as well
    if (indirectParams) if (indirectParams.args) {
      let indirectParamKeys = Object.keys(indirectParams.args)
      for (let i = 0; i < indirectParamKeys.length; i++) {
        if (indirectParamKeys[i] !== "options") {
          finalArguments[indirectParamKeys[i]] = indirectParams.args[indirectParamKeys[i]];
        }
      }
    }

    //match commandName, and argument-value pairs both with short (-) and long(--)
    // let nameAndArgRegexp = /.*?(?= -|$)/g

    // extract all short (-) arguments /-\b.*?\b(?= |$)/g
    // extract all long (--) arguments /-\b.*?\b(?= |$)/g
    // match both short and long arguments (--|-\w)(.*?)(?= |$);




    //  get argument-value pairs
    // match all argument-value pairs both with short and long: 
    let argValPairsRegexp = /(-|--).*?(?= -|$)/g;
    let argValPairs = cmdString.match(argValPairsRegexp) || [];

    //  now break them up in an options map;
    let optionsMap = {};
    for (var i = 0; i < argValPairs.length; i++) {
      let pair = argValPairs[i].split(' ').map(function (item) {
        return item.trim();
      })
    
      let k = pair[0]; // this is our key, the rest indices will be values
      if (!optionsMap[k]) {
        if (pair.length == 1) {
          optionsMap[k] = true;
        } else {
          optionsMap[k] = pair.slice(1);
        }
      }
      else {
        //  optionsMap[k] is already defined
        if (Array.isArray(optionsMap[k])) {
          if (pair.length >= 2) {
            optionsMap[k] = optionsMap[k].concat(pair.slice(1));
    
          }
        }
        else {
          //optionsMap[k] has value true
          optionsMap[k] = pair.slice(1);
        }
      }
      //  now that we have optionsMap[k], might as well replace quoted Strings  
      //  but please do so without the quotes that contain them
      if (Array.isArray(optionsMap[k])) for (var q = 0; q < optionsMap[k].length; q++) {
        let s = subStringMap[optionsMap[k][q]]
        if (subStringMap[optionsMap[k][q]]) optionsMap[k][q] = s.substr(1, s.length - 2);
      }
    }

    //  now we need to concat short and long options
    let optArr = Object.keys(optionsMap);
    let finalOptions = {};

    for (let i = 0; i < commandObject.options.length; i++) {
      let cmdOpt = commandObject.options[i];
      for (let j = 0; j < optArr.length; j++) {
        //if it's long or short
        if ((cmdOpt.short == optArr[j]) || (cmdOpt.long == optArr[j])) {
          let optname = cmdOpt.long.substr(2);
          if (!finalOptions[optname]) {
            finalOptions[optname] = [];
          }
          finalOptions[optname] = finalOptions[optname].concat(optionsMap[optArr[j]]);
        }
      }
    }


    //finally, include my indirect options as well
    if (indirectParams) if (indirectParams.args) if (indirectParams.args.options) {
      let indirectKeys = Object.keys(indirectParams.args.options)
      for (let i = 0; i < indirectKeys.length; i++) {
        finalOptions[indirectKeys[i]] = indirectParams.args.options[indirectKeys[i]];
      }
    }
    

    // build positional arguments
    finalArguments["options"] = finalOptions;

    return new Promise((resolve, reject) => {

      let result = commandObject.callback(finalArguments || {}, commandString, resolve, reject);
      // resolve(result);
    })



  }


  public getAutofillSuggestions(content) {
    let suggestions = [];
    let commandNames = Object.keys(this.commands);
    for (let i = 0; i < commandNames.length; i++) {
      if (commandNames[i].indexOf(content) === 0) {
        suggestions.push(commandNames[i])
      }
    }
    
    return suggestions;
  }

  // public compileHelp() {
  //   let commandNamesList = Object.keys(this.commands);

  //   let helpItems = [];

  //   let aboutItemRef = this.componentFactoryResolver.resolveComponentFactory(MarkdownDisplayComponent).create(this.injector);
  //   aboutItemRef.instance.text = new Showdown.Converter().makeHtml(about);
  //   helpItems.push(aboutItemRef);

  //   let categoryNames = Object.keys(this.categories);

  //   for (let j = 0; j < categoryNames.length; j++) {
  //     if (categoryNames[j] === "unlisted") {
  //       continue;
  //     }

  //     let categoryItemRef = this.componentFactoryResolver.resolveComponentFactory(MarkdownDisplayComponent).create(this.injector);
  //     categoryItemRef.instance.text = new Showdown.Converter().makeHtml(`#${categoryNames[j]}`);
  //     helpItems.push(categoryItemRef);
  //     let commandsInCategory = this.categories[categoryNames[j]];
    

  //     for (let i = 0; i < commandsInCategory.length; i++) {

  //       // for(let i=0; i<commandNamesList.length; i++){
  //       // let cmd = commandsInCategoryNamesList[i]; 

  //       let cmdObject = commandsInCategory[i];
    
  //       let cmdArguments = cmdObject.arguments.join(" ");
  //       let title = cmdObject.name + " " + cmdArguments;
  //       let optionsText = "";
  //       for (let k = 0; k < cmdObject.options.length; k++) {
  //         let opt = cmdObject.options[k];
  //         optionsText += `
  //         <div style="display:flex">    
  //           <div style="width:50%">${opt.flags.replace(/[<]/g, '&lt;')}</div>
  //           <div style="width:50%">${opt.description.replace(/[<]/g, '&lt;')}</div>
  //         </div>
  //         `
  //       }
  //       let itemRef = this.componentFactoryResolver.resolveComponentFactory(HelpItemComponent).create(this.injector);

  //       itemRef.instance.title = title.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');
  //       if (cmdObject.description) {
  //         itemRef.instance.description = cmdObject.description.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');
  //       } else {
  //         itemRef.instance.description = '(no description provided)';
  //       }
  //       itemRef.instance.commandObj = cmdObject;
  //       // console.log(this.commands[cmd].getCommandTextExample());
  //       itemRef.instance.text = optionsText;
  //       helpItems.push(itemRef);

  //     }

  //   }


  //   return helpItems;
  // }
}

export class OpCommand {




  commandString: string;
  name?: string;
  description?: string;
  arguments?: Array<string> = [];
  options?: Array<Option> = [];
  callback: Function;
  isLocal: Boolean;



  constructor(commandString, description) {


    let argStartIndex1 = commandString.indexOf("<");
    let argStartIndex2 = commandString.indexOf("[");
    let argStartIndex = commandString.length;
    if ((argStartIndex1 != -1) && (argStartIndex2 != -1)) argStartIndex = Math.min(argStartIndex1, argStartIndex2);
    else if ((argStartIndex1 === -1) && (argStartIndex2 !== -1)) argStartIndex = argStartIndex2;
    else if ((argStartIndex1 !== -1) && (argStartIndex2 === -1)) argStartIndex = argStartIndex1;

    this.name = commandString.substr(0, argStartIndex).trim();
    this.commandString = commandString
    this.arguments = commandString.match(/[\<\[]\w*[\>\]]/g) || [];
    this.description = description;
  }

  option(flags, description) {
    var self = this;
    var option = new Option(flags, description);
    var oname = option.name();
    var name = this._camelcase(oname);
    var defaultValue;

    // preassign default value only for --no-*, [optional], or <required>
    if (option.bool === false || option.optional || option.required) {
      // when --no-* we make sure default is true
      if (option.bool === false) {
        defaultValue = true;
      }
      // preassign only if we have a default
      if (defaultValue !== undefined) {
        self[name] = defaultValue;
      }
    }

    // register the option
    this.options.push(option);

    // when it's passed assign the value
    // and conditionally invoke the callback
    // this.on(oname, function (val) {
    //   // unassigned or bool
    //   if (typeof self[name] === 'boolean' || typeof self[name] === 'undefined') {
    //     // if no value, bool true, and we have a default, then use it!
    //     if (val === null) {
    //       self[name] = option.bool ? defaultValue || true : false;
    //     } else {
    //       self[name] = val;
    //     }
    //   } else if (val !== null) {
    //     // reassign
    //     self[name] = val;
    //   }
    // });

    return this;
  };

  local() {
    this.isLocal = true;
    return this;
  }

  remote() {
    this.isLocal = false;
    return this;
  }

  action(callback) {
    this.callback = callback;
    return this;
  }


  public getCommandTextExample() {
    let text = "";
    let positionalArguments = "";
    let options = "";
    text += this.name + " ";
    if (this.arguments) {
      for (let i = 0; i < this.arguments.length; i++) {
        positionalArguments += this.arguments[i].substr(1, this.arguments[i].length - 2) + " ";
      }
    }
    if (this.options) {

      for (let i = 0; i < this.options.length; i++) {
        let optSwitch = this.options[i].long;
        let optArg = this.options[i].flags.match(/[<|\[].*[>|\]]/g).join(" ").replace(/[<|>|\[|\]]/g, "")
        options += optSwitch + " " + optArg + " ";
      }
    }
    let final = text + positionalArguments + options;
    return final
  }



  _camelcase(flag) {
    return flag.split('-').reduce(function (str, word) {
      return str + word[0].toUpperCase() + word.slice(1);
    });
  }

}


export class Option {

  public flags;
  public required;
  public optional;
  public bool;
  public long;
  public short;
  public description;

  constructor(flags, description) {

    this.flags = flags;
    this.required = ~flags.indexOf('<');
    this.optional = ~flags.indexOf('[');
    this.bool = ! ~flags.indexOf('-no-');
    // this.autocomplete = autocomplete;
    flags = flags.split(/[ ,|]+/);
    if (flags.length > 1 && !/^[[<]/.test(flags[1])) {
      this.assignFlag(flags.shift());
    }
    this.assignFlag(flags.shift());
    this.description = description || '';
  }

  name() {
    if (this.long !== undefined) {
      return this.long.replace('--', '').replace('no-', '');
    }
    return this.short.replace('-', '');
  }

  is(arg) {
    return arg === this.short || arg === this.long;
  }




  private assignFlag(flag) {
    if (flag.startsWith('--')) {
      this.long = flag;
    } else {
      this.short = flag;
    }
  }
}
