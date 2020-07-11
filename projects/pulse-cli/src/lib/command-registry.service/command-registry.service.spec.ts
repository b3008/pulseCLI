import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { CommandRegistryService } from './command-registry.service';


describe('CommandRegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientModule]
  }));

  it('should be created', () => {
    const service: CommandRegistryService = TestBed.get(CommandRegistryService);
    expect(service).toBeTruthy();
  });
});
