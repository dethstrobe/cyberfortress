'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function () {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });