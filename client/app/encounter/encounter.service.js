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
          hp: 11,
          sp: 4,
          strength: 5,
          reflex: 6,
          intellegence: 3,
          personality: 1,
          skills: {
            melee: 5,
            range: 4,
            hacking: 0,
            psi: 0,
            talk: 0
          }
        }
      ],
      opposition : [
        {
          name: 'Guard',
          hp: 8,
          sp: 7,
          strength: 4,
          reflex: 4,
          intellegence: 4,
          personality: 3,
          skills: {
            melee: 5,
            range: 4,
            hacking: 0,
            psi: 0,
            talk: 0
          }
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

      characters : function () {
        return characters;
      },

      fight : function (attacker, defender) {
        var attackRoll = Math.ceil(Math.random()*10);
        var defendRoll = Math.ceil(Math.random()*10);
        var attackMod = attacker.reflex + attacker.skills.melee + attackRoll;
        var defendMod = defender.reflex + defender.intellegence + defendRoll;

        if (attackMod > defendMod) {
          var bonusDamage = attackMod - defendMod,
              damage = attacker.strength + bonusDamage - defender.strength;
          defender.hp -= damage;
          console.log(damage, defender.hp);
        } else {
          console.log("Attack Missed");
        }
      }

    };
  });
