'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	funcoesPonto = require('./funcoes.server.controller'),
	Ponto = mongoose.model('Ponto'),
	ObjectId = mongoose.Types.ObjectId,
	_ = require('lodash');

/**
 * Entrada
 */
exports.login = function(req, res) {
	var self = this;
	var ponto = new Ponto(req.body);

	var login = undefined;

	var message = errorHandler.executeValidation(ponto);
	if (message) {
		return res.status(400).send({
			message: message
		});
	}

	switch(ponto.tipo) {
	    case 'entrada':
	        login = funcoesPonto.efetuarEntrada(ponto);
	        break;
	    case 'saida':
	        login = funcoesPonto.efetuarSaida(ponto);
	        break;	    
	}

	login.then(function(response) {	        
		if (response.success) {
			res.json(response);
		} else {
			return res.status(400).send({
				message: 'fuckkkk!!'
			});
		}	
	});	
};

exports.hasAuthorization = function(req, res, next) {
	// if (req.article.user.id !== req.user.id) {
	// 	return res.status(403).send({
	// 		message: 'User is not authorized'
	// 	});
	// }
	next();
};