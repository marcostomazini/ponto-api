'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * UsuarioMobileSchema
 */
var LeilaoSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: ''
	},
	code: {
		type: String,
		trim: true,
		default: ''
	},
	url: {
		type: String,
		trim: true,
		default: ''
	},
	date: {
		type: Date
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Leilao', LeilaoSchema);