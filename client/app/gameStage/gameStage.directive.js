'use strict';

angular.module('cyberfortressApp')
  .directive('gameStage', function ($window, CanvasDisplay) {
    return {
      restrict: 'EA',
      link: function ($scope, element, attrs) {
      	var map = $scope.currentMap

        //this creates the logic for the canvas
  	    $scope.display = new CanvasDisplay(element, $scope.readableMap, map, $scope.controls);
  	    var display = $scope.display;

      	$scope.display.mapRender(map, display);

        $scope.gameStageResize = function () {

          display.view.width = display.cx.canvas.width = display.canvas.width = $window.innerWidth;
          display.view.height = display.cx.canvas.height = display.canvas.height = $window.innerHeight;

          $scope.display.mapRender(map, display);
        };
      }
    };
  });