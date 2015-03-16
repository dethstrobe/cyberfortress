'use strict';

angular.module('cyberfortressApp')
  .factory('CanvasDisplay', function ($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return function (parent, level, renderMap, map) {
    	var display = this;
    	var renderMap = renderMap;
    	var map = map;

	      this.canvas = parent[0];
	      this.canvas.width = $window.innerWidth;
	      this.canvas.height = $window.innerHeight;
	      this.cx = this.canvas.getContext("2d");

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

	      if (display.view.move === true)
	        return display.view.move = false;
	      var canvas = event.currentTarget;

	      var pos = display.relativePos(event, canvas);

	      var tileLoc = {
	        x: Math.floor((pos.x - display.view.x) / display.level.scale),
	        y: Math.floor((pos.y - display.view.y) / display.level.scale)
	      };

	      if (typeof map[tileLoc.y] !== 'undefined' && typeof map[tileLoc.y][tileLoc.x] !== 'undefined')
	        display.view.select = tileLoc;
	      else
	        display.view.select = null;

	      renderMap(map, display);

	      event.preventDefault();
	    };

	    this.mapAction = function() {

	    }

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

	      renderMap(map, display);

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
	      if (event.targetTouches.length == 1) {
	        var touch = event.targetTouches[0];
	        display.touch.x = touch.pageX;
	        display.touch.y = touch.pageY;
	      } else if (event.targetTouches.length == 2) {
	        var touch1 = event.targetTouches[0],
	            touch2 = event.targetTouches[1];
	        display.touch.hypotenuse = Math.sqrt(touch1.pageX * touch1.pageX + touch2.pageX * touch2.pageX);
	        display.touch.x = (touch1.pageX + touch2.pageX) / 2;
	        display.touch.y = (touch1.pageY + touch2.pageY) / 2;
	      }

	    };

	    this.mapMoveTouch = function (event) {
	      

	      //move map if there is only 1 finger
	      if (event.targetTouches.length == 1) {
	        var touch = event.targetTouches[0];
	        var viewPos = display.view;

	        viewPos.x += touch.pageX - display.touch.x;
	        viewPos.y += touch.pageY - display.touch.y;

	        display.touch.x = touch.pageX;
	        display.touch.y = touch.pageY;

	      //zoom map if there are 2 fingers
	      } else if (event.targetTouches.length == 2) {
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

	      renderMap(map, display);
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
	        renderMap(map, display);

	        viewPos.move = true;
	        pos = newPos;
	      });


	        event.preventDefault();
	      }
	    };
    };
  });
