import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulseCLIComponent } from './pulse-cli.component';
import { CommandRegistryService } from '../command-registry.service/command-registry.service';
import { PulseCLIService } from '../pulse-cli.service';
import { ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { CommandOutputComponent } from '../components/command-output.component/command-output.component';
import { CommandLineComponent } from '../components/command-line.component/command-line.component';

describe('PulseCLIComponent', () => {
  let component: PulseCLIComponent;
  let fixture: ComponentFixture<PulseCLIComponent>;
  let commandRegistry: jasmine.SpyObj<CommandRegistryService>;
  let pulseCLIService: jasmine.SpyObj<PulseCLIService>;

  beforeEach(async () => {
    // Create spy objects for dependencies
    const commandRegistrySpy = jasmine.createSpyObj('CommandRegistryService', [
      'registerCallbackForWhenCommmandDoesNotExist',
      'addCommand',
      'executeCommand',
      'parseCommand',
      'clearStartupCommands',
      'addToStartupCommands',
      'getHistoryOneStepBack',
      'getHistoryOneStepForward',
      'getAutofillSuggestions'
    ]);

    const pulseCLIServiceSpy = jasmine.createSpyObj('PulseCLIService', [], {
      UI: { cli: [] },
      keyDown: {}
    });

    // Configure addCommand to return a chainable object
    commandRegistrySpy.addCommand.and.returnValue({
      action: jasmine.createSpy('action').and.returnValue(Promise.resolve()),
      option: jasmine.createSpy('option').and.returnValue({
        action: jasmine.createSpy('action').and.returnValue(Promise.resolve())
      })
    });

    await TestBed.configureTestingModule({
      imports: [PulseCLIComponent],
      providers: [
        { provide: CommandRegistryService, useValue: commandRegistrySpy },
        { provide: PulseCLIService, useValue: pulseCLIServiceSpy }
      ]
    }).compileComponents();

    commandRegistry = TestBed.inject(CommandRegistryService) as jasmine.SpyObj<CommandRegistryService>;
    pulseCLIService = TestBed.inject(PulseCLIService) as jasmine.SpyObj<PulseCLIService>;

    fixture = TestBed.createComponent(PulseCLIComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with one panel', () => {
      expect(component.splits).toBe(1);
      expect(component.commandOutputComponentLists.length).toBe(1);
      expect(component.activeTab).toBe(0);
    });

    it('should initialize split widths array', () => {
      expect(component.splitWidthArr.length).toBe(1);
      expect(component.splitWidthArr[0]).toBe(100);
    });

    it('should register UI commands on init', (done) => {
      fixture.detectChanges();

      setTimeout(() => {
        expect(commandRegistry.registerCallbackForWhenCommmandDoesNotExist).toHaveBeenCalled();
        expect(commandRegistry.addCommand).toHaveBeenCalledWith('help', jasmine.any(String), 'help');
        expect(commandRegistry.addCommand).toHaveBeenCalledWith('panel <number>', jasmine.any(String), 'UI');
        done();
      }, 100);
    });

    it('should add itself to global UI.cli array', (done) => {
      fixture.detectChanges();

      setTimeout(() => {
        expect(pulseCLIService.UI.cli).toContain(component);
        done();
      }, 600);
    });
  });

  describe('Panel Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create a new panel', () => {
      const initialSplits = component.splits;
      component.newSplit();

      expect(component.splits).toBe(initialSplits + 1);
      expect(component.commandOutputComponentLists.length).toBe(initialSplits + 1);
      expect(component.commandComponentHistories.length).toBe(initialSplits + 1);
      expect(component.hiddenCommandComponents.length).toBe(initialSplits + 1);
    });

    it('should set new panel as active tab when created', () => {
      component.newSplit();
      expect(component.activeTab).toBe(component.splits - 1);
    });

    it('should recalculate split widths when new panel is added', () => {
      component.newSplit();

      const expectedWidth = 100 / component.splits;
      component.splitWidthArr.forEach(width => {
        expect(width).toBe(expectedWidth);
      });
    });

    it('should select panel by index', () => {
      component.newSplit();
      component.selectPanel(0);

      expect(component.activeTab).toBe(0);
    });

    it('should select panel from empty click only if panel is empty', () => {
      const event = jasmine.createSpyObj('event', ['stopPropagation']);
      component.newSplit();

      // Panel 1 is empty, should select it
      component.selectPanelFromEmptyClick(event, 1);
      expect(component.activeTab).toBe(1);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should not select panel from empty click if panel has components', () => {
      const event = jasmine.createSpyObj('event', ['stopPropagation']);
      component.commandOutputComponentLists[0].push({} as any);
      const previousActiveTab = component.activeTab;

      component.selectPanelFromEmptyClick(event, 0);
      expect(component.activeTab).toBe(previousActiveTab);
    });

    it('should close split and destroy its components', () => {
      const event = jasmine.createSpyObj('event', ['stopPropagation']);
      component.newSplit();

      // Add mock components to second panel
      const mockComponent = jasmine.createSpyObj('ComponentRef', ['destroy']);
      component.commandOutputComponentLists[1].push(mockComponent);

      const initialSplits = component.splits;
      component.closeSplit(event, 1);

      expect(component.splits).toBe(initialSplits - 1);
      expect(mockComponent.destroy).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should adjust active tab if closing a panel before active tab', () => {
      component.newSplit();
      component.newSplit();
      component.activeTab = 2;

      const event = jasmine.createSpyObj('event', ['stopPropagation']);
      component.closeSplit(event, 1);

      expect(component.activeTab).toBe(1);
    });
  });

  describe('Split Width Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should recalculate split widths evenly', () => {
      component.newSplit();
      component.newSplit();
      component.recalcSplitWidths();

      const expectedWidth = 100 / 3;
      expect(component.splitWidthArr.length).toBe(3);
      component.splitWidthArr.forEach(width => {
        expect(width).toBeCloseTo(expectedWidth, 2);
      });
    });

    it('should render separator between panels', () => {
      component.newSplit();

      expect(component.shouldRenderSeparator(0)).toBe(true);
      expect(component.shouldRenderSeparator(1)).toBe(false);
    });

    it('should not render separator when only one panel exists', () => {
      expect(component.shouldRenderSeparator(0)).toBe(false);
    });
  });

  describe('Command Output Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should insert a component', () => {
      const result = component.insertComponent(null, 'test command');

      expect(result.cmdContainer).toBeDefined();
      expect(result.cmdContainer.commandString).toBe('test command');
      expect(component.commandOutputComponentLists[0].length).toBe(1);
    });

    it('should increment created components counter', () => {
      const initialCounter = component.createdComponentsCounter;
      component.insertComponent();

      expect(component.createdComponentsCounter).toBe(initialCounter + 1);
    });

    it('should find component index in specific tab', () => {
      const result = component.insertComponent(null, 'test');
      const element = result.cmdContainer.element.nativeElement;

      const index = component.findComponentIndex(element, 0);
      expect(index).toBe(0);
    });

    it('should return -1 for component not found', () => {
      const fakeElement = document.createElement('div');
      const index = component.findComponentIndex(fakeElement, 0);

      expect(index).toBe(-1);
    });

    it('should destroy command output', () => {
      const result = component.insertComponent();
      const mockComponentRef = jasmine.createSpyObj('ComponentRef', ['destroy']);
      component.commandOutputComponentLists[0][0] = mockComponentRef;

      component.destroyCommandOutput(0, 0);

      setTimeout(() => {
        expect(mockComponentRef.destroy).toHaveBeenCalled();
      }, 700);
    });
  });

  describe('Command History Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should hide oldest command output when limit is exceeded', () => {
      // Create more components than the limit
      for (let i = 0; i < component.limitVisibleCommandOuputComponents + 1; i++) {
        component.insertComponent(null, `command ${i}`);
      }

      expect(component.hiddenCommandComponents[0].length).toBeGreaterThan(0);
      expect(component.commandComponentHistories[0].length).toBeGreaterThan(0);
    });

    it('should bring hidden command output back to front', () => {
      // Create components to exceed limit
      for (let i = 0; i < component.limitVisibleCommandOuputComponents + 2; i++) {
        component.insertComponent(null, `command ${i}`);
      }

      const initialHiddenCount = component.hiddenCommandComponents[0].length;
      const initialVisibleCount = component.commandOutputComponentLists[0].length;

      component.bringCommandOutputHistoryToFront(new Event('click'), 0, 0);

      expect(component.hiddenCommandComponents[0].length).toBe(initialHiddenCount - 1);
      expect(component.commandOutputComponentLists[0].length).toBe(initialVisibleCount + 1);
    });
  });

  describe('Drag and Drop', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.newSplit(); // Create second panel for drag tests
    });

    it('should set commandOutputHeaderMouseDown flag', () => {
      const mockElement = document.createElement('div');
      const mockEvent = new MouseEvent('mousedown');
      const event = {
        detail: { element: mockElement, mouseDownEvent: mockEvent }
      } as any;

      component.commandOutputHeaderHasMouseDown(event);

      expect(component.commandOutputHeaderMouseDown).toBe(true);
      expect(component.commandOutputNativeElementToMoveAround).toBe(mockElement);
    });

    it('should reset drag state on mouse up', () => {
      component.startMovingCommandOutput = true;
      component.commandOutputHeaderMouseDown = true;

      component.mouseUpWhileCommandOutputMouseDown();

      expect(component.commandOutputHeaderMouseDown).toBe(false);
    });

    it('should move command output to different panel', (done) => {
      const result = component.insertComponent(null, 'test command');
      const element = result.cmdContainer.element.nativeElement;

      component.moveCommandOutputToSplitByIndex(element, 1);

      setTimeout(() => {
        expect(component.commandOutputComponentLists[0].length).toBe(0);
        expect(component.commandOutputComponentLists[1].length).toBe(1);
        done();
      }, 50);
    });

    it('should reset panel separator mouse down state on container mouse up', () => {
      component.indexOfSeparatorMouseDown = 0;
      component.splitSeparatorArr[0].mousedown = true;

      const event = new MouseEvent('mouseup');
      component.panelContainerMouseUp(event);

      expect(component.indexOfSeparatorMouseDown).toBeNull();
      expect(component.splitSeparatorArr[0].mousedown).toBe(false);
    });
  });

  describe('Command Execution', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle command issued event', () => {
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        detail: {
          command: 'test command',
          enterIntoHistory: true,
          args: {},
          success: jasmine.createSpy('success'),
          error: jasmine.createSpy('error')
        }
      };

      commandRegistry.executeCommand.and.returnValue(Promise.resolve('result'));

      component.commandIssued(mockEvent as any, 0);

      expect(commandRegistry.executeCommand).toHaveBeenCalledWith(
        'test command',
        { enterIntoHistory: true, args: {} }
      );
      expect(component.activeTab).toBe(0);
    });

    it('should call success callback on command execution success', (done) => {
      const successSpy = jasmine.createSpy('success');
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        detail: {
          command: 'test',
          enterIntoHistory: true,
          success: successSpy
        }
      };

      commandRegistry.executeCommand.and.returnValue(Promise.resolve('result'));

      component.commandIssued(mockEvent as any, 0);

      setTimeout(() => {
        expect(successSpy).toHaveBeenCalledWith('result');
        done();
      }, 100);
    });

    it('should call error callback on command execution failure', (done) => {
      const errorSpy = jasmine.createSpy('error');
      const mockEvent = {
        stopPropagation: jasmine.createSpy('stopPropagation'),
        detail: {
          command: 'test',
          enterIntoHistory: true,
          error: errorSpy
        }
      };

      commandRegistry.executeCommand.and.returnValue(Promise.reject('error'));

      component.commandIssued(mockEvent as any, 0);

      setTimeout(() => {
        expect(errorSpy).toHaveBeenCalledWith('error');
        done();
      }, 100);
    });

    it('should dispatch command string to command line', () => {
      // Mock commandLine ViewChildren
      component.commandLine = {
        _results: [{
          setText: jasmine.createSpy('setText'),
          setFocusToCommandLine: jasmine.createSpy('setFocusToCommandLine')
        }]
      } as any;

      const event = { detail: 'help' };
      component.commandStringReceived(event as any);

      expect(component.commandLine._results[0].setText).toHaveBeenCalledWith('help');
      expect(component.commandLine._results[0].setFocusToCommandLine).toHaveBeenCalled();
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should echo text with HTML', () => {
      const result = component.echo('test text');

      expect(result).toBeDefined();
      expect(result.myHTML).toContain('test text');
    });

    it('should format text as red', () => {
      const result = component.red('error');
      expect(result).toContain('orangered');
      expect(result).toContain('error');
    });

    it('should format text as yellow', () => {
      const result = component.yellow('warning');
      expect(result).toContain('yellow');
      expect(result).toContain('warning');
    });

    it('should format text as white', () => {
      const result = component.white('info');
      expect(result).toContain('#AAA');
      expect(result).toContain('info');
    });

    it('should format text as black', () => {
      const result = component.black('muted');
      expect(result).toContain('#333');
      expect(result).toContain('muted');
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should track keydown events', () => {
      const event = { key: 'Control' } as KeyboardEvent;
      component.keydown(event);

      expect(pulseCLIService.keyDown['Control']).toBe(true);
    });

    it('should track keyup events', () => {
      const event = { key: 'Control' } as KeyboardEvent;
      component.keydown(event);
      component.keyup(event);

      expect(pulseCLIService.keyDown['Control']).toBe(false);
    });
  });

  describe('Z-index Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should bring command output to front', (done) => {
      component.insertComponent(null, 'first');
      const result = component.insertComponent(null, 'second');
      const element = result.cmdContainer.element.nativeElement;

      const event = {
        srcElement: element,
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      component.bringCommandOutputToFront(event as any, 0);

      setTimeout(() => {
        const lastComponent = component.commandOutputComponentLists[0][component.commandOutputComponentLists[0].length - 1];
        expect(lastComponent).toBe(result.cmdContainer.ref);
        expect(event.stopPropagation).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should not reorder if component is already at front', () => {
      const result = component.insertComponent(null, 'only one');
      const element = result.cmdContainer.element.nativeElement;

      const event = {
        srcElement: element,
        stopPropagation: jasmine.createSpy('stopPropagation')
      };

      const initialLength = component.commandOutputComponentLists[0].length;
      component.bringCommandOutputToFront(event as any, 0);

      expect(component.commandOutputComponentLists[0].length).toBe(initialLength);
    });
  });

  describe('Active Panel Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set active panel', () => {
      component.newSplit();
      component.setActivePanel(1);

      expect(component.activeTab).toBe(1);
    });

    it('should focus command line', () => {
      component.commandLine = {
        _results: [{
          setFocusToCommandLine: jasmine.createSpy('setFocusToCommandLine')
        }]
      } as any;

      component.setFocusToCommandLine();

      expect(component.commandLine._results[0].setFocusToCommandLine).toHaveBeenCalled();
    });
  });
});
