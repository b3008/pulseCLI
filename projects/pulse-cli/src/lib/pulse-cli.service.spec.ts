import { TestBed } from '@angular/core/testing';

import { PulseCLIService } from './pulse-cli.service';

describe('PulseCLIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PulseCLIService = TestBed.get(PulseCLIService);
    expect(service).toBeTruthy();
  });
});
