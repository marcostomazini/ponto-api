'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport'),
	veiculos = require('../../app/controllers/veiculos.server.controller');

module.exports = function(app) {
	app.route('/api/veiculos')
		.get(users.requiresLogin, veiculos.list)
		.post(users.requiresLogin, veiculos.create);

	app.route('/api/mobile/veiculo')
		.get(passport.authenticate('bearer', {
        	session: false
    	}), veiculos.list)
		.post(passport.authenticate('bearer', {
        	session: false
    	}), veiculos.create);

	app.route('/api/pesquisa/veiculos')
		.get(users.requiresLogin, veiculos.count)
		.post(users.requiresLogin, veiculos.list);

	app.route('/api/veiculos/:leilaoId')
		.get(users.requiresLogin, veiculos.list);

	app.route('/api/veiculo/:veiculoId')
		.get(users.requiresLogin, veiculos.read)
		.put(users.requiresLogin, veiculos.hasAuthorization, veiculos.update)
		.delete(users.requiresLogin, veiculos.hasAuthorization, veiculos.delete);

	// Finish by binding the article middleware
	app.param('veiculoId', veiculos.veiculoByID);
	app.param('leilaoId', veiculos.leilaoByID);
};