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
          },
          speed: 0,
          speedMod: 0,
          location: {
            x: 3,
            y: 1
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
          },
          speed: 0,
          speedMod: 0,
          location: {
            x: 2,
            y: 1
          }
        }
      ]
    };

    var actions = {
      Melee: function (attacker, attackRoll, defender, defendRoll) {
        var attackMod = attacker.reflex + attacker.skills.melee + attackRoll;
        var defendMod = defender.reflex + defender.intellegence + defendRoll;

        if (attackMod > defendMod) {
          var bonusDamage = attackMod - defendMod,
              damage = attacker.strength + bonusDamage - defender.strength;
          if (damage > 0)
            return defender.hp -= damage;

        } else {
          console.log("Attack Missed");
        }
      }
    }

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

      action : function (attacker, defender, actionType) {
        var attackRoll = Math.ceil(Math.random()*10);
        var defendRoll = Math.ceil(Math.random()*10);
        //console.log(actionType);
        
        actions[actionType] (attacker, attackRoll, defender, defendRoll);

        console.log(attacker.name, defender.hp);
      },

      actionList : function () {
        return Object.keys(actions);
      }

    };
  });
