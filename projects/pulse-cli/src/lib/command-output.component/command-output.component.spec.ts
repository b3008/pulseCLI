import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '../../pipes/pipes.module';
import { HttpClientModule} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { CommandOutputComponent } from './command-output.component';

describe('CommandOutputComponent', () => {
  let component: CommandOutputComponent;
  let fixture: ComponentFixture<CommandOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandOutputComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports:[HttpClientModule, IonicStorageModule.forRoot(), PipesModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
