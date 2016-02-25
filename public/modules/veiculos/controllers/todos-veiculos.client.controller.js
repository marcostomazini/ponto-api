'use strict';

angular.module('veiculos')	
    .controller('VeiculosController', [
	'$scope', 
	'$compile',
	'$interval',
	'$stateParams', 
	'$location', 
	'Authentication', 
	'Veiculos', 
	'DTOptionsBuilder', 
	'DTColumnBuilder', 
	'SweetAlert',
	'$modal',
	function($scope, 
		$compile,
		$interval,
		$stateParams, 
		$location, 
		Authentication, 
		Veiculos, 
		DTOptionsBuilder, 
		DTColumnBuilder,
		SweetAlert,
		$modal) {		

		$scope.authentication = Authentication;
		$scope.pesquisa = {};

		var createdRow = function(row, data, dataIndex) {
        	// Recompiling so we can bind Angular directive to the DT
        	$compile(angular.element(row).contents())($scope);
    	}

		var statusHtml = function(data, type, full, meta) {
			switch(data.status) {
			    case 'VENDIDO':
			        return '<div class="label label-success">VENDIDO</div>';
			    case 'CONDICIONAL':
			        return '<div class="label label-info">CONDICIONAL</div>';
			    case 'BAIXA OFERTA':
			        return '<div class="label label-warning">BAIXA OFERTA</div>';
			    case 'SEM LICITANTES':
			        return '<div class="label label-warning">SEM LICITANTES</div>';
			    case 'RETIRADO':
			        return '<div class="label label-danger">RETIRADO</div>';
			    case 'ABERTO':
			        return '<div class="label label-danger">ABERTO</div>';
			    default:
			        return '<div class="label label-danger">NONE</div>';
			}			
		}

		var visualizarHtml = function(data, type, full, meta) {			
			var item = full;
			return "<div class=\"row\">"+
					"	<div class=\"text-center\">"+
					"		<div class=\"text-center\""+
					"			popover=\"Visualizar\""+
					"			popover-trigger=\"mouseenter\">"+
					"			<a ng-click=\"visualizar('"+item._id+"')\">"+
					"				<i class=\"fa icon-eyeglasses fa-2x\"></i>"+
					"			</a>"+
					"		</div>"+
					"	</div>"+
					"</div>";
		}

		var imagemHtml = function (data, type, full, meta) {
			return '<div class="media">'+
					'	<img src="'+full.imagens[0]+'" alt="Image" class="img-responsive img-circle">'+
					'</div>';
		}

		this.dtOptions = DTOptionsBuilder
			.newOptions()			
	    	.withOption('ajax', {
	    		dataSrc: 'data',
	        	url: '/api/pesquisa/veiculos',
	        	type: 'POST'
	    	})
	    	.withOption('createdRow', createdRow)
	    	.withOption('bFilter', false)
	    	.withOption('processing', true)
	    	.withOption('serverSide', true)
	    	.withOption('fnServerParams', function (aoData) {
                aoData.searchCustom = [{
                    "name": "nome",
                    "value": $scope.pesquisa.nome || ''
                },{
                    "name": "ano",
                    "value": $scope.pesquisa.ano || ''
                },{
                    "name": "cor",
                    "value": $scope.pesquisa.cor || ''
                },{
                    "name": "placa",
                    "value": $scope.pesquisa.placa || ''
                },{
                    "name": "status",
                    "value": $scope.pesquisa.status || ''
                }];
            })
		    .withPaginationType('full_numbers')		    
		    .withLanguageSource('/server/pt-br.json');

	    this.dtColumns = [
	    	DTColumnBuilder.newColumn('nome').withTitle('#').notVisible(),
	    	DTColumnBuilder.newColumn('nome').withTitle('Acões')
	    		.notSortable()
        		.renderWith(visualizarHtml),
       //  	DTColumnBuilder.newColumn('nome').withTitle('Foto')
	    		// .notSortable()
       //  		.renderWith(imagemHtml),
        	DTColumnBuilder.newColumn('nome').withTitle('Nome'),
        	DTColumnBuilder.newColumn('ano').withTitle('Ano'),
        	DTColumnBuilder.newColumn('cor').withTitle('Cor'),
        	DTColumnBuilder.newColumn('placa').withTitle('Placa'),
        	DTColumnBuilder.newColumn('valorVenda').withTitle('Valor Vendido'),
        	DTColumnBuilder.newColumn('status').withTitle('Status'),
        	DTColumnBuilder.newColumn(null).withTitle('Status')
        		.renderWith(statusHtml)
    	];

		$scope.urlBase = '/#!/veiculos';

		// Context
		$scope.authentication = Authentication;		

		ModalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'Veiculos', 'veiculoId'];
          function ModalInstanceCtrl($scope, $modalInstance, Veiculos, veiculoId) {

          	// Find existing item
			$scope.veiculo = Veiculos.veiculo.get({ 
				veiculoId: veiculoId
			});

            $scope.cancel = function () {
				$modalInstance.dismiss('cancel');
            };			
      	}
		
		$scope.pesquisar = function() {
			$('#veiculos-grid').DataTable().ajax.reload();
		};

		$scope.visualizar = function(id) {
			var modalInstance = $modal.open({
            	templateUrl: 'modalVisualizar.html',
            	controller: ModalInstanceCtrl,
            	resolve: {
         			veiculoId: function () {
           				return id;
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