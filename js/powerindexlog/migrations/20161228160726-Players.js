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
	db.createTable('Players', {
		UserId: { 
			type: 'int', 
			primaryKey: true,
			foreignKey: {
				name: 'Players_UserId_Users_UserId_fk',
				table: 'Users',
				mapping: 'UserId',
				rules: {
					onDelete: 'RESTRICT',
					onUpdate: 'CASCADE'
				}
			}
		},
		GameId: {
			type: 'int',
			primaryKey: true,
			foreignKey: {
				name: 'Players_GameId_Games_GameId_fk',
				table: 'Games',
				mapping: 'GameId',
				rules: {
					onDelete: 'RESTRICT',
					onUpdate: 'CASCADE'
				}
			}
		},
		Points: 'int',
		CoalitionId: {
			type: 'int',
			foreignKey: {
				name: 'Players_Coalition_Coalitions_CoalitionId_fk',
				table: 'Coalitions',
				mapping: 'CoalitionId',
				rules: {
					onDelete: 'RESTRICT',
					onUpdate: 'CASCADE'
				}
			}
		},
		IsActive: 'boolean'
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable.bind('Players', callback)
};

exports._meta = {
	"version": 1
};
