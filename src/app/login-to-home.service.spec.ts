import { TestBed } from '@angular/core/testing';

import { LoginToHomeService } from './login-to-home.service';

describe('LoginToHomeService', () => {
  let service: LoginToHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginToHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
