'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function ($window, $interval, encounter, CanvasDisplay) {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope) {

      	function charCanvasDisplay() {
      		this.canvas = angular.element('.character-canvas')[0];

      		var canvas = this.canvas;
	      	canvas.width = $window.innerWidth;
	      	canvas.height = $window.innerHeight;
	      	var cx = canvas.getContext('2d');

	      	this.render = function (time) {
	      		cx.fillStyle = '#f00';
	      		cx.fillRect(0, 0, 100, 100);
	      	}
      	};

      	var charDisplay = new charCanvasDisplay();
      	charDisplay.render(0);

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
	       	center: function(canvas, level, dimension, offset) {
	       		return canvas[dimension]/2 - (level[dimension] * level.scale / 2) + offset;
	       	}
        };

       	display.level.scale = findDisplay.scale(display);

       	display.zoomOnCenter(
       		display, 
       		display.level.scale, 
       		{x:0, y:0}, 
       		{x: findDisplay.center(display.canvas, display.level, 'width', 0), y: findDisplay.center(display.canvas, display.level, 'height', -18)}
       	);

       	display.mapRender(map, display);


        scope.encounterDisplayResize = function () {
        	charDisplay.canvas.width = display.view.width = display.canvas.width = $window.innerWidth;
         	charDisplay.canvas.height = display.view.height = display.canvas.height = $window.innerHeight;

         	display.level.scale = findDisplay.scale(display);

         	display.zoomOnCenter(
	       		display, 
	       		display.level.scale, 
	       		{x:0, y:0}, 
	       		{x: findDisplay.center(display.canvas, display.level, 'width', 0), y: findDisplay.center(display.canvas, display.level, 'height', -20)}
	       	);

        	display.mapRender(map, display);
        	charRender(charCX);
        };

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


        var encounterTimer = {
        	start: null,
        	pause: false,
        	actionPhase: function(progress) {

				characterLoop(characters, 
					function (element, index, array) {
						var sides = this;

						var characterTime = element.speed * (progress+ element.speedMod);
						var characterIcon = angular.element('.'+sides+' .'+index);

						if (characterTime > 100) {
							if (sides === 'operatives') {
								encounterTimer.pause = true;
								scope.controls.action.attacker = element;

								//this needs to be replaced later with a way for the player to select defender
								scope.controls.action.defender = characters.opposition[0];

							} else {
								//needs to be refactored to select better defender
								encounter.action(element, characters.operatives[0], 'Melee');
								element.speed = setCharacterTime(element);
							}
							
							element.speedMod = -progress;
							characterIcon.css('margin-left', '100%');

						} else {
							characterIcon.css('margin-left', characterTime+'%');
						}

					}
				);
				
			}
        }

        var updateEncounter = function (time) {
        	if (!encounterTimer.start) encounterTimer.start = time;

        	var progress = (time - encounterTimer.start)/360;

			

			if (encounter.current() && !encounterTimer.pause) {

				encounterTimer.actionPhase(progress);
				requestAnimationFrame(updateEncounter);

			} else if (encounterTimer.pause) {
				encounterTimer.start = progress;
				requestAnimationFrame(updateEncounter);
			} else {

				encounterTimer.start = null;

			}

        };


        scope.$watch(
          function(scope) {return scope.currentEncounter();},
          function (newVar) {
            if(newVar) {
            	scope.startEncounter = requestAnimationFrame(updateEncounter); // starts animation
            }
          }
        );

        var timeoutId = null;

        

        var pauseEncounterTimer = function () {
        	cancelAnimationFrame(scope.startEncounter);
        }


        scope.encounterActions = {};

        scope.encounterActions.action = function (attacker, defender, actionType) {
        	encounter.action(attacker, defender, actionType);
        	encounterTimer.pause = false;
        	attacker.speed = setCharacterTime(attacker);
        }



      }
    };
  });
