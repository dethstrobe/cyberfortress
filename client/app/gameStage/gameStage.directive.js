'use strict';

angular.module('cyberfortressApp')
  .directive('gameStage', function () {
    return {
      templateUrl: 'app/gameStage/gameStage.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });