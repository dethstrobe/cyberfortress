'use strict';

describe('Directive: cyberTouch', function () {

  // load the directive's module
  beforeEach(module('cyberfortressApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cyber-touch></cyber-touch>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the cyberTouch directive');
  }));
});