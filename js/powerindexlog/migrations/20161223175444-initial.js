'use strict';

var dbm;
var type;
var seed;
var async = require('async');

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};


exports.up = function(db, callback) {
	async.series([
		db.createTable('Users', {
			UserId: { type: 'int', primaryKey: true },
			Name: 'string',
			Rank: 'int'
		}),
		db.createTable('Games', {
			GameId: { type: 'string', primaryKey: true },
			StartDate: 'date',
			MapId: 'int'
		}),
		db.createTable('Players', {
			UserId: { type: 'int', primaryKey: true },
			GameId: 'int',
			Points: 'int',
			Coalition: 'int'
		}),
		db.createTable('Coalitions', {
			CoalitionId: { type: 'int', primaryKey: true },
			Name: 'string'
		})
		db.createTable('Maps', {
			MapId: { type: 'int', primaryKey: true },
			Mapname: 'string',
			MapImg: 'string',
			MapSlots: 'string'
		})
	], callback);
};

exports.down = function(db, callback) {
	async.series([
		db.dropTable.bind(db, 'Users'),
		db.dropTable.bind(db, 'Games'),
		db.dropTable.bind(db, 'Players'),
		db.dropTable.bind(db, 'Coalitions'),
		db.dropTable.bind(db, 'Maps')
	], callback);
};

exports._meta = {
	"version": 1
};
