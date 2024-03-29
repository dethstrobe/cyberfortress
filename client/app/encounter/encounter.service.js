'use strict';

angular.module('cyberfortressApp')
  .factory('encounter', function () {
    var currentEncounter = null;

    var encounterList = [
      {type: 'Fight', freq: 20},
      {type: 'Fight', freq: 50},
      {type: null, freq: 99}
    ];


    var CharacterCreation = function(name, str, ref, intel, per, skills, side, loc) {
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

      this.sides = side;

      this.location = {
        x: loc.x,
        y: loc.y
      };

      this.sprite = new Image();
      this.sprite.src = '/assets/images/'+name.replace(/\s+/g, '').toLowerCase()+'.png';
    };

    var characters = {
      operatives : [

        new CharacterCreation('Street Sam', 5, 6, 3, 1, {melee: 5, range: 4}, 'operatives', {x:3, y:1}),
        new CharacterCreation('Street Sam', 5, 5, 3, 2, {melee: 3, range: 6}, 'operatives', {x:5, y:0})

      ],
      opposition : [
        new CharacterCreation('Guard', 5, 4, 3, 3, {melee: 5, range: 4}, 'opposition', {x:2, y:1}),
        new CharacterCreation('Guard', 4, 4, 4, 3, {melee: 4, range: 5}, 'opposition', {x:0, y:2}),
        new CharacterCreation('Guard', 4, 5, 3, 3, {melee: 4, range: 5}, 'opposition', {x:1, y:0})
      ]
    };

    var setUpFight = function () {
      var opponents = characters.opposition;

      var randomTiles = function () {
        function randomTile() {
          return Math.floor(Math.random() * 3)
        };

        var location = {
          x: randomTile(),
          y: randomTile()
        };

        for (var i = 0, oppoentsLength = opponents.length; i < oppoentsLength; ++i) {

          if (_.isEqual(opponents[i].location, location)) {
            location = randomTiles();
            break;
          }
        }

        return location;
      };


      for (var i = opponents.length; i < 5; ++i) {
        var location = randomTiles();

        opponents[i] = new CharacterCreation('Guard', 4, 4, 4, 3, {melee: 4, range: 5}, 'opposition', location);
      }

      console.log(opponents);
    }

    var applyPhysicalDamage = function(attacker, defender, skill, attackBoni, defendBoni) {

      var attackRoll = Math.ceil(Math.random()*10);
      var defendRoll = Math.ceil(Math.random()*10);

      var attackMod = attacker.reflex + attacker.skills[skill] + attackBoni + attackRoll;
      var defendMod = defender.reflex + defender.intellegence + defendBoni + defendRoll;

      if (attackMod > defendMod) {
        var bonusDamage = attackMod - defendMod,
            damage = attacker.strength + bonusDamage - defender.strength;

        if (damage > 0)
          return damage;

      } else {
        console.log("Attack Missed");
      }

      return 0;
    }

    var actions = {
      Melee: function (attacker, defender) {
        //check to see if target is in range
        if (
          attacker.location.x !== defender.location.x + 1
          && attacker.location.x !== defender.location.x - 1
          || attacker.location.y !== defender.location.y
        ) {
          console.log('Defender too far');
          return null;
        }

        defender.hp.current -= applyPhysicalDamage(attacker, defender, 'melee', 0, 0);
        console.log(defender.hp.current);
        
        return true;
      },
      Range: function (attacker, defender) {
        var rangeModifers = {
          1: -3,
          3: -1,
          4: -2,
          5: -4,
          default: 0
        }

        var rangeFromTarget = Math.abs(attacker.location.x - defender.location.x);

        var rangeMod = rangeModifers[rangeFromTarget] || rangeModifers.default;

        console.log(rangeFromTarget);


        defender.hp.current -= applyPhysicalDamage(attacker, defender, 'range', rangeMod, 0);
        console.log(defender.hp.current);
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
            if (currentEncounter === 'Fight') {
              console.log('set up the fight!')
              setUpFight();
            }
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
        
        var action = actions[actionType] (attacker, defender);

        return action;
      },

      actionList : function () {
        return Object.keys(actions);
      },

      isDead : function (charObject, keyFaction, index) {
        var factionArray = charObject[keyFaction];

        if (factionArray[index].hp.current <= 0) {

          factionArray.splice(index, 1);
          angular.element('.'+keyFaction+' .unit.'+factionArray.length).remove();
          console.log(angular.element('.'+keyFaction+' .unit.'+index));
          return true;

        } else {

          return false;

        }
      },

      moveTo : function (moveToTile, character, map) {//if you can move there move character and return true, else return false
        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };

        var side = capitalizeFirstLetter(character.sides);
        var team = characters[character.sides];

        if (map[moveToTile.y][moveToTile.x].type === side) {
          for (var i = 0, len = team.length; i<len; ++i) {
            if (_.isEqual(team[i].location, moveToTile))
              return false;
          }

          character.location = moveToTile;
          return true;

        } else {

          return false;

        }
      }

    };
  });
