'use strict';

angular.module('cyberfortressApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    var CanvasDisplay = function (parent, level) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = 320;
      this.canvas.height = 568;
      parent.appendChild(this.canvas);
      this.cx = this.canvas.getContext("2d");

      this.cx.canvas.addEventListener("mousedown", this.mapMove);
      this.cx.canvas.addEventListener("click", this.mapSelect);
      //wheel event for Chrome, Safari, and Opera
      this.cx.canvas.addEventListener("mousewheel", this.mapZoom);
      //wheel event for Firefox
      this.cx.canvas.addEventListener("DOMMouseScroll", this.mapZoom);

      this.level = {
        height: level.length,
        width: level[0].length,
        scale: 100
      };

      this.view = {
        x: this.canvas.width/2-(this.level.width * this.level.scale / 2),
        y: this.canvas.height/2-(this.level.height * this.level.scale / 2),
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

      var level = $scope.display.level;

      if (event.wheelDelta > 0  && level.scale < 200 || -event.detail > 0 && level.scale < 200)
        level.scale += 10;
      else if (event.wheelDelta < 0 && level.scale > 50 || -event.detail < 0 && level.scale > 50)
        level.scale -= 10;

      $scope.renderMap($scope.basicMap, $scope.display);

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
          var currentPos = pos;
          var newPos = $scope.display.relativePos(event, canvas);

          $scope.display.view.x = viewPos.x + newPos.x-currentPos.x;
          $scope.display.view.y = viewPos.y + newPos.y-currentPos.y;
          $scope.renderMap($scope.basicMap, $scope.display);

          $scope.display.view.move = true;
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
