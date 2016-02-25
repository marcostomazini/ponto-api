'use strict';

// Configuring the Articles module
angular.module('usuarios-mobile').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Leilões', 'usuarios-mobile', 'dropdown', '/usuarios-mobile(/.*)?', false, null, 20, 'icon-users');
		Menus.addSubMenuItem('sidebar', 'usuarios-mobile', 'Listar leilões', 'usuarios-mobile');
	}
]);