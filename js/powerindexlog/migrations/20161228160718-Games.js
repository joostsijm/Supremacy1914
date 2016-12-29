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
	db.createTable('Games', {
		GameId: { type: 'int', primaryKey: true },
		StartDate: 'date',
		IsRunning: 'boolean',
		MapId: {
			type: 'int',
			foreignKey: {
				name: 'Games_MapId_Maps_MapId',
				table: 'Maps',
				mapping: 'MapId',
				rules: {
					onDelete: 'RESTRICT',
					onUpdate: 'CASCADE'
				}
			}
		}
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable.bind('Games', callback)
};

exports._meta = {
	"version": 1
};
