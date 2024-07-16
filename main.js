const fs = require('node:fs');

function read(tableName) {
	return JSON.parse(fs.readFileSync(tableName, 'utf8'));
};

// TODO: Modify this so that when a program imports this package it must specify a directory where these "tables" live


// TODO: Figure out how to support where clauses that are a little more complex, and add support to the select,
// update and insert
// this can probably be accomplished by making val an object, and check each of the values inside the for loop
exports.select = function(tableName, col, val) {
	const obj = read(tableName);

	for (const row of obj.rows) {
		if (row[col] === val) {
			return row;
		}
	}
}

exports.update = function(tableName, obj) {
	let success = false;
	const table = read(tableName);

	if (table.rows !== undefined) {
		throw new Error('No data in table to update');
	}

	for (let i = 0; i < table.length; ++i) {
		if (table[i]['id'] === obj.id) {
			table[i] = obj;

			fs.writeFileSync(tableName, JSON.stringify(table, null, 2));

			success = true;
			break;
		}
	}
}

exports.insert = function(tableName, obj) {
	if (obj['id'] !== undefined) {
		throw new Error('ids are auto-incrememnt');
	}

	const table = read(tableName);

	for (const col of table.columns) {
		if (obj[col] === undefined) {
			throw new Error('A value must be specified for each column');
		}
	}

	// TODO: This needs to be fixed, because with deletes the length will produce duplicate ids
	table.rows.push({ id: table.next_id, ...obj });

	fs.writeFileSync(tableName, JSON.stringify(table, null, 2));
}

exports.insert('./test.json', { name: '13th Name', another: 'blah' });
