const fs = require('node:fs');

function read(path) {
	return JSON.parse(fs.readFileSync(path, 'utf8'));
};

exports.select = function(col, val) {
	const obj = read(this.path);

	for (const row of obj.rows) {
		if (row[col] === val) {
			return row;
		}
	}
}

exports.update = function(obj) {
	let success = false;
	const table = read(this.path);

	if (table.rows !== undefined) {
		throw new Error('No data in table to update');
	}

	for (let i = 0; i < table.length; ++i) {
		if (table[i]['id'] === obj.id) {
			table[i] = obj;

			fs.writeFileSync(this.path, JSON.stringify(table, null, 2));

			success = true;
			break;
		}
	}
}

exports.insert = function(obj) {
	if (obj['id'] !== undefined) {
		throw new Error('ids are auto-incrememnt');
	}

	const table = read(this.path);

	for (const col of table.columns) {
		if (obj[col] === undefined) {
			throw new Error('A value must be specified for each column');
		}
	}

	table.rows.push({ id: table.next_id, ...obj });

	fs.writeFileSync(this.path, JSON.stringify(table, null, 2));
}

exports.delete = function(obj) {
	const table = read(this.path);

	for (let i = 0; i < table.length; ++i) {
		if (table[i]['id'] === obj.id) {
			table.splice(i, 1);

			fs.writeFileSync(this.path, JSON.stringify(table, null, 2));
			break;
		}
	}
}
