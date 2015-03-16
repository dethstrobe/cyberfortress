'use strict';

angular.module('cyberfortressApp')
  .directive('gameStage', function ($window, CanvasDisplay) {
    return {
      restrict: 'EA',
      link: function ($scope, element, attrs) {
      	var map = $scope.currentMap


	    $scope.display = new CanvasDisplay(element, $scope.readableMap, $scope.renderMap, map);
	    var display = $scope.display;


    	$scope.renderMap(map, display);

	    //resizes canvas if window size changes
	    $window.onresize = function () {

	      display.view.width = display.cx.canvas.width = display.canvas.width = $window.innerWidth;
	      display.view.height = display.cx.canvas.height = display.canvas.height = $window.innerHeight;

	      $scope.renderMap(map, display);
	    };
      }
    };
  });