'use strict';

angular.module('cyberfortressApp')
  .directive('gameConModalBuild', function ($modal, $log) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

      	scope.items = ['Turret', 'Pressure Plate', 'Empty'];

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
			  scope.controls.build = selectedItem;

			  //hide menu if build has been okayed
			  scope.controls.menu = true;
			  
			  //allows building of new stuff
			  scope.display.view.select = null;
			  scope.display.mapRender(scope.currentMap, scope.display);


			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};
      }
    };
  });