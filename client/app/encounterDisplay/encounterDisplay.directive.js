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
        	renderEncounter();
        };

        var enemy = angular.element('.enemy')[0];
        var hero = angular.element('.operative')[0];
        var combatTime = 0;

        var characters = encounter.characters();

        var updateEncounter = function () {
          if (!encounter.current()) {
        	combatTime = 0;
            pauseEncounterTimer();
          }
          enemy.style.marginLeft = combatTime*characters.opposition[0].reflex%100 + '%';
          hero.style.marginLeft = combatTime*characters.operatives[0].reflex%100 + '%';
          combatTime++;
        };

        scope.$watch(
          function(scope) {return scope.currentEncounter();},
          function (newVar) {
            if(newVar) {
            	combatTime = 0;
            	startEncounterTimer();
            }
          }
        );

        var startEncounterTimer = function () {
          timeoutId = $interval(function() {
            updateEncounter(); // update DOM
          }, 100);
        };

        var pauseEncounterTimer = function () {
        	$interval.cancel(timeoutId);
        }

        var renderEncounter = function () {
        	var scale, 
        		topOffset = 0, 
        		leftOffset = 0;

        	if (canvas.width/2 < canvas.height-100) {
        		scale = canvas.width/6;
        		if (scale*2 < (canvas.height)/2)
        			topOffset = (canvas.height)/2 - (scale*2);
        	} else {
        		scale = (canvas.height-100)/3;
        		leftOffset = canvas.width/2 - (scale*3);
        	}

        	for (var i = 0; i <= 17; i++) {
        		cx.fillStyle = '#fff';
        		cx.fillRect( (scale*i)%(scale*6)+leftOffset, Math.floor(i/6)*scale+topOffset, scale, scale );
        		cx.strokeRect( (scale*i)%(scale*6)+leftOffset, Math.floor(i/6)*scale+topOffset, scale, scale );
        		console.log((scale*i)%(scale*6), Math.floor(i/6)*scale);
        	};
        };

        renderEncounter();


      }
    };
  });
