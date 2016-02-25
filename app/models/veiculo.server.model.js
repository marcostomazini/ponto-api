'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * VeiculoSchema
 */
var VeiculoSchema = new Schema({
	nome: {
		type: String,
		trim: true,
		default: ''
	},
	ano: {
		type: String,
		trim: true,
		default: ''
	},
	placa: {
		type: String,
		trim: true,
		default: ''
	},
	combustivel: {
		type: String,
		trim: true,
		default: ''
	},
	cor: {
		type: String,
		trim: true,
		default: ''
	},
	valorInicial: {
		type: String,
		trim: true,
		default: ''
	},
	valorVenda: {
		type: String,
		trim: true,
		default: ''
	},
	status: {
		type: String,
		trim: true,
		default: ''
	},
	descricao: {
		type: String,
		trim: true,
		default: ''
	},
	lote: {
		type: String,
		trim: true,
		default: ''
	},
	url: {
		type: String,
		trim: true,
		default: ''
	},
	imagens: {
		type: [{
			type: String
		}],
		default: ['']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	leilao: {
		type: Schema.ObjectId,
		required: 'Selecione o leilao',
		ref: 'Leilao'
	}
});

mongoose.model('Veiculo', VeiculoSchema);