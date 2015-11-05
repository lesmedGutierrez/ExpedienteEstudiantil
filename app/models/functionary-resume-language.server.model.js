'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Functionary resume language Schema
 */
var FunctionaryResumeLanguageSchema = new Schema({
	functionary:{
		type: Schema.ObjectId,
		ref:'Functionary'
	},

	language: {
		type: String,
		default: '',
		required: 'Porfavor llene el lenguaje',
		trim: true
	},

	proficiency: {
		type: String,
		default: '',
		trim: true
	},

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('FunctionaryResumeLanguage', FunctionaryResumeLanguageSchema);
