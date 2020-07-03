import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseCLIComponent } from './pulse-cli.component';

describe('PulseCLIComponent', () => {
  let component: PulseCLIComponent;
  let fixture: ComponentFixture<PulseCLIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulseCLIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulseCLIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
