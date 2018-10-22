import { TestBed, inject } from '@angular/core/testing';

import { Ng2MessageQueue } from './ng2-message-queue.service';

describe('Ng2MessageQueue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ng2MessageQueue]
    });
  });

  it('should be created', inject([Ng2MessageQueue], (service: Ng2MessageQueue) => {
    expect(service).toBeTruthy();
  }));
});
