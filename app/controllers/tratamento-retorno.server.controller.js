'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	cheerio = require("cheerio"),
	tabletojson = require('tabletojson');

var pontoHtml = function($) {

};

var simplesHtml = function($) {
	if ($('.tabExterna').length == 0) {
		return {
			success: false,
			resultado: 'elementos necessários não encontrados'
		};
	}

	var tables = $('.tabExterna');

	var diasPonto = _.flatten(tabletojson.convert(tables[0]));

	_.forEach(diasPonto, function(value) {
		var data = value['Data'];
		value.Data = (data.split('-')[0]).trim();

		value.DataSemana = (data.split('-')[1]).trim();

		value.Entrada1 = value['Entrada 1'];
		value.Saida1 = value['Saída 1'];

		value.Entrada2 = value['Entrada 2'];
		value.Saida2 = value['Saída 2'];

		value.Entrada3 = value['Entrada 3'];
		value.Saida3 = value['Saída 3'];

		value.TotalHoras = value['Total Horas'];

		delete value['Entrada 1'];
		delete value['Saída 1'];

		delete value['Entrada 2'];
		delete value['Saída 2'];

		delete value['Entrada 3'];
		delete value['Saída 3'];

		delete value['Total Horas'];
	});

	return {
		success: true,
		resultado: diasPonto
	};
};

var conferenciaHtml = function($) {

	if (($('#impRelIndividual td:contains("Período")').length == 0) || 
		($('.tabExterna').length == 0)){
		return {
			success: false,
			resultado: 'elementos necessários não encontrados'
		};
	}

	var descricaoPeriodo = [];	
	var descricaoPeriodos = $('#impRelIndividual td:contains("Período")').each(function(a, b){
    	descricaoPeriodo[a] = b.children[0].data;
	});

	var tables = $('.tabExterna');

	var objetoTratado = [];
	tables.each(function(index) {
		objetoTratado.push({ 
			Periodo: descricaoPeriodo[index],
			Dias: _.flatten(tabletojson.convert(tables[index]))
		});
	});

	_.forEach(objetoTratado, function(objeto) {
		_.remove(objeto.Dias, function(currentObject) {		
			return currentObject.Data === 'TOTAL';
		});

		_.forEach(objeto.Dias, function(value) {
			value.HorasPonto = value['Horas Ponto'];
			value.HorasTask = value['Horas Task'];
			value.PontoTask = value['Ponto - Task'];

			delete value['Horas Ponto'];
			delete value['Horas Task'];
			delete value['Ponto - Task'];
		});
	});

	return {
		success: true,
		resultado: objetoTratado
	};
};

exports.execute = function(body, tipo) {
	var $ = cheerio.load(body);
	var mensagens = '';
	var erro = ($('.erro').length > 0);	

	if (erro) {
		mensagens = $('.erro').text();
		return {
			success: false,
			resultado: mensagens,
			body: body
		};
	}

	if (tipo == 'ponto') {
		var retorno = pontoHtml($);
		return retorno;

	} else if (tipo == 'simples') {
		var retorno = simplesHtml($);
		return retorno;

	} else if (tipo == 'conferencia') {		
		var retorno = conferenciaHtml($);
		return retorno;
	}

	return {
		success: false,
		resultado: 'não foi setado o tipo para tratamento do html'
	};
};