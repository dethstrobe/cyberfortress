'use strict';

describe('Directive: encounterDisplay', function () {

  // load the directive's module and view
  beforeEach(module('cyberfortressApp'));
  beforeEach(module('app/encounterDisplay/encounterDisplay.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<encounter-display></encounter-display>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the encounterDisplay directive');
  }));
});