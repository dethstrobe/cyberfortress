'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function ($window, encounter) {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      	var canvas = angular.element('.encounter-canvas')[0];

		canvas.width = $window.innerWidth;
		canvas.height = $window.innerHeight - 70;

		var cx = canvas.getContext("2d");

		scope.encounterDisplayResize = function () {
			cx.canvas.width = canvas.width = $window.innerWidth;
			cx.canvas.height = canvas.height = $window.innerHeight - 70;
		};

		var renderEncounter = function () {
			cx.fillStyle = 'rgba(255, 0, 0, 0.3)';
			cx.fillRect( 20, 20, 200, 100 );
		}

		renderEncounter();
      }
    };
  });