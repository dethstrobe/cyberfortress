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

      function setSkills(skills) {
        var skillList = {};

        for (var skill in skills) {
          skillList.skill = skills.skill;
        };

        return skillList;
      };

      //skills
      this.skills = setSkills(skills);

      this.speed = this.speedMod = 0;

      this.location = {
        x: loc.x,
        y: loc.y
      };

      this.icon = new Image();
      this.icon.src = '/assets/images/'+name.replace(/\s+/g, '').toLowerCase()+'.png';
    };

    var characters = {
      operatives : [

        new CharacterCreation('Street Sam', 5, 6, 3, 1, {melee:5, range: 4}, {x:3, y:1})

      ],
      opposition : [
        new CharacterCreation('Guard', 4, 4, 4, 3, {melee:5, range: 4}, {x:2, y:1})
      ]
    };

    var actions = {
      Melee: function (attacker, attackRoll, defender, defendRoll) {
        console.log(attacker, defender);
        var attackMod = attacker.reflex + attacker.skills.melee + attackRoll;
        var defendMod = defender.reflex + defender.intellegence + defendRoll;

        if (attackMod > defendMod) {
          var bonusDamage = attackMod - defendMod,
              damage = attacker.strength + bonusDamage - defender.strength;
          if (damage > 0)
            return defender.hp.current -= damage;

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
