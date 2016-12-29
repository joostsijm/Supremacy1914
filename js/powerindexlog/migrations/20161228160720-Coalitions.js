'use strict';

var dbm;
var type;
var seed;

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
	db.createTable('Coalitions', {
		CoalitionId: { type: 'int', primaryKey: true },
		GameId: {
			type: 'int',
			foreignKey: {
				name: 'Coalitons_GameId_Games_GameId_fk',
				table: 'Games',
				mapping: 'GameId',
				rules: {
					onDelete: 'RESTRICT',
					onUpdate: 'CASCADE'
				}
			}
		},
		Name: 'string'
	}, callback)
};

exports.down = function(db, callback) {
	db.dropTable.bind('Coalitions', callback)
};

exports._meta = {
	"version": 1
};
