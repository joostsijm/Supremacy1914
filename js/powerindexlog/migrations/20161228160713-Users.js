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
	db.createTable('Users', {
		UserId: { type: 'int', primaryKey: true },
		Name: 'string',
		Rank: 'int'
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable.bind('Users', callback)
};

exports._meta = {
	"version": 1
};
