'use strict';

describe('Directive: gameStage', function () {

  // load the directive's module and view
  beforeEach(module('cyberfortressApp'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-stage></game-stage>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the gameStage directive');
  }));
});