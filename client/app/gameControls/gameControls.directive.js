'use strict';

angular.module('cyberfortressApp')
  .directive('gameControls', function () {
    return {
      templateUrl: 'app/gameControls/gameControls.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	
      }
    };
  });