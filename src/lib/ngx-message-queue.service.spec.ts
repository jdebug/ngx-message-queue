import { TestBed, inject } from '@angular/core/testing';

import { NgxMessageQueue } from './ngx-message-queue.service';

describe('NgxMessageQueue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxMessageQueue]
    });
  });

  it('should be created', inject([NgxMessageQueue], (service: NgxMessageQueue) => {
    expect(service).toBeTruthy();
  }));
});
