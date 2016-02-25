'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Veiculo = mongoose.model('Veiculo'),
	ObjectId = mongoose.Types.ObjectId,
	_ = require('lodash');

/**
 * Create a veiculo
 */
exports.create = function(req, res) {
	var self = this;
	var veiculo = new Veiculo(req.body);

	veiculo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {		
	    	var socketio = req.app.get('socketio');
			socketio.emit('message-toaster', {				
				type: 'info',
				title: 'Novo Cadastro',
				message: 'Veiculo Cadastrado ' + veiculo.nome
			});

			res.json(veiculo);				
		}
	});
};

/**
 * Show the current veiculo
 */
exports.read = function(req, res) {
	res.json(req.veiculo);
};

/**
 * Update a veiculo
 */
exports.update = function(req, res) {
	var veiculo = req.veiculo;

	veiculo = _.extend(veiculo, req.body);

	veiculo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(veiculo);
		}
	});
};

/**
 * Delete an veiculo
 */
exports.delete = function(req, res) {
	var veiculo = req.veiculo;

	veiculo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(veiculo);
		}
	});
};

/**
 * List of veiculos
 */
exports.list = function(req, res) {	
	var datatablesQuery = require('datatables-query'),
        params = req.body,
        query = datatablesQuery(Veiculo);
 
    query.run(params).then(function (data) {
        res.json(data);
    }, function (err) {
        return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
    });
};

/**
 * List of veiculos
 */
exports.count = function(req, res) {	
	Veiculo.find().count().exec(function(err, qtde) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(qtde);
			res.json(qtde);
		}
	});
};

/**
 * veiculo middleware
 */
exports.veiculoByID = function(req, res, next, id) {
	Veiculo.findById(id).populate('user', 'displayName').exec(function(err, veiculo) {
		if (err) return next(err);
		if (!veiculo) return next(new Error('Failed to load veiculo ' + id));
		req.veiculo = veiculo;
		next();
	});
};

exports.leilaoByID = function(req, res, next, id) {
	Veiculo.find({leilao: id}, '-descricao -url -created -updated -valorInicial -leilao')
		.sort('lote -created').exec(function(err, veiculos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(veiculos);
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