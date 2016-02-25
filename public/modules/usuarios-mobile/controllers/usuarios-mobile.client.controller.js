'use strict';

angular.module('usuarios-mobile').controller('UsuarioMobileController', [
	'$scope', 
	'$interval',
	'$stateParams', 
	'$location', 
	'Authentication', 'UsuariosMobile', 
	'DTOptionsBuilder', 
	'DTColumnDefBuilder', 
	'SweetAlert',
	'$modal',
	function($scope, 
		$interval,
		$stateParams, 
		$location, 
		Authentication, 
		UsuariosMobile, 
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
	    .withOption('processing', true)
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

		$scope.urlBase = '/#!/usuarios-mobile';

		// Context
		$scope.authentication = Authentication;
		$scope.leiloes = UsuariosMobile.query();

		ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];
          function ModalInstanceCtrl($scope, $modalInstance) {

          	$scope.open = function($event) {
		    	$event.preventDefault();
		    	$event.stopPropagation();

		    	$scope.opened = true;
			};	
		
            $scope.ok = function (leilao) {
				var model = new UsuariosMobile(leilao);

				// Redirect after save
				model.$save(function(response) {
					console.log(response);
					$modalInstance.close('closed');
				}, function(errorResponse) {
					SweetAlert.swal('Erro!', errorResponse.data.message, errorResponse.data.type);
				});            	
            };

            $scope.cancel = function () {
				$modalInstance.dismiss('cancel');
            };
          }

		$scope.addItem = function(item) {
			// var novoUsuario = {
			// 	name: null,
			// 	email: null
			// };
			// $scope.usuariosMobile.unshift(novoUsuario);				
			var modalInstance = $modal.open({
            	templateUrl: 'modalInserir.html',
            	controller: ModalInstanceCtrl,
            	size: 'md'
            });

            var state = $('#modal-state');
            modalInstance.result.then(function () {
            	state.text('Modal dismissed with OK status');
            }, function () {
            	state.text('Modal dismissed with Cancel status');
            });
		};

		$scope.visualizar = function(item) {
			window.location = '/#!/veiculos/' + item._id;
		};		

		$scope.deleteConfirm = function(index) {			
			SweetAlert.swal({   
				title: 'Você tem certeza?',   
				text: 'Após deletado não vai ser mais possível acessar o registro!',   
				type: 'warning',   
				showCancelButton: true,   
				confirmButtonColor: '#DD6B55',   
				confirmButtonText: 'Sim',   
				cancelButtonText: 'Não',
				closeOnConfirm: false,   
				closeOnCancel: false 
			}, function(isConfirm){  
				if (isConfirm) {
					var usuarioMobile = $scope.leiloes[index];
					if (usuarioMobile) {							
						usuarioMobile.$remove( function (response) {
							if (response) {
								$scope.leiloes = _.without($scope.leiloes, usuarioMobile);

								SweetAlert.swal('Deletado!', 'O registro foi deletado.', 'success');
							}
						}, function(errorResponse) {
							$scope.error = errorResponse.data.message;
							SweetAlert.swal('Erro!', errorResponse.data.message, errorResponse.data.type);
						});
					}

				} else {     
					SweetAlert.swal('Cancelado', 'O registro não foi removido :)', 'error');   
				} 
            });
		};
	}
]);