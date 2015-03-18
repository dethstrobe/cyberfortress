'use strict';

angular.module('cyberfortressApp')
  .factory('MapRenderer', function () {
    return function(mapArr, display) {

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
        Turret: 'orange',
        'Pressure Plate': 'cyan'
      }

      //This renders each tile
      mapArr.forEach(function(line, y) {
        line.forEach(function(tile, x) {
          display.cx.fillStyle = tileColorKey[tile.type];
          display.cx.fillRect( location(x, "x"), location(y, "y"), display.level.scale, display.level.scale);
        });
      });


      //this displays the seleted tile
      if (display.view.select) {
        display.cx.strokeStyle = "gold";

        display.cx.strokeRect(location( display.view.select.x, "x"), location(display.view.select.y, "y"), display.level.scale, display.level.scale);
      }
       

    };
  });
