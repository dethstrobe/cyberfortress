'use strict';

angular.module('cyberfortressApp')
  .factory('encounter', function () {
    var currentEncounter = null;

    var encounterList = [
      {type: 'Fight', freq: 20},
      {type: 'Social', freq: 50},
      {type: null, freq: 99}
    ];


    var CharacterCreation = function(name, str, ref, intel, per, skills, loc) {
      this.name = name;
      //player attirbutes
      this.strength = str;
      this.reflex = ref;
      this.intellegence = intel;
      this.personality = per;

      //derived stats
      this.hp = {
        max: str + ref,
        current: str + ref
      };

      this.sp = {
        max: intel + per,
        current: intel + per
      };

      //skills
      this.skills = skills;

      this.speed = this.speedMod = 0;

      this.location = {
        x: loc.x,
        y: loc.y
      };

      this.sprite = new Image();
      this.sprite.src = '/assets/images/'+name.replace(/\s+/g, '').toLowerCase()+'.png';
    };

    var characters = {
      operatives : [

        new CharacterCreation('Street Sam', 5, 6, 3, 1, {melee: 5, range: 4}, {x:3, y:1})

      ],
      opposition : [
        new CharacterCreation('Guard', 4, 4, 4, 3, {melee: 5, range: 4}, {x:2, y:1})
      ]
    };

    var actions = {
      Melee: function (attacker, attackRoll, defender, defendRoll) {
        //check to see if target is in range
        if (attacker.location.x !== defender.location.x + 1 && attacker.location.x !== defender.location.x - 1) {
          console.log('Defender too far');
          return null;
        }

        var attackMod = attacker.reflex + attacker.skills.melee + attackRoll;
        var defendMod = defender.reflex + defender.intellegence + defendRoll;
        console.log(attackMod, defendMod);

        if (attackMod > defendMod) {
          var bonusDamage = attackMod - defendMod,
              damage = attacker.strength + bonusDamage - defender.strength;
          if (damage > 0)
            defender.hp.current -= damage;

          console.log(defender.hp.current);

        } else {
          console.log("Attack Missed");
        }
        return true;
      }
    }

    // Public API here
    return {
      //figures out if there is an encounter
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
        
        var action = actions[actionType] (attacker, attackRoll, defender, defendRoll);

        return action;
      },

      actionList : function () {
        return Object.keys(actions);
      },

      isDead : function (charObject, keyFaction, index) {
        var factionArray = charObject[keyFaction];
        if (factionArray[index].hp.current <= 0) {
          factionArray.splice(index, 1);
          angular.element('.'+keyFaction+' .unit.'+index).remove();
          console.log(angular.element('.'+keyFaction+' .unit.'+index));
          return true;
        } else {
          return false;
        }
      }

    };
  });
