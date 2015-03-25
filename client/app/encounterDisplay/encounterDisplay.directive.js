'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function ($window, $interval, encounter) {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope) {
      	var canvas = angular.element('.encounter-canvas')[0];
        canvas.width = $window.innerWidth;
        canvas.height = $window.innerHeight - 76;

        var cx = canvas.getContext('2d');
        var timeoutId = null;

        scope.encounterDisplayResize = function () {
        	cx.canvas.width = canvas.width = $window.innerWidth;
        	cx.canvas.height = canvas.height = $window.innerHeight - 76;
        };

        var enemy = angular.element('.enemy')[0];
        var hero = angular.element('.operative')[0];
        var num = 1;

        var updateEncounter = function () {
          enemy.style.marginLeft = num%100 + '%';
          hero.style.marginLeft = num%100 + '%';
          console.log(num++);
          if (!encounter.current()) {
            $interval.cancel(timeoutId);
          }
        };

        scope.$watch(
          function(scope) {return scope.currentEncounter();},
          function (newVar) {
            if(newVar) {
              startEncounterTimer();
            }
          }
        );
        var startEncounterTimer = function () {
          timeoutId = $interval(function() {
            updateEncounter(); // update DOM
          }, 100);
        };

        var renderEncounter = function () {
        	cx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        	cx.fillRect( 20, 20, 200, 100 );
        };

        renderEncounter();


      }
    };
  });
