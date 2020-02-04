import { TestBed } from '@angular/core/testing';

import { DbConnectorService } from './db-connector.service';

describe('DbConnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbConnectorService = TestBed.get(DbConnectorService);
    expect(service).toBeTruthy();
  });
});
