import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandOutputComponent } from './command-output.component';
import { CommandRegistryService } from '../../command-registry.service/command-registry.service';
import { PulseCLIService } from '../../pulse-cli.service';
import { ElementRef, Renderer2 } from '@angular/core';

describe('CommandOutputComponent', () => {
  let component: CommandOutputComponent;
  let fixture: ComponentFixture<CommandOutputComponent>;
  let commandRegistry: jasmine.SpyObj<CommandRegistryService>;
  let pulseCLIService: jasmine.SpyObj<PulseCLIService>;
  let renderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    const commandRegistrySpy = jasmine.createSpyObj('CommandRegistryService', [
      'parseCommand',
      'executeCommand'
    ]);

    const pulseCLIServiceSpy = jasmine.createSpyObj('PulseCLIService', [], {
      UI: { cli: [] },
      keyDown: {}
    });

    const rendererSpy = jasmine.createSpyObj('Renderer2', [
      'listen',
      'setStyle'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommandOutputComponent],
      providers: [
        { provide: CommandRegistryService, useValue: commandRegistrySpy },
        { provide: PulseCLIService, useValue: pulseCLIServiceSpy },
        { provide: Renderer2, useValue: rendererSpy }
      ]
    }).compileComponents();

    commandRegistry = TestBed.inject(CommandRegistryService) as jasmine.SpyObj<CommandRegistryService>;
    pulseCLIService = TestBed.inject(PulseCLIService) as jasmine.SpyObj<PulseCLIService>;
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

    fixture = TestBed.createComponent(CommandOutputComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isHidden).toBe(false);
      expect(component.myHTML).toBe('');
      expect(component.splitContainerIndex).toBe(0);
    });

    it('should dispatch commandOutputComponentInitialized event after view init', (done) => {
      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;

      component.ngAfterViewInit();

      setTimeout(() => {
        expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            type: 'commandOutputComponentInitialized',
            bubbles: true
          })
        );
        done();
      }, 100);
    });

    it('should listen for saveDocument events after view init', (done) => {
      renderer.listen.and.returnValue(() => {});

      component.ngAfterViewInit();

      setTimeout(() => {
        expect(renderer.listen).toHaveBeenCalledWith(
          component.element.nativeElement,
          'saveDocument',
          jasmine.any(Function)
        );
        done();
      }, 100);
    });
  });

  describe('Command String Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update command string', () => {
      const newCommand = 'test command';
      component.updateCommandString(newCommand);

      expect(component.commandString).toBe(newCommand);
    });

    it('should place HTML in container', () => {
      const htmlString = '<p>Test HTML</p>';
      component.placeInContainer(htmlString);

      expect(component.myHTML).toBe(htmlString);
    });

    it('should add HTML to container', () => {
      component.myHTML = '<p>Initial</p>';
      const additionalHTML = '<p>Additional</p>';
      component.addHTMLToContainer(additionalHTML);

      expect(component.myHTML).toBe('<p>Initial</p><p>Additional</p>');
    });
  });

  describe('Header Interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should dispatch bringCommandOutputToFront event on header click', () => {
      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;

      component.outputHeaderClicked();

      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'bringCommandOutputToFront',
          bubbles: true
        })
      );
    });

    it('should dispatch commandOutputHeaderHasMouseDown event on header mouse down', () => {
      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;
      const mockMouseEvent = new MouseEvent('mousedown');

      component.outputHeaderMouseDown(mockMouseEvent);

      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'commandOutputHeaderHasMouseDown',
          bubbles: true,
          detail: jasmine.objectContaining({
            element: mockElement,
            mouseDownEvent: mockMouseEvent
          })
        })
      );
    });

    it('should dispatch commandOutputHeaderHasMouseUp event on header mouse up', () => {
      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;

      component.outputHeaderMouseUp();

      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'commandOutputHeaderHasMouseUp',
          bubbles: true,
          detail: mockElement
        })
      );
    });
  });

  describe('Close Button Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should execute destruction callbacks before destroying', () => {
      const callback1 = jasmine.createSpy('callback1');
      const callback2 = jasmine.createSpy('callback2');

      component.addDestructionCallback(callback1);
      component.addDestructionCallback(callback2);

      component.executeDestructionCallbacks();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should dispatch destroyCommandOutput event when destroy is called', () => {
      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;
      const mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);

      component.destroyCommandOutput(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'destroyCommandOutput',
          bubbles: true
        })
      );
    });

    it('should execute destruction callbacks when destroy is called', () => {
      const callback = jasmine.createSpy('callback');
      component.addDestructionCallback(callback);

      const mockElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.element = { nativeElement: mockElement } as ElementRef;
      const mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);

      component.destroyCommandOutput(mockEvent);

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Command Issued Event', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should stop propagation for local commands', () => {
      const mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);
      mockEvent.detail = { local: true };

      component.commandIssued(mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not stop propagation for non-local commands', () => {
      const mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);
      mockEvent.detail = { local: false };

      component.commandIssued(mockEvent);

      expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
    });
  });

  describe('Change Detection', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should trigger change detection', () => {
      spyOn(component['changeDetector'], 'markForCheck');
      component.detectChanges();

      expect(component['changeDetector'].markForCheck).toHaveBeenCalled();
    });
  });

  describe('Contained Component Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should store reference to contained component', () => {
      const mockComponent = { test: 'component' };
      component.containedComponent = mockComponent;

      expect(component.containedComponent).toBe(mockComponent);
    });

    it('should store component ref', () => {
      const mockRef = { test: 'ref' };
      component.ref = mockRef;

      expect(component.ref).toBe(mockRef);
    });
  });

  describe('Save Document Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call parseCommand when saveDocument event is triggered', (done) => {
      const mockParseResult = { commandObject: {}, finalArguments: {}, commandString: "import document", options: {} }; commandRegistry.parseCommand.and.returnValue(mockParseResult as any);
      renderer.listen.and.callFake((element, event, handler) => {
        if (event === 'saveDocument') {
          // Simulate event
          setTimeout(() => {
            handler({
              detail: {
                name: 'test-doc',
                content: 'test content',
                databaseId: '123',
                editorRef: {}
              }
            });
          }, 100);
        }
        return () => {};
      });

      component.ngAfterViewInit();

      setTimeout(() => {
        expect(commandRegistry.parseCommand).toHaveBeenCalledWith(
          'import document',
          jasmine.objectContaining({
            args: jasmine.objectContaining({
              options: jasmine.objectContaining({
                name: 'test-doc',
                string: 'test content',
                databaseId: '123'
              })
            })
          })
        );
        done();
      }, 200);
    });
  });

  describe('Split Container Index', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should allow setting split container index', () => {
      component.splitContainerIndex = 2;

      expect(component.splitContainerIndex).toBe(2);
    });
  });

  describe('Hidden State', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should allow setting isHidden state', () => {
      component.isHidden = true;

      expect(component.isHidden).toBe(true);
    });
  });
});
