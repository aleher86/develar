/*
 *  core dbconnect.js
 *  package: /core/config
 *  Use:
 *     Exporta una instancia de la conexion a la base de datos
 */

/**
 * Database connection

Debatillo:
	Hay otra forma de conectar, pero requiere cambiar la forma de acceder a Model.
		const conn = mongoose.createConnection(...)
		const Model = conn.model(...)

	vkarpov15: usuario de github que representa a mongoose

	// el uso tradicional:
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const userSchema = new Schema({ ... });
	const User = mongoose.model('User', userSchema);


 */
/**
 * Load module dependencies
 vitorbarros
 */
var mongoose = require('mongoose');
var BBPromise = require('bluebird');
var debug = require('debug')('develar:server');

var db;
// Connect to MongoDB database

module.exports = function(settings){

  mongoose.Promise = BBPromise;

  mongoose.connect(settings.dbase, {

  });

  mongoose
  
  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.on('open', function(){
  	console.log('mongodb connected ok: [%s]',settings.dbase);
    debug('MongoDB: connected OKKKK');
  });

  return mongoose;
};
