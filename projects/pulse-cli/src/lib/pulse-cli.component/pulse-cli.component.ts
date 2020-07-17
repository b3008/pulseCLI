import {
  OnInit,
  Component,
  ViewChild, ViewChildren,
  ElementRef,
  Renderer2,
  ViewContainerRef, Injector, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef,
  ViewEncapsulation,
  QueryList,
  ResolvedReflectiveFactory,
  Inject

} from '@angular/core';
import { CommandOutputComponent } from '../components/command-output.component/command-output.component';
import { CommandLineComponent } from '../components/command-line.component/command-line.component';
import { CommandRegistryService } from '../command-registry.service/command-registry.service';
import { PulseCLIService } from '../pulse-cli.service';
 


declare var window;




@Component({
  selector: 'lib-pulseCLI',
  templateUrl: './pulse-cli.component.html',
  styleUrls: ['./pulse-cli.component.scss'],
  styles: []
})


export class PulseCLIComponent implements OnInit {



  @ViewChild('outputContainer', { read: ElementRef }) outputContainer: ElementRef;
  @ViewChildren('outputContainer', { read: ViewContainerRef }) outputContainerChildren;
  
  @ViewChildren('output', { read: ViewContainerRef }) outputChildren;
  @ViewChildren(CommandLineComponent) commandLine;

  @ViewChild('panelContainer', { read: ElementRef, static: true }) panelContainer: ElementRef;
  @ViewChildren('panelChild', { read: ElementRef }) panelChildren;
  @ViewChild('dropIntoPanelIndicator', { read: ViewContainerRef, static: true }) dropIntoPanelIndicator: ViewContainerRef;

  // @ViewChildren("matSelectForCommandHistories", { read: MatSelect }) matSelectForCommandHistories: QueryList<MatSelect>;

  public activeTab = 0;
  splits = 1;
  splitWidthArr = new Array(this.splits);
  splitSeparatorArr = new Array(this.splits);
  indexOfPanelWithMaximumOverlap;

  //this two arrays hold lists of commandOutputComponents that correspond to each split  
  commandOutputComponentLists = [new Array()];
  commandComponentHistories = [new Array()];
  limitVisibleCommandOuputComponents = 3;
  limitAvailableCommandComponentHistories = 10;
  hiddenCommandComponents = [new Array()]

  outputContainerHeight;
  commandOutputHeaderMouseDown = false;

  recalcSplitWidths() {
    this.splitWidthArr = [];
    for (let i = 0; i < this.splits; i++) {
      this.splitWidthArr.push(100 / this.splits)
    }
  }

  newSplit() {

    this.splits++;

    this.splitSeparatorArr.push({});
    this.recalcSplitWidths();

    this.commandOutputComponentLists.push(new Array());
    this.commandComponentHistories.push(new Array());
    this.hiddenCommandComponents.push(new Array());

    this.activeTab = this.splits - 1;
  }



  socketServiceObserver;

  constructor(
    
    public elementRef: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    public renderer: Renderer2,
    private injector: Injector,
    
    public changeDetector: ChangeDetectorRef,
    public commandRegistry: CommandRegistryService,
    public global: PulseCLIService,

    // public navCtrl: NavController,
    // public alertCtrl: AlertController,
    // public modalCtrl: ModalController,
    
    // public SocketService: SocketService,
    
    
    // public api: ApiService,
    // public storage: Storage,
    // public realtimehelpService: RealtimehelpService,


    // public participantSource: ParticipantSource,
    // public documentSource: DocumentSource,
    // public groupSource: GroupSource,
    // public allocationSource: AllocationSource,
    // public ruleSource: RuleSource,
    // public cloudmessageSource: CloudmessageSource,

    // private snackBar: MatSnackBar,
  ) {


    window.f = this;
    for (let i = 0; i < this.splits; i++) {
      this.splitSeparatorArr[i] = {};
      this.splitWidthArr[i] = 100 / this.splits;
    }

    // this.SocketService.socket.on('exec_result', (data) => {
    //   //create objectList from result;
    //   this.addObjectListForResult(data);
    // })


  }



  ngOnInit() {

    // this.changeDetector.detach();
    console.log("ngOnInit");
    this.registerUICommands();
    // this.registerCommands()

    setTimeout(() => {


      // this.socketServiceObserver = this.SocketService.allEventsSubject.subscribe((data) => {
        //TODO::
        // let index = this.SocketService.eventList.indexOf(data);
        // console.log(data);
        // this.snackBar.open("hey", "ok", {
        //   duration: 2000,
        // });
      // })

      // this.commandRegistry.parseCommand("what now");
      // this.commandRegistry.executeStartupCommands();

      this.global.UI.cli.push(this);

      setTimeout(() => {
        this.commandLine._results[this.activeTab].setFocusToCommandLine();
        
      }, 500)
    }, 500)

    if(this.outputContainerChildren)    this.outputContainerHeight = parseInt(window.getComputedStyle(this.outputContainerChildren.toArray()[this.activeTab].element.nativeElement).height);
    window.addEventListener("resize", (event) => {
      let a = this;
      let newHeight = 100;
      if(this.outputContainerChildren){
        newHeight = parseInt(window.getComputedStyle(this.outputContainerChildren.toArray()[this.activeTab].element.nativeElement).height);
      }
      let diff = newHeight - this.outputContainerHeight;
      this.outputContainerHeight = newHeight;

      for (let i = 0; i < this.commandOutputComponentLists.length; i++) {
        let list = this.commandOutputComponentLists[i];
        for (let j = 0; j < list.length; j++) {
          let item = this.commandOutputComponentLists[i][j];

          let itemHeight = parseInt(window.getComputedStyle(item.instance.element.nativeElement).height);
          let newHeight = itemHeight + diff + "px";
          this.renderer.setStyle(item.instance.element.nativeElement, "height", newHeight);

        }
      }
    });




  }

  ngAfterViewInit() {
    
  }




  registerUICommands(){

    this.commandRegistry.registerCallbackForWhenCommmandDoesNotExist((args) => {
      let cmdContainerInstance = this.insertComponent().cmdContainer;
      cmdContainerInstance.placeInContainer(`${args.commandName}: <span style="color:orange">no such command<span>`);
      cmdContainerInstance.hideCommand();
      this.clearActiveCommandLine()
    })

    this.commandRegistry.addCommand("help", "this help text", "help")
    .action((args, commandString, resolve, reject) => {
      let cmdContainer = this.insertComponent(null, 'help').cmdContainer;

      for (var i = 0; i < args.helpItems.length; i++) {
        cmdContainer.container.insert(args.helpItems[i].hostView);
      }
      this.clearActiveCommandLine()
      resolve(this);
    })

      //   this.commandRegistry.addCommand('what now', "recommendations on how to interact with the system", "UI")
      // .action((args, commandString, resolve, reject) => {
      //   let components = this.insertComponent(WhatnowComponent, commandString);
      //   let whatNowComponent = components.component;
      //   resolve();
      //   this.clearActiveCommandLine();
      // })

    this.commandRegistry.addCommand('panel <number>', "make numbered panel active or add new panel to screen", "UI")
      .action((args, commandString, resolve, reject) => {
        this.clearActiveCommandLine()
        if (!args.number) {
          this.newSplit();

        } else if (args.number <= this.splits) {
          //choose the panel
          this.activeTab = args.number - 1;
        }
        this.changeDetector.detectChanges();
        resolve(this);

      });

    this.commandRegistry.addCommand('move card <panel1_card1> <panel2>', "move card to different panel", "UI")
      .action((args, commandString, resolve, reject) => {

        this.clearActiveCommandLine()

        let separator = "_";
        if (args.panel1_card1.indexOf(',') != -1) { separator = "," }

        let panel1 = args.panel1_card1.split(separator)[0] - 1;
        let card1 = args.panel1_card1.split(separator)[1] - 1;
        let panel2 = args.panel2 - 1
        let elem = this.commandOutputComponentLists[panel1][card1].instance.element.nativeElement;
        this.moveCommandOutputToSplitByIndex(elem, panel2);

        resolve(this);

      });

    this.commandRegistry.addCommand('destroy card <panel_card>', "remove card", "UI")
      .action((args, commandString, resolve, reject) => {

        this.clearActiveCommandLine()

        let separator = "_";
        if (args.panel_card.indexOf(',') != -1) { separator = "," }

        let panel = args.panel_card.split(separator)[0] - 1;
        let card = args.panel_card.split(separator)[1] - 1;

        this.destroyCommandOutput(panel, card);

        resolve(this);

      });

    this.commandRegistry.addCommand('remove panel', "move card to different panel", "UI")
      .action((args, commandString, resolve, reject) => {

        this.clearActiveCommandLine()

        let separator = "_";
        if (args.panel1_card1.indexOf(',') != -1) { separator = "," }

        let panel1 = args.panel1_card1.split(separator)[0] - 1;
        let card1 = args.panel1_card1.split(separator)[1] - 1;
        let panel2 = args.panel2 - 1
        let elem = this.commandOutputComponentLists[panel1][card1].instance.element.nativeElement;
        this.moveCommandOutputToSplitByIndex(elem, panel2);

        resolve(this);

      });

    this.commandRegistry.addCommand('batch', "execute a batch of commands", "UI")
      .option('-c, --command', 'command to run')
      .action((args, commandString, resolve, reject) => {

        this.clearActiveCommandLine()

        if (!args.options.command.length) {
          //no commands provided, show box for entering
        } else {
          for (let i = 0; i < args.options.command.length; i++) {
            let f = this.commandRegistry.parseCommand("help");

          }
        }

        // this.api.report(args.message, args.options.type)
      })



    this.commandRegistry.addCommand('startwith <command>', 'add command to a list of commands executed at startup', "UI")
      .action((args, commandString, resolve, reject) => {

        this.clearActiveCommandLine()
        let command = commandString.substr(10).trim();
        if (command == "clear") {
          this.commandRegistry.clearStartupCommands();
        } else {
          this.commandRegistry.addToStartupCommands(command);
        }
      })

    
      // TODO:
    // this.commandRegistry.addCommand("ui viewer", "display help for items when the mouse is over them", "UI")
    // .action((args, commandString, resolve, reject) => {


    //   let cmdContainer = this.insertComponent(RealtimehelpComponent, commandString).cmdContainer;

    //   cmdContainer.commandString = commandString;
    //   this.clearActiveCommandLine()
    //   resolve(this);

    // })
  }


  
  registerCommands() {





    // this.commandRegistry.addCommand("echo <text>", "print html into the output", "unlisted")
    //   .action((args, commandString, resolve, reject) => {
    //     this.echo(args.text)
    //     this.clearActiveCommandLine()
    //     resolve(this);
    //   })

    // this.commandRegistry.addCommand("list participants", "get a list of participants", "participants")
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {
    //     let cmdContainer = this.insertComponent(ParticipantList2Component, commandString).cmdContainer;

    //     cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()

    //     resolve(this);
    //   })

    // this.commandRegistry.addCommand("create participant <email> <password>", "create a participant with an email and a password", "participants")
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {

    //     let doCreateParticipant = (email, password) => {
    //       this.participantSource.create({ email, password }).then((participant) => {

    //         this.clearActiveCommandLine();
    //         this.participantSource.fetch();

    //         resolve({ email, password });
    //       }).catch((error) => {
    //         console.error(error);
    //         this.echo(this.red(error.error));
    //         reject(error);
    //       })
    //     }

    //     if ((args.email) && (args.password)) {
    //       doCreateParticipant(args.email, args.password)
    //     } else {
    //       this.alertCtrl.create({
    //         header: 'Create participant',
    //         message: 'Enter email and password for new participant',
    //         inputs: [{
    //           name: 'email',
    //           placeholder: 'email'
    //         }, {
    //           name: 'password',
    //           type: 'password',
    //           placeholder: 'password'
    //         }],

    //         buttons: [

    //           { text: "cancel" },
    //           {
    //             text: 'ok',
    //             handler: data => {
    //               doCreateParticipant(data.email, data.password);
    //             }
    //           },



    //         ],
    //       }).then(c => {
    //         c.present().then((d) => {
    //           // console.log(d);
    //           // console.log(c);

    //         });


    //       });

    //     }
    //   })

    // this.commandRegistry.addCommand("open participant <email>", "show details of paricipant", "participants")
    //   .action((args, commandString, resolve, reject) => {

    //     this.participantSource.fetchSingle({ email: args.email }).then((result: any) => {
    //       let components = this.insertComponent(ParticipantEditorComponent, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let participantEditor = components.component;
    //       participantEditor.setConfig(result);
    //       this.clearActiveCommandLine()
    //       resolve(this);
    //     }).catch(error => {
    //       this.echo(error);
    //       reject(error);
    //     })


    //     this.clearActiveCommandLine()

    //   });

    // this.commandRegistry.addCommand("remove participants", "removes participants from listings.", "participants")
    //   .option('-p, --participants [participants]', "a set of participants to delete, wrapped in quotes. e.g. 'p1,p2,p3'")
    //   .option('-y, --yes', "don't ask for confirmation")
    //   .action((args, commandString, resolve, reject) => {

    //     let doDeleteParticipants = (participants) => {
    //       this.global.deleteParticipants(participants).then((result) => {
    //         resolve(this);
    //       }).catch(error => {
    //         reject(error);
    //       })
    //     }
    //     if (!args.options.yes) {
    //       //delete participants alert
    //       this.alertCtrl.create({
    //         header: `Warning!`,
    //         message: `Removing participants will remove them from groups and participant lists, but users will remain within the system. Proceed?`,
    //         buttons: [{ text: "yes", handler: () => { doDeleteParticipants(args.options.participants) } }, 'no']
    //       }).then(c => c.present());
    //     }

    //     this.clearActiveCommandLine()
    //   })


    // this.commandRegistry.addCommand('usageStatistics <participant>', 'show usage statistics for participant', 'participants')
    //   .option('-s, --start [startDateTime]', "start date for data set")
    //   .option('-e, --end [endDateTime]', "end date for data set")
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(UsageStatisticsComponent, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     let usageStatisticsComponent = components.component;

    //     if (!args.options.startDateTime) {
    //       args.options.startDateTime = [0];
    //     }
    //     if (!args.options.endDateTime) {
    //       args.options.endDateTime = [0];
    //     }
    //     usageStatisticsComponent.refresh({ startDateTime: args.options.startDateTime[0], endDateTime: args.options.endDateTime[0], participant: args.participant })

    //   })


    // this.commandRegistry.addCommand("list groups", "get a list of groups", "groups")
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {


    //     let components = this.insertComponent(GroupList2Component, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()
    //     resolve(this);

    //   })

    // this.commandRegistry.addCommand("delete groups", "delete groups from database", "groups")
    //   .option('-g, --groups [groups]', "group to delete")
    //   .option('-y, --yes', "don't ask for confirmation")
    //   .action((args, commandString, resolve, reject) => {

    //     let doDeleteGroups = (groups) => {
    //       this.global.deleteGroups(groups).then((result) => {
    //         resolve(this);
    //       })
    //     }
    //     if (!args.options.yes) {
    //       //delete participants alert
    //       this.alertCtrl.create({
    //         header: `Warning!`,
    //         message: `Deleting groups will also cause allocation rules to be dissassociated from respective members.
    //       Proceed?`,
    //         buttons: [{ text: "yes", handler: () => { doDeleteGroups(args.options.groups) } }, 'no']
    //       }).then(c => c.present());
    //     }
    //     this.clearActiveCommandLine()
    //   })

    // this.commandRegistry.addCommand("create group <name>", "create a group", "groups")
    //   .option('-p, --participants [participants]', "a set of participants to include in the group, wrapped in quotes. e.g. 'p1,p2,p3'")
    //   .option('-n, --name <name>', 'the group\'s name')
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {

    //     let doCreateGroup = (name, participants) => {
    //       this.clearActiveCommandLine()
    //       return this.groupSource.create({ name, participants }).then(result => {
    //         resolve({ name });
    //       }).catch((error) => {
    //         // console.error(error);
    //         this.alertCtrl.create({ header: error.error, buttons: ["ok"] })
    //         // this.echo(this.red(error.error));
    //         reject(error);
    //       })

    //     }

    //     let name = args.name || args.options.name
    //     if (!name) {
    //       console.log('group is missing');

    //       this.alertCtrl.create({
    //         header: 'Enter name for group',
    //         inputs: [{
    //           name: 'groupname',
    //           placeholder: 'group name'
    //         }],

    //         buttons: [{
    //           text: 'Continue',
    //           handler: data => {
    //             doCreateGroup(data.groupname, args.options.participants).then((result) => {
    //               // this.commandRegistry.parseCommand(`open group ${name}`);

    //             });
    //           }
    //         }]
    //       }).then(c => {
    //         c.present().then((d) => {
    //           //console.log(d);
    //           //console.log(c);
    //           setTimeout(() => {
    //             // c.childNodes[1].childNodes[2].childNodes[0].blur()
    //             //console.log(c.childNodes[1].childNodes[2].childNodes[0]);
    //             let d: any = c.childNodes[1].childNodes[2].childNodes[0].childNodes[0];
    //             d.focus();

    //           }, 100)

    //         });


    //       });
    //       return;
    //     }
    //     else {
    //       doCreateGroup(name, args.options.participants);
    //     }


    //   })

    // this.commandRegistry.addCommand("open group <name>", "edit a group", "groups")
    //   .action((args, commandString, resolve, reject) => {

    //     if (!this.groupSource.itemsByIndex[args.name]) {

    //       this.groupSource.fetchSingle({ name: args.name }).then((result: any) => {
    //         let components = this.insertComponent(GroupEditor2Component, commandString);
    //         components.cmdContainer.commandString = commandString;
    //         let groupEditor = components.component;
    //         groupEditor.setConfig(result);
    //         resolve(this);
    //       }).catch(error => {
    //         reject(error);
    //       })
    //     }
    //     else {

    //       let components = this.insertComponent(GroupEditor2Component, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let groupEditor = components.component;
    //       groupEditor.setConfig(this.groupSource.itemsByIndex[args.name]);
    //       resolve(this);
    //     }

    //     this.clearActiveCommandLine()

    //   });

    // this.commandRegistry.addCommand('group participants', 'assign multiple participants to a group', "groups")
    //   .option('-g, --group <group>', 'existing or new group to place participant(s) in')
    //   .option('-p, --participant <participant>', 'participant(s) to place in group')
    //   .action((args, commandString, resolve, reject) => {

    //     let doΑddToGroup = (name: string, participants: any) => {
    //       this.global.addToGroup(name, participants).then(result => {
    //         resolve(this);
    //       }).catch(error => {
    //         console.log(error);
    //         reject(error);
    //       })
    //       this.clearActiveCommandLine()
    //     }

    //     let chooseGroupAlert = (grouplist) => {

    //       return this.alertCtrl.create({
    //         header: 'Select group',
    //         inputs: grouplist,
    //         buttons: [{
    //           text: 'Continue',
    //           handler: (name) => {

    //             doΑddToGroup(name, args.options.participants);
    //           }
    //         }]
    //       });
    //     }

    //     let name = args.name || args.options.name
    //     if (!name) {
          

    //       this.global.fetchGroups().then((groups: any) => {
    //         //create the group list
    //         let groupList = [];
    //         for (var i = 0; i < groups.length; i++) {
    //           groupList.push({ label: groups[i].name, value: groups[i].name, type: "radio" })
    //         }
    //         chooseGroupAlert(groupList).then(c => c.present());
    //       }).catch((error) => {
    //         console.error(error);
    //         reject(error);
    //       })
    //     } else {
    //       doΑddToGroup(name, args.options.participants);
    //     }

    //   })

    // this.commandRegistry.addCommand("list documents", "get a list of documents", "documents")
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(DocumentList2Component, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()
    //     resolve(this);
    //   })

    // this.commandRegistry.addCommand("create document <name>", 'open up an editor for document creation', "documents")
    //   .action((args, commandString, resolve, reject) => {

    //     let containerAndComponentPair = this.insertComponent(DocumentEditorComponent, commandString);
    //     containerAndComponentPair.cmdContainer.commandString = commandString;
    //     let docEd = containerAndComponentPair.component;
    //     docEd.name = args.name;
    //     containerAndComponentPair.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()

    //     resolve(this);
    //   });

    // this.commandRegistry.addCommand("open document <name>", 'open up an editor for document creation', "documents")
    //   .action((args, commandString, resolve, reject) => {
        


    //     if (!args.name) {
    //       this.echo(this.white(commandString) + this.red("document name is missing"));
    //       resolve(this);
    //       return;
    //     }
    //     this.documentSource.fetchSingle({ name: args.name }).then((result: any) => {

    //       let doc = result || { name: args.name };
          
    //       // let components = this.insertComponent(DocumentEditorComponent, commandString);
    //       let components = this.insertComponent(EditorComponent, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let docEd = components.component;

    //       setTimeout(()=>{
    //         docEd.setConfig(doc);
    //       });

    //       this.clearActiveCommandLine()
    //       resolve(this);
    //     }).catch(error => {
    //       this.echo(this.red(`document ${args.name} does not exist`));
    //       reject(error);
    //     });
    //   })

    // this.commandRegistry.addCommand("preview document <name>", 'preview a document', "documents")
    //   .option('-u, --uuid <uuid>', 'uuid for document editor reference')
    //   .action((args, commandString, resolve, reject) => {
        

    //     if (!args.name) {

    //       if (args.options.uuid) {
    //         let components = this.insertComponent(PreviewComponent, commandString);
    //         // components.cmdContainer.commandString = commandString;
    //         let preview = components.component;
    //         let cmdContainer = components.cmdContainer;
    //         cmdContainer.commandString = commandString;
    //         this.clearActiveCommandLine()
    //         resolve(this);
    //         return;
    //       } else {
    //         this.echo(this.white(commandString) + this.red("document name is missing"));
    //         resolve(this);
    //         return;
    //       }
    //     } else {

    //       this.documentSource.fetchSingle({ name: args.name }).then((result: any) => {
            
    //         let components = this.insertComponent(PreviewComponent, commandString);
    //         components.cmdContainer.commandString = commandString;
    //         let preview = components.component;
    //         preview.setConfig(result);

    //         setTimeout(() => {
    //           preview.content = result.content;
    //         }, 100)


    //         let cmdContainer = components.cmdContainer;
    //         cmdContainer.commandString = commandString;
    //         this.clearActiveCommandLine()
    //         resolve(this);
    //       }).catch(error => {
    //         console.error(error);
    //         this.echo(this.red(`document ${args.name} does not exist`));
    //         reject(error);
    //       });
    //     }
    //   })


    // this.commandRegistry.addCommand("import document", "import a document into the database", "documents")
    //   .option('-n, --name <name>', 'name for the document')
    //   .option("-s, --string <string>", "the document content provided as a string")
    //   .option("-d, --description_short", "short description")
    //   .option("-D, --description_long", "long description")
    //   .option("-id, --databaseId <databaseId>", 'will ovewrite existing document with id without confirmation')
    //     .action((args, commandString, resolve, reject) => {
    //       if ((!args.options.name) || (args.options.name === true)) {
    //         this.echo(this.white(commandString + ": import") + this.red("document name is missing"));
    //         resolve(this);
    //         return;
    //       }

          
    //       this.documentSource.apiSave({ name: args.options.name, content: args.options.string, description_long: args.options.description_long, description_short: args.options.description_short }).then((result: any) => {
    //         debugger;
            
    //         if (args.editorRef) {
    //           args.editorRef.databaseId = result.id;
    //         }
    //         resolve(this);

    //       }).catch(errorResponse => {

    //         if (errorResponse.error) {
    //           if (errorResponse.error.existingDoc) {
    //             // this.showModalWindow("document with name ${args.name")

                
    //             let overwriteAlert = this.alertCtrl.create({
    //               header: `Document ${args.options.name} already exists. Overwrite?`,
    //               buttons: [
    //                 {
    //                   text: "yes",
    //                   handler: () => {

    //                     let d = { name: args.options.name, content: args.options.string, description_long: args.options.description_long, description_short: args.options.description_short, id: errorResponse.error.existingDoc.id };
    //                     this.documentSource.apiUpdate(d).then(result => {
                          
    //                       resolve(this);
    //                     }).catch(secondError => {
    //                       console.error(secondError);
    //                       reject(secondError);
    //                     })

    //                   }
    //                 }, 'no']
    //             })
    //             overwriteAlert.then(c => c.present());
    //           } else {
    //             reject(errorResponse.error);
    //           }
    //         }
    //         console.error(errorResponse);
    //       });
    //       this.clearActiveCommandLine()
    //     });


    // this.commandRegistry.addCommand("delete documents", "delete documents from database", "documents")
    //   .option('-d, --documents [documents]', "documents to delete")
    //   .option('-y, --yes', "don't ask for confirmation")
    //   .action((args, commandString, resolve, reject) => {
        

    //     let doDeleteDocuments = (documents) => {
    //       this.global.document.delete(documents).then((result) => {
    //         //TODO: give some event indication
    //         resolve(this);
    //       }).catch(error => {
    //         reject(error);
    //       })
    //     }
    //     if (!args.options.yes) {
    //       //delete documents alert
    //       this.alertCtrl.create({
    //         header: `Warning!`,
    //         message: `About to delete document${args.options.documents.length - 1 ? 's' : ''} '${args.options.documents.toString()}'. Proceed?`,
    //         buttons: [
    //           {
    //             text: "yes",
    //             handler: () => {
    //               doDeleteDocuments(args.options.documents)
    //             }
    //           }, 'no']
    //       }).then(c => c.present());

    //     }
    //     else {

    //     }

    //     this.clearActiveCommandLine()
    //   })




    // this.commandRegistry.addCommand('editor', 'bring up editor JS', 'documents')
    //   .action((args, commandString, resolve, reject) => {
    //     this.clearActiveCommandLine();
    //     let components = this.insertComponent(EditorComponent, commandString);
    //     let editor = components.component;
    //     components.cmdContainer.commandString = commandString;
       
    //     resolve(this);
    //   })


    // this.commandRegistry.addCommand("create rule <name>", 'create a new  rule', "allocation rules")
    //   .option('-r, --rule <rule>', 'json for rule content')
    //   .option('-t, --type <type>', 'type of rule')
    //   .action((args, commandString, resolve, reject) => {
        

    //     let type;
    //     if (Array.isArray(args.options.type)) { type = args.options.type[0] } else { type = args.options.type }
    //     let rule;
    //     if (Array.isArray(args.options.rule)) { rule = args.options.rule[0] } else { rule = args.options.rule }


    //     if (!rule) {

    //       let components = this.insertComponent(RuleEditorComponent, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let ruleEditor = components.component;

    //       ruleEditor.setConfig({
    //         name: args.name,
    //         rule: rule,
    //         type: type

    //       })
    //       this.clearActiveCommandLine()
    //       resolve(ruleEditor);
    //     } else {
    //       //save it!
    //       this.ruleSource.create({
    //         name: args.name,
    //         rule: rule,
    //         type: type
    //       }).then((result) => {


    //         // this.alertCtrl.create({
    //         //   header: `Rule ${args.name} saved succcessfully`,
    //         //   buttons: ["ok"]
    //         // }).then(a => a.present());
    //         resolve(result);
    //       }).catch((error) => {
    //         let errorMessage = "";
    //         let errorHeader = `Error saving rule ${args.name}`;
    //         if (typeof (error) == "object") {
    //           if (error.error.code == "23505") {
    //             errorHeader = `rule ${args.name} already exists`;
    //             errorMessage = ""
    //           }
    //           error = JSON.stringify(error)
    //         };
    //         this.alertCtrl.create({
    //           header: errorHeader,
    //           message: errorMessage,
    //           buttons: ["ok"]
    //         }).then(a => a.present());
    //         reject(error);
    //       })
    //     }
    //   });

    // this.commandRegistry.addCommand("list rules", "get a list of rules", "allocation rules")
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(RuleList2Component, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()
    //     resolve(this);

    //   })


    // this.commandRegistry.addCommand("open rule <name>", "edit the configuration of an allocation rule", "allocation rules")
    //   .action((args, commandString, resolve, reject) => {


    //     if (!args.name) {
    //       let components = this.insertComponent(RuleEditorComponent, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let ruleEditor = components.component;

    //       resolve(this);
    //     } else
    //       if (!this.global.allocationrulesByName[args.name]) {
    //         this.ruleSource.fetchSingle({ name: args.name }).then((result: any) => {

    //           let components = this.insertComponent(RuleEditorComponent, commandString);
    //           components.cmdContainer.commandString = commandString;
    //           let ruleEditor = components.component;
    //           ruleEditor.setConfig(result);
    //           resolve(this);
    //         }).catch(error => {
    //           console.error(error);
    //           // this.echo(error);
    //           this.alertCtrl.create({
    //             header: `Rule ${args.name} does not exist`,
    //             message: 'Would you like to create it?',
    //             buttons: [
    //               {
    //                 text: "create",
    //                 handler: () => {
    //                   resolve(this.commandRegistry.parseCommand(`create rule ${args.name}`));
    //                 }
    //               },
    //               {
    //                 text: "cancel",
    //                 handler: () => {
    //                   resolve(this);
    //                 }
    //               }]
    //           }).then(a => a.present());
    //         });

    //       } else {

    //         let components = this.insertComponent(RuleEditorComponent, commandString);
    //         components.cmdContainer.commandString = commandString;
    //         let ruleEditor = components.component;
    //         ruleEditor.setConfig(this.global.allocationrulesByName[args.name]);
    //         resolve(this);
    //       }

    //     this.clearActiveCommandLine()


    //   });


    // this.commandRegistry.addCommand("delete rule <name>", "delete one or more rules", "allocation rules")
    //   .option('-r, --rule <rulename>', "name of rule to be deleted")
    //   .action((args, commandString, resolve, reject) => {

    //     this.alertCtrl.create({
    //       header: `Warning`,
    //       message: 'Deleting rules removes associated allocations',
    //       buttons: [
    //         {
    //           text: "cancel",
    //           handler: () => {
    //             resolve(this);
    //           }
    //         },
    //         {
    //           text: "ok",
    //           handler: () => {
    //             let rulenames = args.options.rule || [];
    //             if (args.name) rulenames.push(args.name)
    //             this.ruleSource.delete(rulenames).then(result => {
    //               resolve(this);
    //             }).catch(error => {
    //               console.error(error);
    //             })
    //           }

    //         }]
    //     }).then(a => a.present());
    //   })


    // this.commandRegistry.addCommand("list allocations", "get a list of allocations", "allocation rules")
    //   .remote()
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(AllocationList2Component, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()
    //     resolve(this);

    //   })


    // this.commandRegistry.addCommand("create allocation <allocationName>", 'pair a participant or group with a document via a rule', "allocation rules")
    //   .option('-p, --participant <participant>', 'participant to apply the rule to')
    //   .option('-g, --group <group>', 'group to apply the rule to')
    //   .option('-d, --document <document>', 'document to apply the rule to')
    //   .option('-r, --rule <name>', 'json for rule content')
    //   .action((args, commandString, resolve, reject) => {
        
    //     let components = this.insertComponent(AllocationComposerComponent, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     let allocationComposer = components.component;

    //     let document_name = args.options.document ? args.options.document[0] : null;
    //     let rule_name = args.options.rule ? args.options.rule[0] : null;
    //     allocationComposer.setConfig({
    //       participants: args.options.participant || [],
    //       groups: args.options.group || [],
    //       document_name: document_name,
    //       rule_name: rule_name,
    //       name: args.name,

    //     })
    //     this.clearActiveCommandLine()
    //     resolve(this);
    //   });








    // this.commandRegistry.addCommand("open allocation <name>", "edit the configuration of an allocation rule", "allocation rules")
    //   .action((args, commandString, resolve, reject) => {



    //     if (!args.name) {
    //       let components = this.insertComponent(AllocationComposerComponent, commandString);
    //       components.cmdContainer.commandString = commandString;
    //       let ruleEditor = components.component;

    //       resolve(this);
    //     } else
    //       if (!this.allocationSource.itemsByIndex[args.name]) {
    //         this.allocationSource.fetchSingle({ name: args.name }).then((result: any) => {

    //           let components = this.insertComponent(AllocationComposerComponent, commandString);
    //           components.cmdContainer.commandString = commandString;
    //           let allocationComposer = components.component;
    //           allocationComposer.setConfig(result);
    //           resolve(this);
    //         }).catch(error => {
    //           console.error(error);
    //           this.alertCtrl.create({
    //             header: `Allocation rule ${args.name} does not exist`,
    //             message: 'Would you like to create it?',
    //             buttons: [
    //               {
    //                 text: "create",
    //                 handler: () => {
    //                   resolve(this.commandRegistry.parseCommand(`create allocation ${args.name}`));
    //                 }
    //               },
    //               {
    //                 text: "cancel",
    //                 handler: () => {
    //                   resolve(this);
    //                 }
    //               }]
    //           }).then(a => a.present());
    //         });

    //       } else {

    //         let components = this.insertComponent(AllocationComposerComponent, commandString);
    //         components.cmdContainer.commandString = commandString;
    //         let allocationComposer = components.component;
    //         allocationComposer.setConfig(this.allocationSource.itemsByIndex[args.name]);
    //         resolve(this);
    //       }

    //     this.clearActiveCommandLine()


    //   });

    // this.commandRegistry.addCommand('send cloudmessage', "send a cloudmessage", "cloudmessages")
    //   .option('-i, --id <messageid>', 'when multiple participants are specified for the same message, the messageid is an indicator that all sent messages are of the same content. When a messageid is not provided, a messageid is generated.')
    //   .option('-t, --type <messagetype>', 'type of message, notification or data. Default is notification. WebApps can only receive \'data\' when running in the background, in order to display notifications')
    //   .option('-o, --origin <origin>', 'indicate where the message originated from')
    //   .option('-h, --title <title>', 'title for notification')
    //   .option('-b, --body <body>', 'text of notification')
    //   .option('-k, --key <key>', 'key for data payload. key "openDocument" with document id for value will cause client to open document')
    //   .option('-v, --value <value>', 'value for data payload')
    //   .option('-j, --payload <jsonstring>', 'provide cloudmessage properties as JSON string')
    //   .option('-g, --groups <groups>', 'group to send the notification to')
    //   .option('-p, --participants <participants>', 'participant to send the notification to')
    //   .action((args, commandString, resolve, reject) => {


    //     let messageid, type, origin, title, body, key, value, payload, groups, participants;
    //     if (Array.isArray(args.options.messageid)) { messageid = args.options.messageid[0]; } else { messageid = args.options.messageid }
    //     if (Array.isArray(args.options.type)) { type = args.options.type[0]; } else { type = args.options.type; }
    //     if (Array.isArray(args.options.origin)) { type = args.options.origin[0]; } else { origin = args.options.origin; }
    //     if (Array.isArray(args.options.title)) { title = args.options.title[0]; } else { title = args.options.title; }
    //     if (Array.isArray(args.options.body)) { body = args.options.body[0]; } else { body = args.options.body; }
    //     if (Array.isArray(args.options.payload)) { payload = args.options.payload[0] || {}; } else { payload = args.options.payload || {}; }
    //     participants = args.options.participants || [];
    //     groups = args.options.groups || [];

    //     if ((args.options.participants.length == 0) && (args.options.groups.length == 0)) {
    //       this.alertCtrl.create({
    //         header: "No recepients chosen",
    //         message: "You have chosen no participants or groups to send to",
    //         buttons: ["ok"]

    //       }).then(c => c.present());
    //       resolve();
    //       return;
    //     }



    //     // figure out the payload

    //     key = args.options.key || [];
    //     value = args.options.value || [];

    //     messageid = messageid || ["cloudmsg_at_" + new Date().getTime()];

    //     let cloudMessage = new Cloudmessage();
    //     cloudMessage.set({
    //       messageid, type, origin, title, body, key, value, payload, groups, participants
    //     })





    //     let keyValues = Object.assign({}, payload.data || {})

    //     for (let i = 0; i < key.length; i++) {
    //       keyValues[key[i]] = value[i] || null;
    //     }
    //     if (type == "dataNotification") {
    //       if (title) {
    //         keyValues["title"] = title;
    //       }
    //       if (body) {
    //         keyValues["body"] = body;
    //       }
    //     }

    //     cloudMessage.payload["data"] = keyValues;

    //     let sendCloudmessage = () => {
    //       this.cloudmessageSource.send(cloudMessage.get()).then((result: any) => {

            
    //         let firebaseSuccess = [];
    //         let firebaseError = [];
    //         let firebaseSuccessString = "";
    //         let firebaseErrorString = "";
    //         for (let i = 0; i < result.length; i++) {
    //           if (result[i].success) {
    //             firebaseSuccess.push(result[i])
    //             firebaseSuccessString += " " + result[i].participant;
    //           }
    //           if (result[i].error) {
    //             firebaseError.push(result[i]);
    //             firebaseErrorString += " " + result[i].participant;
    //           }
    //         }

    //         let title = `Firebase reports successful request for ${firebaseSuccess.length} / ${result.length}`
    //         let message = "";
    //         if (firebaseError.length > 0) {
    //           message = "error for " + firebaseErrorString;
    //         } else {
    //           message = "Firebase request was successful for all participants."
    //         }

    //         this.displaySuccess(title, message);
    //         resolve(result);
    //         // this.commandRegistry.parseCommand("list cloudmessages");
    //       }).catch(error => {

    //         this.displayCloudmessageError(error)
    //         console.error(error);
    //         reject(error);
    //       })
    //     } // end function sendCloudmessage


    //     if (cloudMessage.payload.data.cloudmessage_reference_id) {
    //       sendCloudmessage()
    //     } else {

    //       this.cloudmessageSource.save(cloudMessage.get()).then((result: any) => {
    //         cloudMessage.payload.data.cloudmessage_reference_id = result.id;
    //         cloudMessage.payload.data.cloudmessage_reference_uuid = result.uuid;
    //         sendCloudmessage();
    //       })
    //     }

    //   })





    // this.commandRegistry.addCommand('list cloudmessages', "get a list of cloudmessages that have been issued", "cloudmessages")
    //   // TODO:
    //   // .option('-g, --grouped', 'view cloudmessages of the same messageid grouped into one row')
    //   // .option('-e, --expanded', 'view every cloudmessage as an individual row')
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(CloudmessageList2Component, commandString);
    //     components.cmdContainer.commandString = commandString;

    //     this.clearActiveCommandLine()
    //     resolve(this);
    //   })

    // this.commandRegistry.addCommand('open cloudmessage <messageid>', "bring up the details of a specific cloudmesage", "cloudmessages")
    //   // TODO:
    //   // .option('-g, --grouped', 'view cloudmessages of the same messageid grouped into one row')
    //   // .option('-e, --expanded', 'view every cloudmessage as an individual row')
    //   .action((args, commandString, resolve, reject) => {
    //     if (args.messageid) {
    //       this.cloudmessageSource.fetchSingle({ messageid: args.messageid }).then(result => {
    //         let components = this.insertComponent(CloudmessageEditor2Component, commandString);
    //         let cloudmessageEditor = components.component;
    //         components.cmdContainer.commandString = commandString;

    //         if (!result) {
    //           result = { messageid: args.messageid }
    //         }
    //         cloudmessageEditor.setConfig(result);
    //         this.clearActiveCommandLine()
    //         resolve(this);
    //       }).catch(error => {
    //         console.log(error)
    //         reject(error);
    //       })
    //     }
    //     else {
    //       let components = this.insertComponent(CloudmessageEditor2Component, commandString);
    //       let cloudmessageEditor = components.component;
    //       components.cmdContainer.commandString = commandString;
    //       cloudmessageEditor.setConfig();
    //       this.clearActiveCommandLine()
    //     }

    //   })

    // this.commandRegistry.addCommand('cloudmessage report <messageid>', "see how the cloudmessage was delivered", "cloudmessages")
    //   .action((args, commandString, resolve, reject) => {
    //     if (args.messageid) {
    //       this.cloudmessageSource.fetchReport({ messageid: args.messageid }).then(result => {
    //         let components = this.insertComponent(CloudmessageReportComponent, commandString);
    //         let cloudmessageReport = components.component;
    //         components.cmdContainer.commandString = commandString;
    //         cloudmessageReport.setConfig(result);
    //         this.clearActiveCommandLine();
    //         resolve(this);
    //       }).catch(error => {
    //         console.error(error);
    //         reject(error);
    //       })
    //     }
    //   })


    // this.commandRegistry.addCommand('researcherinfo', "show information about this account", "researcher")
    //   .action((args, commandString, resolve, reject) => {
    //     this.storage.get("userLoggedIn").then(result => {
    //       let components = this.insertComponent(ResearcherInfoComponent, commandString);

    //       // let cmdContainer = this.echo(this.black("researcher identification string is ") + this.red(result.identifier));
    //       // cmdContainer.commandString = "researcherinfo";
    //       this.clearActiveCommandLine()
    //       resolve(this);
    //     });
    //   })

    // this.commandRegistry.addCommand('myIdentifier', "print this researcher's identifier string", "researcher")
    //   .action((args, commandString, resolve, reject) => {
    //     this.storage.get("userLoggedIn").then(result => {
    //       this.echo(this.yellow(result.identifier));
    //       this.clearActiveCommandLine()
    //       resolve(this);
    //     });
    //   })



    // this.commandRegistry.addCommand('configure mailserver', "allow sending emails from your smtp account", "researcher")
    //   .action((args, commandString, resolve, reject) => {
    //     // this.storage.get("userLoggedIn").then(result=>{
    //     //   this.echo(this.yellow(result.identifier));
    //     // });
    //     this.modalCtrl.create({ component: EmailServerConfigComponent, componentProps: { args: args, commandString: commandString } }).then(c => c.present());

    //     this.clearActiveCommandLine()
    //     resolve(this);
    //   })

    // this.commandRegistry.addCommand('notifications', "show list of incoming notifications from the server", "researcher")
    //   .action((args, commandString, resolve, reject) => {
    //     let components = this.insertComponent(SocketEventReceiverComponent, commandString);
    //     components.cmdContainer.commandString = commandString;
    //     this.clearActiveCommandLine()
    //     resolve(this);

    //   })

    // this.commandRegistry.addCommand('report <message>', "send a message to the developer", "researcher")
    //   .option('-t, --type', 'indicate severity/nature of report')
    //   .action((args, commandString, resolve, reject) => {

    //     this.clearActiveCommandLine()

    //     if (!args.options.type) {
    //       args.options.type = ["unassigned"];
    //     }

    //     this.api.report(args.message, args.options.type).then((result) => {
    //       resolve(this);
    //     }).catch(error => {
    //       reject(error);
    //     })
    //   })


    // this.commandRegistry.addCommand("test", "conduct a functionality test with a participant or a group", "researcher")
    //   .option('-p, --participant <participant>', "which participant to do it for")
    //   .option('-g, --group <group>', 'which group to do it for')
    //   .action((args, commandString, resolve, reject) => {
    //     this.clearActiveCommandLine()

    //     //check if token for user or users is known

    //     let runTest = (participants) => {
    //       let cloudmessageDocument = EditorComponent.generateDocument("It is meant to be attached to a dataNotification cloumdmessage");

    //       let ruledoc = EditorComponent.generateDocument("It is meant to be opened via a triggered notification");
    //       let alwaysAvailableDoc = EditorComponent.generateDocument("It is meant to be always available");
    //       //prepare an allocation rule for today and save it to the database
    //       let triggeredRule: any = RuleEditorComponent.generateTriggeredAllocationRule()
    //       triggeredRule.participants = participants;
    //       triggeredRule.groups = args.options.group;
    //       triggeredRule.documents = [ruledoc]
    //       triggeredRule.alwaysAvailable = false;
    //       this.global.createAllocationRule(triggeredRule).then((result: any) => {

    //         // this.global.updateAllocationRule(result.id, false, result.name, args.options.participant, args.options.group, [ruledoc] , result.rule).then(result=>{

    //         // })
    //       });

    //       let alwaysAvailableRule: any = AllocationComposerComponent.generateAlwaysAvailableAllocationRule()
    //       alwaysAvailableRule.participants = participants;
    //       alwaysAvailableRule.groups = args.options.group;
    //       alwaysAvailableRule.documents = [alwaysAvailableDoc]
    //       alwaysAvailableRule.alwaysAvailable = true;
    //       this.global.createAllocationRule(alwaysAvailableRule).then(result => {

    //       });

    //     }


    //     let participants = [];

    //     let getParticipantsFromGroups = new Promise((resolve, reject) => {
    //       if (args.options.group) {
    //         this.api.listGroups(args.options.group).then((result: any) => {
    //           for (let i = 0; i < result.rows.length; i++) {
    //             participants = participants.concat(result.rows[i].participants)
    //             resolve(participants)
    //           }
    //         }).catch(error => {
    //           resolve(participants)
    //         })
    //       }
    //     })
    //     getParticipantsFromGroups.then(p => {
    //       participants = participants.concat(p);

    //       //now that we have all the participants, make sure they all have tokens

    //     })
    //     return;
    //     //create a document and save it to the database



    //   })




    // this.commandRegistry.addCommand('logout', "log out of this session", "researcher")
    //   .action((args, commandString) => {

    //     this.storage.set('jwt', null).then(() => {
    //       this.storage.set('email', null).then(() => {
    //         this.storage.set('password', null).then(() => {
    //           this.storage.set('userLoggedIn', null).then(() => {
    //             this.clearActiveCommandLine()

    //             window.location.reload()
    //           })
    //         })
    //       })
    //     })
    //   })



  }


  private clearActiveCommandLine() {
    if (this.commandLine) {
      if (this.commandLine._results[this.activeTab]) {
        this.commandLine._results[this.activeTab].clear();
      }
    }
  }


  // private displaySuccess(title, message) {
  //   this.alertCtrl.create({
  //     header: title,
  //     message: message,
  //     buttons: ["ok"]

  //   }).then(c => c.present());
  // }

  // public displayCloudmessageError(error) {
  //   console.error(error);

  //   let e = error.error;
  //   let message = e.message;
  //   switch (e.code) {
  //     case "messaging/registration-token-not-registered":
  //       message = `firebase token for participant ${e.participant} is invalid`
  //       break;
  //   }

  //   this.alertCtrl.create({
  //     header: `Error`,
  //     message: message,
  //     buttons: ["ok"]

  //   }).then(c => c.present());
  // }



  ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(tabIndex) {

    if (this.commandOutputComponentLists[tabIndex].length > this.limitVisibleCommandOuputComponents) {
      let cmdToHide = this.commandOutputComponentLists[tabIndex].splice(0, 1)[0];
      this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(cmdToHide.hostView))
      this.renderer.setStyle(cmdToHide.instance.element.nativeElement, "opacity", 0);
      //pull it up
      this.renderer.setStyle(cmdToHide.instance.element.nativeElement, "top", `${0 * 35 - 50}px`);
      setTimeout(() => {
        this.renderer.setStyle(cmdToHide.instance.element.nativeElement, "display", `none`);
      }, 600)
      this.hiddenCommandComponents[tabIndex].push(cmdToHide);
      this.commandComponentHistories[tabIndex].push(cmdToHide.instance.commandString);
    }  
  }

  createdComponentsCounter = 0;
  public insertComponent(component?, commandString?): InsertComponentResult {
    //  create a container for the component that presents it as the ouput of a command
    let commandOutputComponentRef = this.componentFactoryResolver.resolveComponentFactory(CommandOutputComponent).create(this.injector);
    let c = commandOutputComponentRef.instance.element.nativeElement
    c.id = this.activeTab + "-" + this.createdComponentsCounter;
    this.createdComponentsCounter++;


    this.outputChildren._results[this.activeTab].insert(commandOutputComponentRef.hostView);
    this.commandOutputComponentLists[this.activeTab].push(commandOutputComponentRef);

    this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(this.activeTab);

    this.renderer.setStyle(c, "opacity", "1");

    let tab = this.activeTab;
    // setTimeout(() => {
    this.resetHeightsForCommandOutputList(tab);
    // }, 1);





    if (commandString) commandOutputComponentRef.instance.commandString = commandString;
    //  insert the container into this cli page

    // this.output.insert(commandOutputComponentContainerRef.hostView);


    //  if there's a component, create it
    if (component) {
      let componentRef: ComponentRef<any> = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);
      //  insert the component into the container
      commandOutputComponentRef.instance.container.insert(componentRef.hostView);
      // this.scrollToBottom();
      //add the componentRef object to this element so we can tell it to destroy itself
      commandOutputComponentRef.instance.ref = commandOutputComponentRef;
      commandOutputComponentRef.instance.containedComponent = componentRef.instance;

      return { component: componentRef.instance, cmdContainer: commandOutputComponentRef.instance };
    }
    else {
      // this.scrollToBottom();
      //add the componentRef object to this element so we can tell it to destroy itself
      commandOutputComponentRef.instance.ref = commandOutputComponentRef;

      return { component: null, cmdContainer: commandOutputComponentRef.instance };
    }
  }




  findComponentIndex(element, tabIndex?) {
    if (typeof tabIndex != "undefined") {
      for (let i = 0; i < this.commandOutputComponentLists[tabIndex].length; i++) {
        let el = this.commandOutputComponentLists[tabIndex][i].instance.element.nativeElement;
        if (el === element) {
          return i;
        }
      }
      return -1;
    } else {
      for (let i = 0; i < this.splits; i++) {
        let index = this.findComponentIndex(element, i)
        if (index != -1) {
          return { tab: i, index: index }
        }
      }
      console.error("should be impossible to not find it!!");
      return -1;
    }
  }


  bringCommandOutputToFront(event, tabIndex) {
    event.stopPropagation();


    let componentIndex = this.findComponentIndex(event.srcElement, tabIndex);

    //if commandOutput is already in front you should do nothing
    if (componentIndex === this.commandOutputComponentLists[tabIndex].length - 1) {
      return;
    }

    let component = this.commandOutputComponentLists[tabIndex].splice(componentIndex, 1)[0];
    this.commandOutputComponentLists[tabIndex].push(component);



    this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(component.hostView))
    setTimeout(() => {
      let insertResult = this.outputChildren._results[tabIndex].insert(component.hostView);



      //TODO: change it also for commandComponentHistories
      if (this.commandComponentHistories[tabIndex].length > 0) {
        let cHistory = this.commandComponentHistories[tabIndex].splice(componentIndex, 1)[0];
        this.commandComponentHistories[tabIndex].push(cHistory);
      }



      this.resetHeightsForCommandOutputList(tabIndex);

      this.changeDetector.detectChanges();


    });

  }

  bringCommandOutputHistoryToFront(event, tabIndex, componentIndex) {
    let component = this.hiddenCommandComponents[tabIndex].splice(componentIndex, 1)[0];
    



    this.renderer.setStyle(component.instance.element.nativeElement, "display", "block");
    this.renderer.setStyle(component.instance.element.nativeElement, "opacity", "1");
    this.commandOutputComponentLists[tabIndex].push(component);

    // let res1 = this.outputChildren._results[tabIndex].detach(this.outputChildren._results[tabIndex].indexOf(component.hostView))
    let res2 = this.outputChildren._results[tabIndex].insert(component.hostView);

    //remove it from commandComponentHistories
    this.commandComponentHistories[tabIndex].splice(componentIndex, 1)[0];
    // this.commandComponentHistories[tabIndex].push(cHistory);

    this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(tabIndex);

    this.changeDetector.detectChanges();
    this.resetHeightsForCommandOutputList(tabIndex);
  }


  resetHeightsForCommandOutputList(tab) {
    let maxHeight = parseInt(window.getComputedStyle(this.outputContainerChildren.toArray()[tab].element.nativeElement).height);
    for (let i = 0; i < this.commandOutputComponentLists[tab].length; i++) {
      let top = i * 35;
      let height = maxHeight - top;

      let elem = this.commandOutputComponentLists[tab][i].instance.element.nativeElement;
      this.renderer.setStyle(elem, "top", `${top}px`);
      this.renderer.setStyle(elem, "z-index", 20 * i);
      this.renderer.setStyle(elem, "height", `${height}px`);
    }

  }


  destroyCommandOutputEvent(event, tabIndex) {
    event.stopPropagation();
    let componentIndex = this.findComponentIndex(event.srcElement, tabIndex);
    this.commandRegistry.parseCommand(`destroy card ${tabIndex + 1},${componentIndex + 1}`);
  }

  destroyCommandOutput(tabIndex, componentIndex) {

    let comp = this.commandOutputComponentLists[tabIndex].splice(componentIndex, 1)[0];
    let elem = comp.instance.element.nativeElement;

    this.resetHeightsForCommandOutputList(tabIndex);
    this.renderer.setStyle(elem, "opacity", 0);
    //pull it down
    this.renderer.setStyle(elem, "top", `${componentIndex * 35 + 500}px`);
    setTimeout(() => {
      comp.destroy();
    }, 600)
  }




  // addObjectListForResult(result) {

  //   let objectListComponentRef: ComponentRef<any> = this.componentFactoryResolver.resolveComponentFactory(ObjectListComponent).create(this.injector);
  //   objectListComponentRef.instance.setList(result);

  //   let outputRef = this.componentFactoryResolver.resolveComponentFactory(CommandOutputComponent).create(this.injector);
  //   outputRef.instance.commandString = result.commandString;

  //   outputRef.instance.container.insert(objectListComponentRef.hostView);
  //   this.output.insert(outputRef.hostView);
  // }


  shouldRenderSeparator(i) {
    let val = (this.commandOutputComponentLists.length > 1) && (i < this.commandOutputComponentLists.length - 1)
    return val;

  }


  scrollToBottom() {

    // setTimeout(() => {
    //   this.outputContainerChildren._results[this.activeTab].element.nativeElement.scroll({
    //     top: this.outputContainerChildren._results[this.activeTab].element.nativeElement.scrollHeight,
    //     behavior: 'smooth'
    //   });
    //   // this.outputContainer.nativeElement.scroll({
    //   //   top: this.outputContainer.nativeElement.scrollHeight,
    //   //   behavior: 'smooth'
    //   // });
    // }, 100);
  }


  setFocusToCommandLine() {
    this.commandLine._results[this.activeTab].setFocusToCommandLine();
  }


  // public executeSocketCommand(commandString) {
  //   let command = commandString + ` -r ${this.global.researcher_email}`;
    
  //   this.SocketService.socket.emit("exec_command", command);
  // }
  // public executeLocalCommand(commandString) {
  //   //let command = new OpCommand(commandString);

  // }


  indexOfSeparatorMouseDown = null;;
  panelSeparatorMousedown(event, index) {

    this.splitSeparatorArr[index].mousedown = true;
    this.indexOfSeparatorMouseDown = index;

  }

  panelSeparatorMouseup(event, index) {

  }
  panelContainerMouseUp(event) {
    for (let i = 0; i < this.splitSeparatorArr.length; i++) {
      this.splitSeparatorArr[i].mousedown = false;
    }
    this.indexOfSeparatorMouseDown = null;
  }

  lastMouseMoveEvent;


  panelContainerMousemove(event) {
    this.lastMouseMoveEvent = event;
    let index = this.indexOfSeparatorMouseDown;

    if (index === null) return;
    if (this.splitSeparatorArr[index].mousedown) {

      let movePercent = 100 * event.movementX / parseInt(window.getComputedStyle(this.panelContainer.nativeElement).width)

      this.splitWidthArr[index] += movePercent;
      if (this.splitWidthArr[index + 1]) {
        this.splitWidthArr[index + 1] -= movePercent;
      }

    }
    this.changeDetector.detectChanges();
  }


  startMovingCommandOutput = false;
  startMovingCommandOutputStartX = 0;
  startMovingCommandOutputStartY = 0;
  startMovingCommandOutputMovementX = 0;
  startMovingCommandOutputMovementY = 0;
  startMovingCommandOutputTimeout;
  panelBoundingClientRects = [];

  commandOutputNativeElementToMoveAround = null;
  commandOutputNativeElementOriginalZIndex;
  headerDragX = 0;
  headerDragY = 0;
  commandOutputHeaderMouseDownEvent;

  commandOutputHeaderHasMouseDown(event) {
    this.commandOutputHeaderMouseDown = true;
    this.commandOutputNativeElementToMoveAround = event.detail.element;
    this.commandOutputHeaderMouseDownEvent = event.detail.mouseDownEvent;
    this.headerDragX = 0;
    this.headerDragY = 0;
  }

  checkDragToDecideIfItShouldMove() {
    if (this.commandOutputHeaderMouseDown) {
      //start moving based on drag
      this.headerDragX += this.lastMouseMoveEvent.movementX;
      this.headerDragY += this.lastMouseMoveEvent.movementY;

      if (Math.pow(this.headerDragX, 2) + Math.pow(this.headerDragX, 2) > 500) {
        this.prepareStartMoving();
        return true;
      }
    } else {
      this.headerDragX = 0;
      this.headerDragY = 0;
      return false;
    }

  }

  prepareStartMoving() {
    this.startMovingCommandOutput = true;
    this.panelBoundingClientRects = [];
    for (let i = 0; i < this.panelChildren.toArray().length; i++) {
      this.panelBoundingClientRects.push(this.panelChildren.toArray()[i].nativeElement.getBoundingClientRect())
    }
    let movingBox = this.commandOutputNativeElementToMoveAround.getBoundingClientRect();
    let mme = this.lastMouseMoveEvent;


    // this.startMovingCommandOutputMovementX += mme.pageX - movingBox.x - 20;
    // this.startMovingCommandOutputMovementY += mme.pageY - movingBox.y - 20;
    this.startMovingCommandOutputMovementX += mme.pageX - movingBox.x - this.commandOutputHeaderMouseDownEvent.offsetX;
    this.startMovingCommandOutputMovementY += mme.pageY - movingBox.y - this.commandOutputHeaderMouseDownEvent.offsetY;
    

  }





  mouseMoveWhileCommandOutputMouseDown(event) {
    if (!this.commandOutputHeaderMouseDown) return;
    if (this.commandOutputComponentLists.length == 1) return;

    if (this.checkDragToDecideIfItShouldMove() == false) return;

    if (!this.startMovingCommandOutput) return;
    this.commandOutputNativeElementToMoveAround.style.opacity = "0.7";

    this.commandOutputNativeElementToMoveAround.style.transform = `translate(${this.startMovingCommandOutputMovementX}px, ${this.startMovingCommandOutputMovementY}px)`

    this.commandOutputNativeElementOriginalZIndex = this.commandOutputNativeElementToMoveAround.style.zIndex;
    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "z-index", 3000);
    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "position", "absolute");

    let cRect = this.commandOutputNativeElementToMoveAround.getBoundingClientRect();
    let x2 = cRect.x; let l2 = cRect.width;
    let y2 = cRect.y; let h2 = cRect.height;

    let overlaps = [];
    let wh = []
    this.indexOfPanelWithMaximumOverlap = -1;
    let chosenRect;
    let currentMaxOverlap = 0;
    for (let i = 0; i < this.panelBoundingClientRects.length; i++) {
      let sRect = this.panelBoundingClientRects[i];
      let x1 = sRect.x; let l1 = sRect.width;
      let y1 = sRect.y; let h1 = sRect.height;
      let w = 0; let h = 0;

      if (((x2 + l2) > x1) && (x2 < (x1 + l1))) {
        if (x1 - x2 > 0) { w = x2 + l2 - x1; }
        else { w = x1 + l1 - x2; }
      }
      if (((y2 + h2) > y1) && (y2 < (y1 + h1))) {
        if (y1 - y2 > 0) { h = y2 + h2 - y1; }
        else { h = y1 + h1 - y2; }

      }
      let o = w * h
      overlaps.push(o);


      if (i > 0) {
        if (o >= currentMaxOverlap) {
          currentMaxOverlap = o;
          this.indexOfPanelWithMaximumOverlap = i;
          chosenRect = sRect;
        }
      } else {
        currentMaxOverlap = o;
        this.indexOfPanelWithMaximumOverlap = i;
        chosenRect = sRect;
      }
    }

    this.renderer.setStyle(this.dropIntoPanelIndicator.element.nativeElement, "transform", `translate(${chosenRect.x}px, ${chosenRect.y}px)`);
    this.renderer.setStyle(this.dropIntoPanelIndicator.element.nativeElement, "width", chosenRect.width + "px");
    this.renderer.setStyle(this.dropIntoPanelIndicator.element.nativeElement, "height", chosenRect.height - 50 + "px");
    this.renderer.setStyle(this.dropIntoPanelIndicator.element.nativeElement, "display", "block");

  }


  mouseUpWhileCommandOutputMouseDown() {
    this.commandOutputHeaderMouseDown = false;
    if (this.startMovingCommandOutput) {
      this.mouseMoveMustStopBecauseMouseIsUp();
    }

  }

  dropped = false;
  mouseMoveMustStopBecauseMouseIsUp() {

    this.commandOutputHeaderMouseDown = false;
    this.startMovingCommandOutput = false;
    clearTimeout(this.startMovingCommandOutputTimeout);

    this.startMovingCommandOutputMovementX = 0;
    this.startMovingCommandOutputMovementY = 0;

    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "opacity", "1");
    this.renderer.setStyle(this.dropIntoPanelIndicator.element.nativeElement, "display", "none");

    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "transform", "");
    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "z-index", this.commandOutputNativeElementOriginalZIndex);
    this.renderer.setStyle(this.commandOutputNativeElementToMoveAround, "position", "");

    // this.moveCommandOutputToSplitByIndex(this.commandOutputNativeElementToMoveAround, this.indexOfPanelWithMaximumOverlap);
    let tabAndIndex = this.findComponentIndex(this.commandOutputNativeElementToMoveAround);
    this.commandRegistry.parseCommand(`move card ${tabAndIndex.tab + 1},${tabAndIndex.index + 1}, ${this.indexOfPanelWithMaximumOverlap + 1}`);

    this.headerDragX = 0;
    this.headerDragY = 0;
  }

  moveCommandOutputToSplitByIndex(nativeElement, destTab) {
    let tabAndIndex = this.findComponentIndex(nativeElement);
    let tab = tabAndIndex.tab;
    let componentIndex = tabAndIndex.index;

    //detach from one
    let component = this.commandOutputComponentLists[tab].splice(componentIndex, 1)[0];
    this.commandOutputComponentLists[destTab].push(component);



    this.outputChildren._results[tab].detach(this.outputChildren._results[tab].indexOf(component.hostView));
    setTimeout(() => {
      this.outputChildren._results[destTab].insert(component.hostView);

      this.ifCommandOutputsAreMoreThanVisibleLimitHideTheTopOne(destTab);

      this.changeDetector.detectChanges();

      this.resetHeightsForCommandOutputList(tab);
      this.resetHeightsForCommandOutputList(destTab);
      this.changeDetector.detectChanges();
    }, 10)


  }


  setActivePanel(panelIndex) {
    this.activeTab = panelIndex;
  }













































  openMatSelectForCommandHistories(splitIndex) {
    //this.matSelectForCommandHistories
    // let matSelectClicked = this.matSelectForCommandHistories.toArray()[splitIndex].open();

  }



  selectPanel(index) {
    this.activeTab = index;

  }
  selectPanelFromEmptyClick(event, index) {
    event.stopPropagation();
    if (this.commandOutputComponentLists[index].length == 0) {
      this.activeTab = index;
    }
  }

  closeSplit(event, index) {
    // TODOHERE
    event.stopPropagation();
    window.a = this;
    // console.log(this.commandOutputComponentLists);
    let componentList = this.commandOutputComponentLists[index];
    for (let i = 0; i < componentList.length; i++) {
      componentList[i].destroy();
      // this.commandOutputNativeElementLists[index][i].remove()
    }


    this.splits--;
    this.commandOutputComponentLists.splice(index, 1);
    // this.commandOutputNativeElementLists.splice(index, 1);
    this.splitSeparatorArr.splice(index, 1);

    if (this.activeTab > this.splits - 1) {
      this.activeTab = this.splits - 1;
    }

    this.recalcSplitWidths();
    this.changeDetector.detectChanges();

  }





  commandIssued(event: any, activeIndex) {

    event.stopPropagation();
    this.activeTab = activeIndex;
    // let resultPromise: any = this.commandRegistry.parseCommand(event.detail.command, { enterIntoHistory: event.detail.enterIntoHistory, args: event.detail.args });
    let resultPromise = this.commandRegistry.executeCommand(event.detail.command, { enterIntoHistory: event.detail.enterIntoHistory, args: event.detail.args });
    if (resultPromise) {
      resultPromise.then((result) => {
        
        if (event.detail.success) {
          event.detail.success(result);
        }
      }).catch((error) => {

        console.error(error);
        if (event.detail.error) {
          event.detail.error(error)
        }
      })
    }
  }





  ping() {
    debugger;
  }




  localCommands = [
    "?",
    "create document"
  ]
  isLocalCommand(command) {
    for (var i = 0; i < this.localCommands.length; i++) {
      if (command.indexOf(this.localCommands[i]) != -1) {
        return true;
      }
    }
  }

  echo(text) {

    let cmdContainer = this.insertComponent().cmdContainer;
    cmdContainer.placeInContainer(`<div style="user-select:text">${text}</div>`);
    cmdContainer.hideCommand();
    return cmdContainer

  }

  red(text) {
    return `<span style="color:orangered">${text}</span>`;
  }

  yellow(text) {
    return `<span style="color:yellow">${text}</span>`;
  }

  white(text) {
    return `<span style="color:#AAA">${text}</span>`;
  }

  black(text) {
    return `<span style="color:#333">${text}</span>`;
  }

  public commandStringReceived(event) {

    this.commandLine._results[this.activeTab].setText(event.detail);
    this.commandLine._results[this.activeTab].setFocusToCommandLine();
  }


  mouseover(event) {
    

    // this.realtimehelpService.getHelp(event.target);
  }


  keydown(event) {
    
    this.global.keyDown[event.key] = true;
  }

  keyup(event) {
    
    this.global.keyDown[event.key] = false;
  }


}


interface InsertComponentResult {
  component?: any;
  cmdContainer: CommandOutputComponent

}



