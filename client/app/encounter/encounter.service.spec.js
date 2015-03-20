'use strict';

describe('Service: encounter', function () {

  // load the service's module
  beforeEach(module('cyberfortressApp'));

  // instantiate service
  var encounter;
  beforeEach(inject(function (_encounter_) {
    encounter = _encounter_;
  }));

  it('should do something', function () {
    expect(!!encounter).toBe(true);
  });

});
