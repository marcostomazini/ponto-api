'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	passport = require('passport'),
	relatorios = require('../../app/controllers/relatorios.server.controller'),
	pontos = require('../../app/controllers/pontos.server.controller');

module.exports = function(app) {

	app.route('/api/ponto')		
		.post(passport.authenticate('bearer', {
        	session: false
	}), pontos.login);	

	app.route('/api/relatorio')
		.post(passport.authenticate('bearer', {
        	session: false
	}), relatorios.gerar); 	
};