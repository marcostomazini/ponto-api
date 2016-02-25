'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('veiculos').factory('Veiculos', ['$resource',
	function($resource) {

		var Quantidade = $resource('api/pesquisa/veiculos');

		var Veiculos = $resource('api/veiculos/:leilaoId', 
			{ leilaoId: '@_id' });

		var Veiculo = $resource('api/veiculo/:veiculoId', 
			{ veiculoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return {
    		veiculos: Veiculos,
    		veiculo: Veiculo,
    		quantidade: Quantidade
    	};
	}
]);