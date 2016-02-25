'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Leilao = mongoose.model('Leilao'),
	Veiculo = mongoose.model('Veiculo'),
	_ = require('lodash'),
	http = require("http"),
	cheerio = require("cheerio");

/**
 * Create a usuarioMobile
 */

function start(usuarioMobile, leilao, req) {
	download(usuarioMobile.url, function(data) {
		if (data) {
			var $ = cheerio.load(data);	    	

	    	var totalItens = 0;
	    	var totalUltimaPagina = 0;
	    	var totalItensPorPagina = 15;
	    	var totalPaginas = $('#listaLotesPaginacao li').length;

			itensUltimaPagina(usuarioMobile.url + '&pagina=' + totalPaginas,
				function(total) {
					totalUltimaPagina = total;

					var paginas = [];
				 	for (var pagina = totalPaginas; pagina >= 1; pagina--) {

				 		if (pagina == totalPaginas)
				 			totalItens = totalUltimaPagina
				 		else 
				 			totalItens = 15;

						for (var i = totalItens; i >= 1; i--) {
							var lote = (pagina * totalItensPorPagina) - (totalItensPorPagina - i);
							paginas.push({
									lote: lote,
									url: 'http://www.freitasleiloesonline.com.br/homesite/lotesdetalhes.asp?codleilao='+
										usuarioMobile.code+
										'&lote=' + 
										lote
								});
						};
				 	};

				 	var paginasOrdenadoPorLote = _.sortBy(paginas, 'lote');

				 	detalhe(paginasOrdenadoPorLote, usuarioMobile.code, leilao, req);

			});						
		}				
	});
};

function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
};

function itensUltimaPagina(url, callback) {
	download(url, function(data) {
		if (data) {
			var $ = cheerio.load(data);
	    	var totalPorPagina = $('#listaLotes li').length;	    	
	    	callback(totalPorPagina);
		}
	});
};

function valorLoteStatus(url, callback) {
	download(url, function(data) {
		if (data) {
			var paginas = [];
			var $ = cheerio.load(data);

	    	var valorLote = $('.valorLote').text().trim();
			var statusLote = $('.statusLote').text().trim();

			callback({				
					valorVenda: valorLote,
					status: statusLote
				});
		}
	});
};

function detalhe(listaPaginas, codigo, idLeilao, req) {	
	_.forEach(listaPaginas, function(item) {
  		download(item.url, function(data) {
			if (data) {
				var $ = cheerio.load(data);

				var imagemVeiculos = [];
				var imagens = $('#img li a');
				_.forEach(imagens, function(imagem) {
					imagemVeiculos.push($(imagem).attr('href'));
				});

				var valorInicial = $($('.divisaoDashedWhite span')[0]).text().trim();    	
				
				var dadosVeiculos = $($('.divisaoDashedWhite')[0]).next().next().next().text().trim().split(',');
				var nomeVeiculo = dadosVeiculos[0];
				var anoVeiculo = dadosVeiculos[1];
				var placaVeiculo = dadosVeiculos[2];
				var combustivelVeiculo = dadosVeiculos[3];
				var corVeiculo = dadosVeiculos[4];

				var descricaoGeral = $('#dadosLote').text().trim();

				var valorLote = $('.valorLote').text().trim();
				var statusLote = $('.statusLote').text().trim();				

				valorLoteStatus('http://www.freitasleiloesonline.com.br/homesite/ajax/ajx_maiorLance.asp?CODLEILAO='+codigo+'&LOTE='+ item.lote,
					function(dataValor) {

					var veiculoDados = {
						nome: nomeVeiculo,
						ano: anoVeiculo,
						placa: placaVeiculo,
						combustivel: combustivelVeiculo,
						cor: corVeiculo,
						valorInicial: valorInicial,
						valorVenda: 0,
						status: '',
						descricao: descricaoGeral,
						lote: item.lote,
						url: item.url,
						imagens: imagemVeiculos,
						leilao: idLeilao
					};

					var veiculo = _.extend(veiculoDados, dataValor);

					var veiculoVM = new Veiculo(veiculo);

					var socketio = req.app.get('socketio');
					veiculoVM.save(function(err) {
						if (err) {								
							socketio.emit('message-toaster', {				
								type: 'error',
								title: 'Erro no Cadastro',
								message: errorHandler.getErrorMessage(err)
							});							
						} else {								
					    	var socketio = req.app.get('socketio');
							socketio.emit('message-toaster', {				
								type: 'info',
								title: 'Novo Cadastro',
								message: 'Veiculo Cadastrado ' + veiculo.nome
							});							
						}
					});

				});				
			}
		});
	});	
};

exports.create = function(req, res) {
	var self = this;
	var usuarioMobile = new Leilao(req.body);

	usuarioMobile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.emit('message-toaster', {				
				type: 'info',
				title: 'Novo Cadastro',
				message: 'Leilão Cadastrado ' + usuarioMobile.url
			});

			start(usuarioMobile, usuarioMobile.id, req);

			res.json(usuarioMobile);
		}
	});
};

/**
 * Show the current usuarioMobile
 */
exports.read = function(req, res) {
	res.json(req.usuarioMobile);
};

/**
 * Update a usuarioMobile
 */
exports.update = function(req, res) {
	var usuarioMobile = req.usuarioMobile;

	usuarioMobile = _.extend(usuarioMobile, req.body);

	usuarioMobile.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usuarioMobile);
		}
	});
};

/**
 * Delete an usuarioMobile
 */
exports.delete = function(req, res) {
	var usuarioMobile = req.usuarioMobile;

	usuarioMobile.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usuarioMobile);
		}
	});
};

/**
 * List of usuarioMobiles
 */
exports.list = function(req, res) {			
	Leilao.find({}, '-salt -password').sort('-created').exec(function(err, usuariosMobile) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usuariosMobile);
		}
	});
};

/**
 * usuarioMobile middleware
 */
exports.usuarioMobileByID = function(req, res, next, id) {
	Leilao.findById(id).populate('user', 'displayName').exec(function(err, usuarioMobile) {
		if (err) return next(err);
		if (!usuarioMobile) return next(new Error('Failed to load usuarioMobile ' + id));
		req.usuarioMobile = usuarioMobile;
		next();
	});
};

/**
 * usuarioMobile authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.article.user.id !== req.user.id) {
	// 	return res.status(403).send({
	// 		message: 'User is not authorized'
	// 	});
	// }
	next();
};