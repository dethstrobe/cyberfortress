'use strict';

angular.module('cyberfortressApp')
  .directive('gameStage', ['$document', '$window', function ($document, $window) {
    return {
      restrict: 'EA',
      link: function ($scope, element, attrs) {

      	var CanvasDisplay = function (parent, level) {
	      this.canvas = parent[0];
	      this.canvas.width = $window.innerWidth;
	      this.canvas.height = $window.innerHeight;
	      //parent.append(this.canvas);
	      this.cx = this.canvas.getContext("2d");

	      this.cx.canvas.addEventListener("click", this.mapSelect);
	      //wheel event for Chrome, Safari, and Opera
	      this.cx.canvas.addEventListener("mousewheel", this.mapZoom);
	      //wheel event for Firefox
	      this.cx.canvas.addEventListener("DOMMouseScroll", this.mapZoom);

	      //touch events
	      this.cx.canvas.addEventListener("touchstart", this.mapTouchStart);
	      this.cx.canvas.addEventListener("touchmove", this.mapMoveTouch);

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
	        select: {}
	      };
	    };

		CanvasDisplay.prototype.mapSelect = function(event) {

	      if (display.view.move === true)
	        return display.view.move = false;

	      var pos = display.relativePos(event, this);

	      var tileLoc = {
	        x: Math.floor((pos.x + -display.view.x) / display.level.scale),
	        y: Math.floor((pos.y + -display.view.y) / display.level.scale)
	      };

	      if (typeof $scope.basicMap[tileLoc.y] !== 'undefined' && typeof $scope.basicMap[tileLoc.y][tileLoc.x] !== 'undefined')
	        display.view.select = tileLoc;
	      else
	        display.view.select = {};

	      $scope.renderMap($scope.basicMap, display);

	      event.preventDefault();
	    };

	    CanvasDisplay.prototype.mapZoom = function(event) {

	      
	      var pos = display.relativePos(event, this);
	      var posFromEdge = {
	        x: display.view.x - pos.x,
	        y: display.view.y - pos.y
	      };
	      var currentScale = display.level.scale;

	      if (event.wheelDelta > 0  && display.level.scale < 200 || -event.detail > 0 && display.level.scale < 200) {
	        display.level.scale += 10;
	        display.zoomOnCenter(display, currentScale, posFromEdge, pos);
	      }
	      else if (event.wheelDelta < 0 && display.level.scale > 50 || -event.detail < 0 && display.level.scale > 50) {
	        display.level.scale -= 10;
	        display.zoomOnCenter(display, currentScale, posFromEdge, pos);
	      }

	      $scope.renderMap($scope.basicMap, display);

	      event.preventDefault();
	    };

	    CanvasDisplay.prototype.zoomOnCenter = function(display, currentScale, posFromEdge, pos) {

	      var diffScale = display.level.scale / currentScale;

	      display.view.x = posFromEdge.x * diffScale + pos.x;
	      display.view.y = posFromEdge.y * diffScale + pos.y;
	    };


	    //return location of curser of click
	    CanvasDisplay.prototype.relativePos = function(event, element) {
	      var rect = element.getBoundingClientRect();
	      return {
	        x: Math.floor(event.clientX - rect.left),
	        y: Math.floor(event.clientY - rect.top)
	      };
	    };

	    CanvasDisplay.prototype.mapTouchStart = function (event) {
	      
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

	    CanvasDisplay.prototype.mapMoveTouch = function (event) {
	      

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

	      $scope.renderMap($scope.basicMap, display);
	    };

	    CanvasDisplay.prototype.mapMove = function(event) {

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
	        $scope.renderMap($scope.basicMap, display);

	        viewPos.move = true;
	        pos = newPos;
	      });


	        event.preventDefault();
	      }
	    };

	    $scope.display = new CanvasDisplay(element, $scope.readableMap);
	    var display = $scope.display;


    	$scope.renderMap($scope.basicMap, display);

	    //resizes canvas if window size changes
	    $window.onresize = function () {

	      display.view.width = display.cx.canvas.width = display.canvas.width = $window.innerWidth;
	      display.view.height = display.cx.canvas.height = display.canvas.height = $window.innerHeight;

	      $scope.renderMap($scope.basicMap, display);
	    };
      }
    };
  }]);