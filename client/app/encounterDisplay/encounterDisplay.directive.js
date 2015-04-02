'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function ($window, $interval, encounter, CanvasDisplay) {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope) {

      	var charCanvas = angular.element('.character-canvas')[0];
      	charCanvas.width = $window.innerWidth;
      	charCanvas.height = $window.innerHeight;
      	var charCX = charCanvas.getContext('2d');

      	function charRender(cx) {
      		cx.fillStyle = '#f00';
      		cx.fillRect(0, 0, 100, 100);
      	}

      	charRender(charCX);

		var encounterMap = [
			'pppccc',
			'pppccc',
			'pppccc'
		]

		var map = scope.mapGenerator(encounterMap);

       	var display = new CanvasDisplay(angular.element('.background-canvas'), encounterMap, map, scope.controls);

       	var findDisplay = {
       		scale: function (display) {
	       		var canvas = display.canvas;

	       		if (canvas.width/2 < canvas.height-200) {
	        		return display.view.width / 6;
	        	} else {
	        		return (canvas.height-200)/3+12;
	        	}
	        	
	       	},
	       	center: function(dimension, offset) {
	       		return display.canvas[dimension]/2 - (display.level[dimension] * display.level.scale / 2) + offset;
	       	}
        };

       	display.level.scale = findDisplay.scale(display);

       	display.zoomOnCenter(
       		display, 
       		display.level.scale, 
       		{x:0, y:0}, 
       		{x: findDisplay.center('width', 0), y: findDisplay.center('height', -18)}
       	);

       	display.mapRender(map, display);


        scope.encounterDisplayResize = function () {
        	charCX.canvas.width = display.view.width = display.cx.canvas.width = display.canvas.width = $window.innerWidth;
         	charCX.canvas.height = display.view.height = display.cx.canvas.height = display.canvas.height = $window.innerHeight;

         	display.level.scale = findDisplay.scale(display);

         	display.zoomOnCenter(
	       		display, 
	       		display.level.scale, 
	       		{x:0, y:0}, 
	       		{x: findDisplay.center('width', 0), y: findDisplay.center('height', -20)}
	       	);

        	display.mapRender(map, display);
        	charRender(charCX);
        };

        var combatTime = 0;

        var characters = encounter.characters();

		//finds out how fast the character is
		var setCharacterTime = function  (character) {
			//measurement of how fast a character is
			return character.reflex+character.intellegence/( Math.random()* (6 - 3) );
		}

		function characterLoop(characters, loopFn) {
			for (var sides in characters) {
        		characters[sides].forEach(loopFn, sides);
        	}
		};

        var setUpEncounter = function() {

        	characterLoop(characters, 
        		function(element, index, array) {
        			var sides = this;
        			var characterIcon = angular.element('<div/>')
        				.addClass( "unit "+index );

        			angular.element('.'+sides).append(characterIcon);

        			//this sets a character's speed attribute
        			characters[sides][index].speed = setCharacterTime(characters[sides][index]);
        		}
        	);
        };

        setUpEncounter();


        var updateEncounter = function () {
          //if encounter is null, then stop the encounter
          if (!encounter.current()) {
        	combatTime = 0;
            pauseEncounterTimer();
          }

          var actionPhase = function() {

          	characterLoop(characters, 
          		function (element, index, array) {
          			var sides = this;

          			var characterTime = element.speed * (combatTime + element.speedMod);
          			var characterIcon = angular.element('.'+sides+' .'+index);

          			if (characterTime > 100) {
          				if (sides === 'operatives') {
          					pauseEncounterTimer();
          					scope.controls.action.attacker = element;

          					//this needs to be replaced later with a way for the player to select defender
          					scope.controls.action.defender = characters.opposition[0];

          				} else {
          					//needs to be refactored to select better defender
          					encounter.action(element, characters.operatives[0], 'Melee');
        					element.speed = setCharacterTime(element);
          				}
          				
      					element.speedMod = -combatTime;
          				characterIcon.css('margin-left', '100%');

          			} else {
          				characterIcon.css('margin-left', characterTime+'%');
          			}

          		}
          	);
          	
          };

          actionPhase();

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

        var timeoutId = null;

        var startEncounterTimer = function () {
          timeoutId = $interval(function() {
            updateEncounter(); // update DOM
          }, 100);
        };

        var pauseEncounterTimer = function () {
        	$interval.cancel(timeoutId);
        }


        scope.encounterActions = {};

        scope.encounterActions.action = function (attacker, defender, actionType) {
        	encounter.action(attacker, defender, actionType);
        	startEncounterTimer();
        	attacker.speed = setCharacterTime(attacker);
        }



      }
    };
  });
