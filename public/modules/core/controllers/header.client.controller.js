'use strict';

angular.module('app.core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'toaster', 'mySocket',
	function($scope, Authentication, Menus, toaster, mySocket) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');		

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		if (_.isObject($scope.authentication.user)) {
			mySocket.on('create-usuario', function(data) {
	        	toaster.pop(data.type, data.title, data.message);
	    	});
		}
	}
]);