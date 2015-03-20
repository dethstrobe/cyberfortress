'use strict';

describe('Service: CanvasDisplay', function () {

  // load the service's module
  beforeEach(module('cyberfortressApp'));

  // instantiate service
  var CanvasDisplay;
  beforeEach(inject(function (_CanvasDisplay_) {
    CanvasDisplay = _CanvasDisplay_;
  }));

  it('should do something', function () {
    expect(!!CanvasDisplay).toBe(true);
  });

});
