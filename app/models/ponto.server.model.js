'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * VeiculoSchema
 */
var PontoSchema = new Schema({
	usuario: {
		type: String,
		trim: true,
		default: ''
	},
	senha: {
		type: String,
		trim: true,
		default: ''
	},
	token: {
		type: String,
		trim: true,
		default: ''
	},
	tipo: {
		type: String,
		trim: true,
		default: '',
		enum: ['entrada', 'saida', 'simples', 'conferencia']
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Ponto', PontoSchema);