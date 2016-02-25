'use strict';

angular.module('veiculos').controller('VeiculoController', [
	'$scope', 
	'$interval',
	'$stateParams', 
	'$location', 
	'Authentication', 
	'Veiculos', 
	'DTOptionsBuilder', 
	'DTColumnDefBuilder', 
	'SweetAlert',
	'$modal',
	function($scope, 
		$interval,
		$stateParams, 
		$location, 
		Authentication, 
		Veiculos, 
		DTOptionsBuilder, 
		DTColumnDefBuilder,
		SweetAlert,
		$modal) {		

		$scope.authentication = Authentication;

		this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withLanguageSource('/server/pt-br.json')
	    .withBootstrap();
	
		this.dtColumnDefs = [
			DTColumnDefBuilder
				.newColumnDef(0)
				.withOption('bSearchable', false)
				.notVisible()
				.notSortable(),
	        DTColumnDefBuilder
	        	.newColumnDef(1)
	        	.notSortable()
		];	

		$scope.urlBase = '/#!/veiculos';

		// Context
		$scope.authentication = Authentication;
		
		$scope.veiculos = Veiculos.veiculos.query({
			leilaoId: $stateParams.leilaoId 
		});

		ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'Veiculos', 'veiculo'];
          function ModalInstanceCtrl($scope, $modalInstance, Veiculos, veiculo) {

          	// Find existing item
			$scope.veiculo = Veiculos.veiculo.get({ 
				veiculoId: veiculo._id
			});

            $scope.cancel = function () {
				$modalInstance.dismiss('cancel');
            };			
      	}
		
		$scope.visualizar = function(item) {
			var modalInstance = $modal.open({
            	templateUrl: 'modalVisualizar.html',
            	controller: ModalInstanceCtrl,
            	resolve: {
         			veiculo: function () {
           				return item;
         			}
       			},
            	size: 'lg'
            });

            var state = $('#modal-state');
            modalInstance.result.then(function () {
            	state.text('Modal dismissed with OK status');
            }, function () {
            	state.text('Modal dismissed with Cancel status');
            });
		};
	}
]);