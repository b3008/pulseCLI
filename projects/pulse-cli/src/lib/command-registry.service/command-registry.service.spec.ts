import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { CommandRegistryService } from './command-registry.service';
import { Option } from './command-registry.service';
import { OpCommand } from './command-registry.service';

declare var localStorage;



fdescribe('CommandRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientModule]
  }));

  it('should be created', () => {
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);
    expect(service).toBeTruthy();
  });

  it('should add commandString to commandHistory', ()=>{
    if(localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);

    let command1 = "testCommand1";
    service.addToHistory(command1);
    try{
    let history = JSON.parse(localStorage.history);
    expect(service.commandHistory[service.commandHistoryIndex]).toEqual(command1);
    expect(history[service.commandHistoryIndex]).toEqual(command1);  
    }catch(e){
      throw(e)
    }
  });

  it('should allow no more than 100 commands in commandHistroy', ()=>{
    if(localStorage.history)   delete localStorage.history;
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);

    let command;
    for(let i=0; i<200; i++){
      command = "testCommand_" + i;
      service.addToHistory(command);
    }

    
    expect(service.commandHistory.length).toEqual(100);
    expect(service.commandHistoryIndex).toEqual(99);
    expect(service.commandHistory[service.commandHistoryIndex]).toEqual(command);
  });


  it('should navigate history backwards and forwards', ()=>{
    if(localStorage.history)   delete localStorage.history;
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);

    let command;
    for(let i=0; i<200; i++){
      command = "testCommand_" + i;
      service.addToHistory(command);
    }


    let command99 = service.getHistoryOneStepBack();
    let command98 = service.getHistoryOneStepBack();
    let command97 = service.getHistoryOneStepBack();
    console.log(command99)
    console.log(command98)
    console.log(command97)
    expect(command99).toEqual("testCommand_198");
    expect(command98).toEqual("testCommand_197");
    expect(command97).toEqual("testCommand_196");

    let command97f = service.getHistoryOneStepForward();
    let command98f = service.getHistoryOneStepForward();
    let command99f = service.getHistoryOneStepForward();

    expect(command97f).toEqual("testCommand_197");
    expect(command98f).toEqual("testCommand_198");
    expect(command99f).toEqual("testCommand_199");

  });


  it("should create option", ()=>{
    let flags = '-n, --new';
    let description = 'a new option'

    const option = new Option(flags, description);
    expect(option).toBeTruthy();
  });

  it("should create OpCommand", ()=>{
    let commandString = "command";
    let description = "is a command instance"

    const opCommand = new OpCommand(commandString, description);
    expect(opCommand).toBeTruthy();
  });


  it("should register a command", ()=>{
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);

    service.command("myCommand", "a test command which when executed will pass the test", "nocategory")
    .option("-w, --withoption", "an option for the command")
    .action((args, commandString, resolve, reject)=>{
      console.log(args);
      expect(commandString).toEqual("myCommand -w yo")
      let options = Object.keys(args.options);
      console.log("options:", options);
      expect(options[0]).toEqual("withoption");
      resolve();
    })
    service.executeCommand("myCommand -w yo");
  });




});
