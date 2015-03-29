'use strict';

angular.module('cyberfortressApp')
  .controller('MainCtrl', function ($scope, $http, socket, encounter, $window) {

    $scope.res = {
      rupee: 100
    };

    $scope.currentEncounter = encounter.current;

    $scope.controls = {
      menu: true,//hide menu
      selectColor: 'gold',//the color of the select border
      build: null,//replace tile
      operation: false,//shadowrun
      action: {//targets of actions
        attacker: null,
        defender: null
      }
    };

    //set up to test fighting
    $scope.currentEncounter('Fight');
    $scope.controls.operation = true;

    $scope.readableMap = [
      'x_xxxx_x',
      'x      x',
      'x  tt  x',
      'x      x',
      'xxx__xxx'
    ];

    $scope.mapGenerator = function(readableMap) {

      var tileKey = {
        x : 'Wall',
        _ : 'Exit',
        ' ' : 'Empty',
        t : 'Research'
      };

      return readableMap.map(function(line) {
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
      if (op === false) {
        op = true;
        $scope.controls.selectColor = 'red';
      } else {
        op = false;
        $scope.controls.selectColor = 'gold';
      }

      $scope.controls.menu = true;
      $scope.controls.operation = op;
      $scope.display.view.select = null;
      $scope.display.mapRender($scope.currentMap, $scope.display);
    };

    //resizes canvas if window size changes
    $window.onresize = function () {
      $scope.gameStageResize();
      $scope.encounterDisplayResize();
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
