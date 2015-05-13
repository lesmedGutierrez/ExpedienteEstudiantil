'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Estudiante = mongoose.model('Estudiante'),
	_ = require('lodash');

/**
 * Create a Estudiante
 */
exports.create = function(req, res) {
	var estudiante = new Estudiante(req.body);
	estudiante.user = req.user;

	estudiante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estudiante);
		}
	});
};

/**
 * Show the current Estudiante
 */
exports.read = function(req, res) {
	res.jsonp(req.estudiante);
};

/**
 * Update a Estudiante
 */
exports.update = function(req, res) {
	var estudiante = req.estudiante ;

	estudiante = _.extend(estudiante , req.body);

	estudiante.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estudiante);
		}
	});
};

/**
 * Delete an Estudiante
 */
exports.delete = function(req, res) {
	var estudiante = req.estudiante ;

	estudiante.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estudiante);
		}
	});
};

/**
 * List of Estudiantes
 */
exports.list = function(req, res) { 
	Estudiante.find().sort('-created').populate('user', 'displayName').exec(function(err, estudiantes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(estudiantes);
		}
	});
};

/**
 * Estudiante middleware
 */
exports.estudianteByID = function(req, res, next, id) { 
	Estudiante.findById(id).populate('user', 'displayName').exec(function(err, estudiante) {
		if (err) return next(err);
		if (! estudiante) return next(new Error('Failed to load Estudiante ' + id));
		req.estudiante = estudiante ;
		next();
	});
};

/**
 * Estudiante middleware
 */
exports.admitidoss = function(req, res, next, admitido) {
    Estudiante.find({admitido: admitido}).populate('user', 'displayName').exec(function(err, estudiante) {
        if (err) return next(err);
        if (! estudiante) return next(new Error('Failed to load Estudiante '));
        req.estudiante = estudiante ;
        next();
    });
};

/**
 * Estudiante middleware
 */
exports.get_estudiantes_generacion = function(req, res, next, generacion) {
    Estudiante.find({anno_ingreso: generacion}).populate('user', 'displayName').exec(function(err, estudiante) {
        if (err) return next(err);
        if (! estudiante) return next(new Error('Failed to load Estudiante '));
        req.estudiante = estudiante ;
        next();
    });
};

/**
 * Estudiante authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.estudiante.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
