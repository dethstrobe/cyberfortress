'use strict';

angular.module('cyberfortressApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.res = {
      rupee: 100
    }

    $scope.controls = {
      menu: true,
      build: null,
      operation: false
    };

    $scope.readableMap = [
      "x_xxxx_x",
      "x      x",
      "x  tt  x",
      "x      x",
      "xxx__xxx"
    ];

    $scope.mapGenerator = function(readableMap) {

      var tileKey = {
        x : 'Wall',
        _ : 'Exit',
        ' ' : 'Empty',
        t : 'Research'
      };

      return $scope.readableMap.map(function(line) {
        return line.split('').map(function(tileType) {
          return {
            type: tileKey[tileType]
          };
        });
      });

    };

    $scope.currentMap = $scope.mapGenerator($scope.readableMap);

    $scope.operation = function () {
      var op = $scope.controls.operation;
      if (op == false) {
        op = true;
      } else {
        op = false;
      }

      $scope.controls.operation = op;
      $scope.display.view.select = null;
    };







    // $scope.awesomeThings = [];

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
  });
