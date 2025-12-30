import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommandRegistryService } from './command-registry.service';
import { Option } from './command-registry.service';
import { OpCommand } from './command-registry.service';
import { SafeHtmlPipe } from './../safe-html';
import { HelpItemComponent } from './../components/help-item/help-item.component';

declare var localStorage: any;

describe('CommandRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, HelpItemComponent, SafeHtmlPipe]
  }));

  it('should be created', () => {
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);
    expect(service).toBeTruthy();
  });

  it('should add commandString to commandHistory', () => {
    if (localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    let command1 = "testCommand1";
    service.addToHistory(command1);
    try {
      let history = JSON.parse(localStorage.history);
      expect(service.commandHistory[service.commandHistoryIndex]).toEqual(command1);
      expect(history[service.commandHistoryIndex]).toEqual(command1);
    } catch (e) {
      throw (e)
    }
  });

  it('should allow no more than 100 commands in commandHistory', () => {
    if (localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    let command;
    for (let i = 0; i < 200; i++) {
      command = "testCommand_" + i;
      service.addToHistory(command);
    }

    expect(service.commandHistory.length).toEqual(100);
    expect(service.commandHistoryIndex).toEqual(99);
    expect(service.commandHistory[service.commandHistoryIndex]).toEqual(command);
  });

  it('should navigate history backwards and forwards', () => {
    if (localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    let command;
    for (let i = 0; i < 200; i++) {
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

  it('should return commandHistory[0] when commandHistoryIndex<0 at getAtStepsFromHistoryIndex', () => {
    if (localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);
    service.addToHistory("command1");
    service.addToHistory("command2");
    expect(service.commandHistoryIndex).toEqual(1);
    let pastCommand = service.getAtStepsFromHistoryIndex(-10);
    expect(pastCommand).toEqual("command1");
  })

  it('should return latest when commandHistoryIndex>commandHistrory.length, at getAtStepsFromHistoryIndex', () => {
    if (localStorage.history) delete localStorage.history;
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);
    service.addToHistory("command1");
    service.addToHistory("command2");
    expect(service.commandHistoryIndex).toEqual(1);
    let pastCommand = service.getAtStepsFromHistoryIndex(10);
    expect(pastCommand).toEqual("command2");
  })

  it("should create option", () => {
    let flags = '-n, --new';
    let description = 'a new option'

    const option = new Option(flags, description);
    expect(option).toBeTruthy();
  });

  it("should create OpCommand", () => {
    let commandString = "command";
    let description = "is a command instance"

    const opCommand = new OpCommand(commandString, description);
    expect(opCommand).toBeTruthy();
  });

  it("should register and parse a command", () => {
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    service.addCommand("bCommand0", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("aCommand1", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("myCommand2", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("myCommand", "a test command which when executed will pass the test", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        console.log(args);
        expect(commandString).toEqual("myCommand -w yo")
        let options = Object.keys(args.options);
        console.log("options:", options);
        expect(options[0]).toEqual("withoption");
        resolve();
      })

    let parseResult = service.parseCommand("myCommand -w yo");
    expect(parseResult.commandObject).toBeTruthy();
    expect(parseResult.commandObject.name).toEqual("myCommand");
  });

  it("should register and execute a command", (done) => {
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    service.addCommand("bCommand0", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("aCommand1", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("myCommand2", "if this was executed it means there was an error", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        //fail. this should not be executed
        expect(false).toBeTruthy();
      })

    service.addCommand("myCommand", "a test command which when executed will pass the test", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        console.log(args);
        expect(commandString).toEqual("myCommand -w yo")
        let options = Object.keys(args.options);
        console.log("options:", options);
        expect(options[0]).toEqual("withoption");
        resolve();
        done();
      })
    service.executeCommand("myCommand -w yo");
  });

  it("should call default callback when command does not exist", (done) => {
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    service.registerCallbackForWhenCommmandDoesNotExist((commandString) => {
      console.log(commandString);
      expect(commandString).toEqual("randomCommand");
      done();
    })

    service.executeCommand("randomCommand");
  });

  it("should compile help", () => {
    const service: CommandRegistryService = TestBed.inject(CommandRegistryService);

    service.addCommand("myCommand", "a test command which when executed will pass the test", "nocategory")
      .option("-w, --withoption", "an option for the command")
      .action((args, commandString, resolve, reject) => {
        console.log(args);
        expect(commandString).toEqual("myCommand -w yo")
        let options = Object.keys(args.options);
        console.log("options:", options);
        expect(options[0]).toEqual("withoption");
        resolve();
      })
    service.compileHelp();
    console.log("categories:", service.categories)
    expect(Object.keys(service.categories)[0]).toEqual("nocategory")
  });
});
