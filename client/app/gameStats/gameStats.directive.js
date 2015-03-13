'use strict';

angular.module('cyberfortressApp')
  .directive('gameStats', function () {
    return {
      templateUrl: 'app/gameStats/gameStats.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });