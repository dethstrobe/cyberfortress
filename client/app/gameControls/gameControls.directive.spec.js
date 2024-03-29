'use strict';

describe('Directive: gameControls', function () {

  // load the directive's module and view
  beforeEach(module('cyberfortressApp'));
  beforeEach(module('app/gameControls/gameControls.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-controls></game-controls>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the gameControls directive');
  }));
});