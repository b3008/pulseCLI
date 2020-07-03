import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '../../pipes/pipes.module';
import { HelpItemComponent } from './help-item.component';

describe('HelpItemComponent', () => {
  let component: HelpItemComponent;
  let fixture: ComponentFixture<HelpItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[PipesModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
