'use strict';

angular.module('cyberfortressApp')
  .factory('encounter', function () {
    var currentEncounter = null;

    var encounterList = [
      {type: 'Fight', freq: 20},
      {type: 'Social', freq: 50},
      {type: null, freq: 99}
    ];

    var characters = {
      operatives : [
        {
          name: 'Street Sam',
          hp: 10,
          sp: 3,
          strength: 5,
          reflex: 5,
          intellegence: 2,
          personality: 1
        }
      ],
      opposition : [
        {
          name: 'Guard',
          hp: 8,
          sp: 5,
          strength: 4,
          reflex: 4,
          intellegence: 3,
          personality: 2
        }
      ]
    };

    // Public API here
    return {
      random : function () {
        var randomEncounter = Math.floor(Math.random() * 100);
        for (var i = 0, len = encounterList.length; i< len ; i++) {
          if (randomEncounter < encounterList[i].freq){
            currentEncounter = encounterList[i].type;
            break;
          }
        }
      },

      current : function (encounter) {
        if (encounter !== undefined) {
          currentEncounter = encounter;
        }
        return currentEncounter;
      },

      characters: function () {
        return characters;
      }

    };
  });
