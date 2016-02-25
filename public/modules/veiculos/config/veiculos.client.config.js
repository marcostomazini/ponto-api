'use strict';

// Configuring the Articles module
angular.module('veiculos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Veiculos', 'pesquisa-veiculos', 'dropdown', '/pesquisa-veiculos(/.*)?', false, null, 20, 'icon-basket-loaded');
	}
]);