'use strict';

angular.module('cyberfortressApp')
  .factory('encounter', function () {
    var currentEncounter = null;

    var encounterList = [
      {type: 'Fight', freq: 20},
      {type: 'Social', freq: 50},
      {type: null, freq: 99}
    ]

    var meaningOfLife = 42;

    // Public API here
    return {
      random : function () {
        var randomEncounter = Math.floor(Math.random() * 100);
        for (var i = 0, len = encounterList.length; i< len ; i++) {
          if (randomEncounter < encounterList[i]['freq']){
            currentEncounter = encounterList[i]['type'];
            break;
          }
        }
      },

      current : function (encounter) {
        if (encounter !== undefined)
          currentEncounter = encounter;
        return currentEncounter;
      }
      
    };
  });
