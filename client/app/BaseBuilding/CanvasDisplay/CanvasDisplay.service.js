'use strict';

angular.module('cyberfortressApp')
  .factory('CanvasDisplay', function ($window, encounter) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return function (parent, level, map, controls) {
    	  var display = this;

	      this.canvas = parent[0];
	      this.canvas.width = $window.innerWidth;
	      this.canvas.height = $window.innerHeight;
	      this.cx = this.canvas.getContext('2d');

	      this.touch = {};

	      this.level = {
	        height: level.length,
	        width: level[0].length,
	        scale: 100
	      };

	      this.view = {
	        x: this.canvas.width/2 - (this.level.width * this.level.scale / 2),
	        y: this.canvas.height/2 - (this.level.height * this.level.scale / 2),
	        width: this.canvas.width,
	        height: this.canvas.height,

	        move: false,
	        select: null
	      };

		this.mapSelect = function(event) {

  			if (display.view.move === true){
          display.view.move = false;
          return;
        }

	    	var mapAction = function(location) {
		    	if (!controls.build) {
		    		return;
          }

		    	map[location.y][location.x].type = controls.build;
		    };

		    var mapCheck = function (tileLoc, currentTile) {
		    	var tileType = map[tileLoc.y][tileLoc.x].type;

          if (encounter.current()) {
            return currentTile;

          } else if (!controls.operation || currentTile === null && tileType === 'Exit') {
		    		return tileLoc;

		    	} else if (currentTile) {
			    	var possibleMoves = [
			    		{x: currentTile.x -1, y: currentTile.y},
			    		{x: currentTile.x +1, y: currentTile.y},
			    		{x: currentTile.x, y: currentTile.y +1},
			    		{x: currentTile.x, y: currentTile.y -1},
			    	];

  					var moveCheck = possibleMoves.map(function(element) {
  						return _.isEqual(tileLoc, element);
  					});
  					if (moveCheck.indexOf(true) >= 0 && tileType !== 'Wall') {
  						encounter.random();
  			    		return tileLoc;
			    	}
		    	}

	    		return currentTile;
		    };

  			var canvas = event.currentTarget;

  			var pos = display.relativePos(event, canvas);

  			var tileLoc = {
  				x: Math.floor((pos.x - display.view.x) / display.level.scale),
  				y: Math.floor((pos.y - display.view.y) / display.level.scale)
  			};

  			if (display.view.select && tileLoc.y === display.view.select.y && tileLoc.x === display.view.select.x) {
  				mapAction(tileLoc);

  			} else if (typeof map[tileLoc.y] !== 'undefined' && typeof map[tileLoc.y][tileLoc.x] !== 'undefined') {
  				display.view.select = mapCheck(tileLoc, display.view.select);

        } else if (controls.operation) {
          return;

        } else {
  				display.view.select = null;
        }


  			display.mapRender(map, display);
        event.preventDefault();
	    };

	      this.mapZoom = function(event) {
	      var pos = display.relativePos(event.originalEvent, this.cx.canvas);
	      var posFromEdge = {
	        x: display.view.x - pos.x,
	        y: display.view.y - pos.y
	      };
	      var currentScale = display.level.scale;

	      if (event.originalEvent.deltaY < 0  && display.level.scale < 200) {
	        display.level.scale += 10;
	        display.zoomOnCenter(display, currentScale, posFromEdge, pos);
	      }
	      else if (event.originalEvent.deltaY > 0 && display.level.scale > 50) {
	        display.level.scale -= 10;
	        display.zoomOnCenter(display, currentScale, posFromEdge, pos);
	      }

	      display.mapRender(map, display);

	      event.preventDefault();
	    };

	    this.zoomOnCenter = function(display, currentScale, posFromEdge, pos) {

	      var diffScale = display.level.scale / currentScale;

	      display.view.x = posFromEdge.x * diffScale + pos.x;
	      display.view.y = posFromEdge.y * diffScale + pos.y;
	    };


	    //return location of curser of click
	    this.relativePos = function(event, element) {
	      var rect = element.getBoundingClientRect();
	      return {
	        x: Math.floor(event.clientX - rect.left),
	        y: Math.floor(event.clientY - rect.top)
	      };
	    };

	    this.mapTouchStart = function (event) {

	      //move map if there is only 1 finger
	      if (event.targetTouches.length === 1) {
	        var touch = event.targetTouches[0];
	        display.touch.x = touch.pageX;
	        display.touch.y = touch.pageY;
	      } else if (event.targetTouches.length === 2) {
	        var touch1 = event.targetTouches[0],
	            touch2 = event.targetTouches[1];
	        display.touch.hypotenuse = Math.sqrt(touch1.pageX * touch1.pageX + touch2.pageX * touch2.pageX);
	        display.touch.x = (touch1.pageX + touch2.pageX) / 2;
	        display.touch.y = (touch1.pageY + touch2.pageY) / 2;
	      }

	    };

	    this.mapMoveTouch = function (event) {


	      //move map if there is only 1 finger
	      if (event.targetTouches.length === 1) {
	        var touch = event.targetTouches[0];
	        var viewPos = display.view;

	        viewPos.x += touch.pageX - display.touch.x;
	        viewPos.y += touch.pageY - display.touch.y;

	        display.touch.x = touch.pageX;
	        display.touch.y = touch.pageY;

	      //zoom map if there are 2 fingers
      } else if (event.targetTouches.length === 2) {
	        var touch1 = event.targetTouches[0];
	        var touch2 = event.targetTouches[1];

	        var hypo =  Math.sqrt(touch1.pageX * touch1.pageX + touch2.pageX * touch2.pageX);
	        var hypoDiff = hypo - display.touch.hypotenuse;

	        var posFromEdge = {
	          x: display.view.x - display.touch.x,
	          y: display.view.y - display.touch.y
	        };
	        var currentScale = display.level.scale;

	        if (hypoDiff > 0 && display.level.scale < 200) {
	          display.level.scale += hypoDiff;
	          display.zoomOnCenter(display, currentScale, posFromEdge, display.touch);
	        } else if (hypoDiff < 0 && display.level.scale > 50){
	          display.level.scale += hypoDiff;
	          display.zoomOnCenter(display, currentScale, posFromEdge, display.touch);
	        }

	        display.touch.hypotenuse = hypo;

	      }
	      event.preventDefault();

	      display.mapRender(map, display);
	    };

	    this.mapMove = function(event) {

	     if (event.which == 1) {

	      //do onMove function on mousemove
	      var trackDrag = function(onMove, onEnd) {
	        function end(event) {
	          removeEventListener("mousemove", onMove);
	          removeEventListener("mouseup", end);
	          if (onEnd)
	            onEnd(event);
	        }
	        addEventListener("mousemove", onMove);
	        addEventListener("mouseup", end);
	      };

	      var canvas = event.currentTarget;
	      var pos = display.relativePos(event, canvas);
	      var viewPos = display.view;

	      trackDrag(function(event) {
	        var newPos = display.relativePos(event, canvas);

	        viewPos.x += newPos.x-pos.x;
	        viewPos.y += newPos.y-pos.y;
	        display.mapRender(map, display);

	        viewPos.move = true;
	        pos = newPos;
	      });


	        event.preventDefault();
	      }
	    };

	    this.mapRender = function (mapArr, display) {

	      //this function restricts how far a map can scroll
	      var mapLimits = function (axis, dimension) {
	        var levelLength = display.level[ dimension ] * display.level.scale,
	            levelPaddedLength = levelLength + display.level.scale * 2,
	            levelDifference = display.view[ dimension ] - levelLength,
	            levelEnd = -(levelLength - display.view[ dimension ] + display.level.scale);

	        if ( levelPaddedLength < display.view[ dimension ]) {

	          if (display.view[ axis ] < 0) {
	            display.view[ axis ] = 0;
	          } else if (display.view[ axis ] > levelDifference) {
	            display.view[ axis ] = levelDifference;
	          }

	        } else {

	          if (display.view[ axis ] > display.level.scale) {
	            display.view[ axis ] = display.level.scale;
	          } else if (display.view[ axis ] < levelEnd) {
	            display.view[ axis ] = levelEnd;
	          }

	        }
	      };

	      mapLimits("x", "width");
	      mapLimits("y", "height");

	      //clear canvas
	      display.cx.clearRect(0, 0, display.cx.canvas.width, display.cx.canvas.height);

	      //this function finds the location of each tile
	      var location = function (arrLoc, displayLoc) {
	        return arrLoc * display.level.scale + display.view[displayLoc];
	      };

	      var tileColorKey = {
	        Wall: '#000',
	        Exit: 'blue',
	        Empty: 'white',
	        Research: 'green',
	        Turret: 'purple',
	        'Pressure Plate': 'cyan'
	      }

	      //This renders each tile
	      mapArr.forEach(function(line, y) {
	      	var yLocation = location(y, "y");
	        line.forEach(function(tile, x) {
	          display.cx.fillStyle = tileColorKey[tile.type];
	          display.cx.fillRect( location(x, "x"), yLocation, display.level.scale, display.level.scale);
	        });
	      });


	      //this displays the seleted tile
	      if (display.view.select) {
	        display.cx.strokeStyle = controls.selectColor;
	        display.cx.lineWidth = 3;

	        display.cx.strokeRect(location( display.view.select.x, "x"), location(display.view.select.y, "y"), display.level.scale, display.level.scale);
	      }


		};
    };
  });
