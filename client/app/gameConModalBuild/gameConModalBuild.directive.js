'use strict';

angular.module('cyberfortressApp')
  .directive('gameConModalBuild', function ($modal, $log) {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {

      	scope.items = ['item1', 'item2', 'item3'];

      	scope.open = function (size) {
      		console.log("modal button clicked");

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
			  scope.selected = selectedItem;
			}, function () {
			  $log.info('Modal dismissed at: ' + new Date());
			});
		};
      }
    };
  });