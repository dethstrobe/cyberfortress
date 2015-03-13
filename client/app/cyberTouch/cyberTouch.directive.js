'use strict';

angular.module('cyberfortressApp')
  .directive('cyberTouch', function ($parse) {
    return {
    	scope: {
    		cyberTouch: "="
    	},
      restrict: 'EA',
      link: function (scope, element, attrs) {

        element.on('touchstart', function(event) {
        	scope.cyberTouch.mapTouchStart(event.originalEvent);
        });

        element.on('touchmove', function(event) {
          scope.cyberTouch.mapMoveTouch(event.originalEvent);
        });

      }
    };
  });