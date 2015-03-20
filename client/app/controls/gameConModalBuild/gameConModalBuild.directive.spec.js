'use strict';

describe('Directive: gameConModalBuild', function () {

  // load the directive's module and view
  beforeEach(module('cyberfortressApp'));
  beforeEach(module('app/gameConModalBuild/gameConModalBuild.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-con-modal-build></game-con-modal-build>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the gameConModalBuild directive');
  }));
});