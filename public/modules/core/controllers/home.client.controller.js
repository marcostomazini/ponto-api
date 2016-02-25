'use strict';

angular.module('app.core').controller('HomeController', ['$scope', 'Authentication', 'Veiculos',
	function($scope, Authentication, Veiculos) {
		
		Veiculos.quantidade.get().$promise.then(function(data) {
				$scope.veiculos  =data;
		});

		var aasd = Veiculos.quantidade.get();
		//$scope.veiculos = Veiculos.quantidade.get();
	}
]);