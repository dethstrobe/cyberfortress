'use strict';

describe('Directive: gameStats', function () {

  // load the directive's module and view
  beforeEach(module('cyberfortressApp'));
  beforeEach(module('app/gameStats/gameStats.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-stats></game-stats>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the gameStats directive');
  }));
});