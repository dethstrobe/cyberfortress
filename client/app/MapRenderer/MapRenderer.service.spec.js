'use strict';

describe('Service: MapRenderer', function () {

  // load the service's module
  beforeEach(module('cyberfortressApp'));

  // instantiate service
  var MapRenderer;
  beforeEach(inject(function (_MapRenderer_) {
    MapRenderer = _MapRenderer_;
  }));

  it('should do something', function () {
    expect(!!MapRenderer).toBe(true);
  });

});
