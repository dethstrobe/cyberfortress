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

      this.level = level;

      this.view = {
        x: this.canvas.width/2,
        y: this.canvas.height/2,
        width: this.canvas.width,
        height: this.canvas.height
      }
    };


    CanvasDisplay.prototype.mapMove = function(event) {
      if (event.which == 1) {

        //return location of curser of click
        var relativePos = function(event, element) {
          var rect = element.getBoundingClientRect();
          return {
            x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)
          };
        };

        //do onMove function on mousemove
        var trackDrag = function(onMove, onEnd) {
          function end(event) {
            removeEventListener("mousemove", onMove);
            removeEventListener("mouseup", end);
            if (onEnd)
              onEnd(event);
          };
          addEventListener("mousemove", onMove);
          addEventListener("mouseup", end);
        };

        var canvas = this;
        var pos = relativePos(event, canvas);
        var viewPos = $scope.display.view;

        trackDrag(function(event) {
          var currentPos = pos;
          var newPos = relativePos(event, canvas);

          $scope.display.view.x = viewPos.x + newPos.y-currentPos.y;
          $scope.display.view.y = viewPos.y + newPos.x-currentPos.x;
          $scope.renderMap($scope.basicMap, $scope.display);
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
      "xxx__xxx",
    ];

    $scope.display = new CanvasDisplay(document.getElementById('game'), readableMap);

    $scope.display.cx.fillStyle = tileKey.t;
    $scope.display.cx.fillRect(10, 10, 100, 100);
    $scope.display.cx.fillStyle = tileKey[' '];
    $scope.display.cx.fillRect(10, 10, 50, 50);

    $scope.mapGenerator = function(readableMap) {
      var map= [];

      for (var y = 0, ylen = readableMap.length, xlen = readableMap[0].length; y<ylen; y++) {

        var line = readableMap[y], gridRow=[];

        for (var x = 0; x<xlen; x++) {
          //findout what tile is in the human readable map
          var tile = line[x], tileType = tileKey[tile];
          //if tileType exists, add it to the gridrow
          gridRow.push({type: tileType});
        }

        //add new row to map
        map.push(gridRow);
      }

      return map;
    }

    $scope.basicMap = $scope.mapGenerator(readableMap);

    $scope.renderMap = function(mapArr, display) {
      display.cx.clearRect(0, 0, display.cx.canvas.width, display.cx.canvas.height);

      for (var x = 0, xlen = mapArr.length; x<xlen; x++) {
        for (var y = 0, ylen = mapArr[x].length; y<ylen; y++) {

          var tile = mapArr[x][y];

          display.cx.fillStyle = tile.type;
          display.cx.fillRect(y*50 + display.view.y, x*50 + display.view.x, 50, 50);

        }
      }
    }

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
