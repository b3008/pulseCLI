import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandLineComponent } from './command-line.component';
import { CommandRegistryService } from '../../command-registry.service/command-registry.service';
import { ElementRef, Renderer2 } from '@angular/core';

describe('CommandLineComponent', () => {
  let component: CommandLineComponent;
  let fixture: ComponentFixture<CommandLineComponent>;
  let commandRegistry: jasmine.SpyObj<CommandRegistryService>;
  let renderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    const commandRegistrySpy = jasmine.createSpyObj('CommandRegistryService', [
      'getAutofillSuggestions',
      'getHistoryOneStepBack',
      'getHistoryOneStepForward'
    ]);

    const rendererSpy = jasmine.createSpyObj('Renderer2', [
      'setProperty',
      'setStyle'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommandLineComponent],
      providers: [
        { provide: CommandRegistryService, useValue: commandRegistrySpy },
        { provide: Renderer2, useValue: rendererSpy }
      ]
    }).compileComponents();

    commandRegistry = TestBed.inject(CommandRegistryService) as jasmine.SpyObj<CommandRegistryService>;
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

    fixture = TestBed.createComponent(CommandLineComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default mode', () => {
      expect(component.mode).toBe('normal');
    });

    it('should initialize with default type', () => {
      expect(component.type).toBe('main');
    });

    it('should allow setting mode', () => {
      component.setMode('custom');
      expect(component.mode).toBe('custom');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Create mock divArea element
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      component.divArea = { nativeElement: mockDiv } as ElementRef;
    });

    it('should prevent default on Tab key and trigger autofill', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 9 });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      spyOn(component, 'autofill');

      component.keydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component.autofill).toHaveBeenCalled();
    });

    it('should navigate backwards through history on up arrow', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 38 });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      commandRegistry.getHistoryOneStepBack.and.returnValue('previous command');

      component.keydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(commandRegistry.getHistoryOneStepBack).toHaveBeenCalled();
      expect(component.divArea.nativeElement.innerText).toBe('previous command');
    });

    it('should navigate forwards through history on down arrow', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 40 });
      spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');
      commandRegistry.getHistoryOneStepForward.and.returnValue('next command');

      component.keydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(commandRegistry.getHistoryOneStepForward).toHaveBeenCalled();
      expect(component.divArea.nativeElement.innerText).toBe('next command');
    });

    it('should not update text if history returns null on up arrow', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 38 });
      commandRegistry.getHistoryOneStepBack.and.returnValue(null);
      component.divArea.nativeElement.innerText = 'current text';

      component.keydown(event);

      expect(component.divArea.nativeElement.innerText).toBe('current text');
    });

    it('should not update text if history returns null on down arrow', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 40 });
      commandRegistry.getHistoryOneStepForward.and.returnValue(null);
      component.divArea.nativeElement.innerText = 'current text';

      component.keydown(event);

      expect(component.divArea.nativeElement.innerText).toBe('current text');
    });
  });

  describe('Autofill', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      component.divArea = { nativeElement: mockDiv } as ElementRef;
    });

    it('should autofill with single suggestion', () => {
      component.divArea.nativeElement.innerText = 'hel';
      commandRegistry.getAutofillSuggestions.and.returnValue(['help']);

      component.autofill();

      expect(commandRegistry.getAutofillSuggestions).toHaveBeenCalledWith('hel');
      expect(component.divArea.nativeElement.innerText).toBe('help');
    });

    it('should not autofill with multiple suggestions', () => {
      component.divArea.nativeElement.innerText = 'li';
      commandRegistry.getAutofillSuggestions.and.returnValue(['list', 'list participants', 'list groups']);

      component.autofill();

      expect(component.divArea.nativeElement.innerText).toBe('li');
    });

    it('should not autofill with no suggestions', () => {
      component.divArea.nativeElement.innerText = 'xyz';
      commandRegistry.getAutofillSuggestions.and.returnValue([]);

      component.autofill();

      expect(component.divArea.nativeElement.innerText).toBe('xyz');
    });
  });

  describe('Command Execution', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      component.divArea = { nativeElement: mockDiv } as ElementRef;

      // Mock element ref for dispatching events
      const mockNativeElement = jasmine.createSpyObj('nativeElement', ['dispatchEvent']);
      component.elementRef = { nativeElement: mockNativeElement } as ElementRef;
    });

    it('should dispatch commandIssued event on Enter key', () => {
      const event = new KeyboardEvent('keypress', { keyCode: 13 });
      component.divArea.nativeElement.innerText = 'help';

      const result = component.keypress(event);

      expect(component.elementRef.nativeElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'commandIssued',
          bubbles: true,
          detail: jasmine.objectContaining({
            command: 'help',
            local: false,
            enterIntoHistory: true
          })
        })
      );
      expect(result).toBe(false);
    });

    it('should trim whitespace from command before dispatching', () => {
      const event = new KeyboardEvent('keypress', { keyCode: 13 });
      component.divArea.nativeElement.innerText = '  help  ';

      component.keypress(event);

      expect(component.elementRef.nativeElement.dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          detail: jasmine.objectContaining({
            command: 'help'
          })
        })
      );
    });

    it('should not dispatch event on Shift+Enter', () => {
      const event = new KeyboardEvent('keypress', { keyCode: 13, shiftKey: true });

      component.keypress(event);

      expect(component.elementRef.nativeElement.dispatchEvent).not.toHaveBeenCalled();
    });
  });

  describe('Text Manipulation', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      component.divArea = { nativeElement: mockDiv } as ElementRef;
    });

    it('should set text', () => {
      component.setText('new text');
      expect(component.divArea.nativeElement.innerText).toBe('new text');
    });

    it('should clear text', () => {
      component.divArea.nativeElement.innerText = 'some text';
      renderer.setProperty.and.callFake((el, prop, val) => {
        if (prop === 'innerHTML') {
          el.innerHTML = val;
        }
      });

      component.clear();

      expect(renderer.setProperty).toHaveBeenCalledWith(
        component.divArea.nativeElement,
        'innerHTML',
        ''
      );
    });
  });

  describe('Focus Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      mockDiv.innerText = 'test';
      const textNode = document.createTextNode('test');
      mockDiv.appendChild(textNode);
      component.divArea = { nativeElement: mockDiv } as ElementRef;
    });

    it('should set focus to command line', () => {
      spyOn(component.divArea.nativeElement, 'focus');

      component.setFocusToCommandLine();

      expect(component.divArea.nativeElement.focus).toHaveBeenCalled();
    });

    it('should handle focus when element has no children', () => {
      const emptyDiv = document.createElement('div');
      component.divArea = { nativeElement: emptyDiv } as ElementRef;
      spyOn(emptyDiv, 'focus');

      component.setFocusToCommandLine();

      expect(emptyDiv.focus).toHaveBeenCalled();
    });
  });

  describe('Suggestion Selection', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockDiv = document.createElement('div');
      mockDiv.contentEditable = 'true';
      component.divArea = { nativeElement: mockDiv } as ElementRef;
    });

    it('should set text and focus when suggestion is selected', () => {
      spyOn(component, 'setText');
      spyOn(component, 'setFocusToCommandLine');

      const event = { detail: 'selected suggestion' };
      component.suggestionSelected(event as any);

      expect(component.setText).toHaveBeenCalledWith('selected suggestion');
      expect(component.setFocusToCommandLine).toHaveBeenCalled();
    });
  });

  describe('Speech Bubble', () => {
    beforeEach(() => {
      fixture.detectChanges();
      const mockSpeechContent = document.createElement('div');
      const mockSpeechContainer = document.createElement('div');
      component.speechBubbleContent = { nativeElement: mockSpeechContent } as ElementRef;
      component.speechBubbleContainer = { nativeElement: mockSpeechContainer } as ElementRef;
    });

    it('should display speech bubble with message', () => {
      component.say('test message', 1000);

      expect(component.speechBubbleContent.nativeElement.innerHTML).toBe('test message');
      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.speechBubbleContainer.nativeElement,
        'display',
        'block'
      );
    });

    it('should hide speech bubble after timeout', (done) => {
      component.say('test message', 100);

      setTimeout(() => {
        expect(renderer.setStyle).toHaveBeenCalledWith(
          component.speechBubbleContainer.nativeElement,
          'opacity',
          '0'
        );
        done();
      }, 150);
    });

    it('should show speech bubble container', () => {
      component.showBubbleContainer();

      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.speechBubbleContainer.nativeElement,
        'display',
        'block'
      );
      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.speechBubbleContainer.nativeElement,
        'opacity',
        '1'
      );
    });

    it('should hide speech bubble container with fade', (done) => {
      component.hideBubbleContainer();

      expect(renderer.setStyle).toHaveBeenCalledWith(
        component.speechBubbleContainer.nativeElement,
        'opacity',
        '0'
      );

      setTimeout(() => {
        expect(renderer.setStyle).toHaveBeenCalledWith(
          component.speechBubbleContainer.nativeElement,
          'display',
          'none'
        );
        done();
      }, 700);
    });
  });

  describe('Speech Synthesis', () => {
    beforeEach(() => {
      fixture.detectChanges();
      // Mock speechSynthesis
      (window as any).speechSynthesis = jasmine.createSpyObj('speechSynthesis', ['speak', 'getVoices']);
      (window as any).speechSynthesis.getVoices.and.returnValue([
        { name: 'Voice 1' },
        { name: 'Voice 2' },
        { name: 'Voice 3' },
        { name: 'Voice 4' },
        { name: 'Voice 5' },
        { name: 'Voice 6' },
        { name: 'Voice 7' },
        { name: 'Voice 8' },
        { name: 'Voice 9' },
        { name: 'Voice 10' },
        { name: 'Voice 11' },
        { name: 'Selected Voice' }
      ]);
    });

    it('should speak text', () => {
      component.speak('hello');

      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it('should speak and display text simultaneously', () => {
      const mockSpeechContent = document.createElement('div');
      const mockSpeechContainer = document.createElement('div');
      component.speechBubbleContent = { nativeElement: mockSpeechContent } as ElementRef;
      component.speechBubbleContainer = { nativeElement: mockSpeechContainer } as ElementRef;

      spyOn(component, 'say');
      spyOn(component, 'speak');

      component.speakAndSay('test message', 1000);

      expect(component.say).toHaveBeenCalledWith('test message', 1000);
      expect(component.speak).toHaveBeenCalledWith('test message');
    });
  });

  describe('Input Command Property', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should accept command input', () => {
      component.command = 'test command';
      expect(component.command).toBe('test command');
    });
  });

  describe('Rejection Phrases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have predefined rejection phrases', () => {
      expect(component.rejectionPhrases).toContain('no');
      expect(component.rejectionPhrases).toContain('nope');
      expect(component.rejectionPhrases.length).toBeGreaterThan(0);
    });
  });
});
