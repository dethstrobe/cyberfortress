'use strict';

angular.module('cyberfortressApp')
  .directive('encounterDisplay', function ($window, $interval, encounter, CanvasDisplay) {
    return {
      templateUrl: 'app/encounterDisplay/encounterDisplay.html',
      restrict: 'EA',
      link: function (scope) {

        var characters = encounter.characters();

		//finds out how fast the character is
		var setCharacterTime = function  (character) {
			//measurement of how fast a character is
			var min = 1, max = 1.5;
			var random = Math.random()* (max - min) + min;
			var total = (character.reflex+character.intellegence)/( random );
			
			return total;
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

        setUpEncounter();

		var encounterMap = [
			'pppccc',
			'pppccc',
			'pppccc'
		]

		var map = scope.mapGenerator(encounterMap);

       	var display = new CanvasDisplay(angular.element('.background-canvas'), encounterMap, map, scope.controls);

       	display.level.scale = findDisplay.scale(display);


       	display.zoomOnCenter(
       		display, 
       		display.level.scale, 
       		{x:0, y:0}, 
       		{x: findDisplay.center(display.canvas, display.level, 'width', 0), y: findDisplay.center(display.canvas, display.level, 'height', -18)}
       	);

       	display.mapRender(map, display);


      	var charCanvasDisplay = function () {
      		this.canvas = angular.element('.character-canvas')[0];

      		var canvas = this.canvas;
	      	canvas.width = $window.innerWidth;
	      	canvas.height = $window.innerHeight;
	      	var cx = canvas.getContext('2d');

	      	//canvas.on('click', function(event) {console.log(event)})

	      	var findCharLoc = function(element, dimension, axis, offset) {
	      		return findDisplay.center(display.canvas, display.level, dimension, offset) + element.location[axis] * display.level.scale;
	      	}

	      	this.render = function (time) {
	      		characterLoop(
	      			characters,
	      			function(element, index, array) {
	      				var sides = this;

	      				var xLoc = findCharLoc(element, 'width', 'x', 0);
	      				var yLoc = findCharLoc(element, 'height', 'y', -19);
	      				var frame = Math.floor(time/120);

			      		cx.clearRect(xLoc, yLoc, display.level.scale, display.level.scale);
			      		cx.imageSmoothingEnabled= false;
			      		cx.drawImage(element.sprite, frame%4*32, 0, 32, 32, xLoc, yLoc, display.level.scale, display.level.scale);
	      			}
	      		);
	      	}
      	};

      	var charDisplay = new charCanvasDisplay();

      	charDisplay.canvas.addEventListener('click', function(event) {
      		display.mapSelect(event);
      	});
      	


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
        	//charDisplay.render(0);
        };


        var encounterTimer = {
        	start: null,
        	pause: false,
        	offset: 0,
        	actionPhase: function(progress) {

				characterLoop(characters, 
					function (element, index, array) {
						var sides = this;

						var characterTime = element.speed * (progress+ element.speedMod);
						var characterIcon = angular.element('.'+sides+' .'+index);

						if (characterTime > 100) {
							if (sides === 'operatives') {
								encounterTimer.pause = true;
								encounterTimer.offset = progress;
								scope.controls.action.attacker = element;

								//this needs to be replaced later with a way for the player to select defender
								scope.controls.action.defender = characters.opposition[0];

							} else {
								//needs to be refactored to select better defender
								scope.$apply(
									encounter.action(element, characters.operatives[0], 'Melee')
								);
								
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

  			charDisplay.render(time);

			if (encounter.current() && !encounterTimer.pause) {

				encounterTimer.actionPhase(progress);
				requestAnimationFrame(updateEncounter);

			} else if (encounter.current() && encounterTimer.pause) {

				encounterTimer.start += (progress - encounterTimer.offset)*360;
				requestAnimationFrame(updateEncounter);

			} else {

				encounterTimer.start = encounterTimer.offset = null;
				characterLoop(characters, 
					function (element, index, array) {
						element.speedMod = 0;
						encounterTimer.pause = false;
						element.speed = setCharacterTime(element);
					}
				);

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

        scope.encounterActions.action = function (attacker, defender, actionType, characters) {
        	encounter.action(attacker, defender, actionType);
        	encounterTimer.pause = false;
        	attacker.speed = setCharacterTime(attacker);
        }



      }
    };
  });
