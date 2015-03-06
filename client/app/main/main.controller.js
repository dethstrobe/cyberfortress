'use strict';

angular.module('cyberfortressApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.display = function () {
      
    }

    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");

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

    context.fillStyle = tileKey.t;
    context.fillRect(10, 10, 100, 100);
    context.fillStyle = tileKey[' '];
    context.fillRect(10, 10, 50, 50);

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

    var basicMap = $scope.mapGenerator(readableMap);

    $scope.renderMap = function(mapArr, context) {


      for (var x = 0, xlen = mapArr.length; x<xlen; x++) {
        for (var y = 0, ylen = mapArr[x].length; y<ylen; y++) {

          var tile = mapArr[x][y];

          context.fillStyle = tile.type;
          context.fillRect(y*50, x*50, 50, 50);

        }
      }
    }

    $scope.renderMap(basicMap, context);





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
