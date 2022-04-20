import { TestBed } from '@angular/core/testing';

import { FileProviderService } from './file-provider.service';

describe('FileProviderService', () => {
  let service: FileProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
