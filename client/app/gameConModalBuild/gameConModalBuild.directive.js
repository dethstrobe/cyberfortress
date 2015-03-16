'use strict';

angular.module('cyberfortressApp')
  .directive('gameConModalBuild', function ($modal, $log) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

      	scope.items = ['Turret', 'Pressure Plate', 'item3'];

      	scope.open = function (size) {

			var modalInstance = $modal.open({
			  templateUrl: 'app/gameConModalBuild/gameConModalBuild.html',
			  controller: 'ModalInstanceCtrl',
			  size: size,
			  resolve: {
			    items: function () {
			      return scope.items;
			    }
			  }
			});

			modalInstance.result.then(function (selectedItem) {
			  scope.controls.build.selected = selectedItem;
			  
			  //allows building of new stuff
			  scope.display.view.select = null;
			  scope.renderMap(scope.currentMap, scope.display);


			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};
      }
    };
  });