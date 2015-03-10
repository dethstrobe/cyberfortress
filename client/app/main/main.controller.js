'use strict';

angular.module('cyberfortressApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    var CanvasDisplay = function (parent, level) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      parent.appendChild(this.canvas);
      this.cx = this.canvas.getContext("2d");

      this.cx.canvas.addEventListener("mousedown", this.mapMove);
      this.cx.canvas.addEventListener("click", this.mapSelect);
      //wheel event for Chrome, Safari, and Opera
      this.cx.canvas.addEventListener("mousewheel", this.mapZoom);
      //wheel event for Firefox
      this.cx.canvas.addEventListener("DOMMouseScroll", this.mapZoom);

      //touch events
      this.cx.canvas.addEventListener("touchstart", this.mapTouchStart);
      this.cx.canvas.addEventListener("touchmove", this.mapMoveTouch);


      window.onresize = function () {
        var display = $scope.display;

        display.view.width = display.cx.canvas.width = display.canvas.width = window.innerWidth;
        display.view.height = display.cx.canvas.height = display.canvas.height = window.innerHeight;

        $scope.renderMap($scope.basicMap, display);
      }

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
      var display = $scope.display

      if (display.view.move == true)
        return display.view.move = false;

      var pos = display.relativePos(event, this);

      var tileLoc = {
        x: Math.floor((pos.x + -display.view.x) / display.level.scale),
        y: Math.floor((pos.y + -display.view.y) / display.level.scale)
      }

      if (typeof $scope.basicMap[tileLoc.y] !== 'undefined' && typeof $scope.basicMap[tileLoc.y][tileLoc.x] !== 'undefined')
        display.view.select = tileLoc;
      else
        display.view.select = {};

      $scope.renderMap($scope.basicMap, $scope.display);

      event.preventDefault();
    }

    CanvasDisplay.prototype.mapZoom = function(event) {

      var display = $scope.display;
      var pos = display.relativePos(event, this);
      var posFromEdge = {
        x: display.view.x - pos.x,
        y: display.view.y - pos.y
      };
      var currentScale = display.level.scale;

      var zoomOnMouse = function () {
        var diffScale = display.level.scale / currentScale;

        display.view.x = posFromEdge.x * diffScale + pos.x;
        display.view.y = posFromEdge.y * diffScale + pos.y;
      }

      if (event.wheelDelta > 0  && display.level.scale < 200 || -event.detail > 0 && display.level.scale < 200) {
        display.level.scale += 10;
        zoomOnMouse();
      }
      else if (event.wheelDelta < 0 && display.level.scale > 50 || -event.detail < 0 && display.level.scale > 50) {
        display.level.scale -= 10;
        zoomOnMouse();
      }

      $scope.renderMap($scope.basicMap, display);

      event.preventDefault();
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
      var display = $scope.display;
      //move map if there is only 1 finger
      if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        display.touch.x = touch.pageX;
        display.touch.y = touch.pageY;
      } else if (event.targetTouches.length == 2) {
        var touch1 = event.targetTouches[0],
            touch2 = event.targetTouches[1];
        display.touch.hypotenuse = Math.sqrt(touch1.pageX * touch1.pageX + touch2.pageX * touch2.pageX);
        
      }

    }

    CanvasDisplay.prototype.mapMoveTouch = function (event) {
      var display = $scope.display;

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

        if (hypoDiff > 0 && display.level.scale < 200)
          display.level.scale += hypoDiff;
        else if (hypoDiff < 0 && display.level.scale > 50)
          display.level.scale += hypoDiff;

        display.touch.hypotenuse = hypo;

      }
      event.preventDefault();

      $scope.renderMap($scope.basicMap, display);
    }

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

      var canvas = this;
      var pos = $scope.display.relativePos(event, canvas);
      var viewPos = $scope.display.view;

      trackDrag(function(event) {
        var newPos = $scope.display.relativePos(event, canvas);

        viewPos.x += newPos.x-pos.x;
        viewPos.y += newPos.y-pos.y;
        $scope.renderMap($scope.basicMap, $scope.display);

        viewPos.move = true;
        pos = newPos;
      });


        event.preventDefault();
      }
    };

    var tileKey = {
      x : 'black',
      _ : 'blue',
      ' ' : 'white',
      t : 'green'
    };

    var readableMap = [
      "x_xxxx_x",
      "x      x",
      "x  tt  x",
      "x      x",
      "xxx__xxx"
    ];

    $scope.display = new CanvasDisplay(document.getElementById('game'), readableMap);

    $scope.mapGenerator = function(readableMap) {

      return readableMap.map(function(line) {
        return line.split('').map(function(character) {
          return {
            type: tileKey[character]
          };
        });
      });

    };

    $scope.basicMap = $scope.mapGenerator(readableMap);

    $scope.renderMap = function(mapArr, display) {

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
      }

      mapLimits("x", "width");
      mapLimits("y", "height");
      

      display.cx.clearRect(0, 0, display.cx.canvas.width, display.cx.canvas.height);

      var location = function (arrLoc, displayLoc) {
        return arrLoc * display.level.scale + display.view[displayLoc]
      }

      mapArr.forEach(function(line, y) {
        line.forEach(function(tile, x) {
          display.cx.fillStyle = tile.type;
          display.cx.fillRect( location(x, "x"), location(y, "y"), display.level.scale, display.level.scale);

          if (Object.keys(display.view.select).length !== 0) {
            display.cx.strokeStyle = "gold";
            display.cx.strokeRect(location( display.view.select.x, "x"), location(display.view.select.y, "y"), display.level.scale, display.level.scale);
          }
        });
      });

    };

    $scope.renderMap($scope.basicMap, $scope.display);








    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
