'use strict';

/**
 * Get unique error field name
 */
var getUniqueErrorMessage = function(err) {
	var output;

	try {
		console.log(err.err);
		var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
		output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' já existe';

	} catch (ex) {
		output = 'Unique field already exists';
	}

	return output;
};

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = getUniqueErrorMessage(err);
				break;
			default:
				message = 'Something went wrong';
		}
	} else if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	} else {
		message = err.message;
	}

	return message;
};

/**
 * Get the error message from error object
 */
exports.executeValidation = function(ponto, relatorio) {
	var message = '';

	if (ponto == null) {
		message = 'nao foi encontrado parametros'
	} else if (ponto.tipo == '') {
		if (relatorio)
			message = 'faltou o tipo (simples / conferencia)'
		else 
			message = 'faltou o tipo (entrada / saida)'
	} else if (ponto.usuario == '') {
		message = 'faltou o usuario';
	} else if (ponto.senha == '') {
		message = 'faltou a senha';
	} else if ((ponto.tipo.indexOf('entrada') == -1 && ponto.tipo.indexOf('saida') == -1) && 
			  (ponto.tipo.indexOf('simples') == -1 && ponto.tipo.indexOf('conferencia') == -1)) {
		if (relatorio)
			message = 'tipo incorreto esperado (simples / conferencia) -> ' + ponto.tipo;
		else
			message = 'tipo incorreto esperado (entrada / saida)';
	}

	return message;
};