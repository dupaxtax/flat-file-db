const fs = require('node:fs');
const path = require('path');

const methods = require('./methods.js');

class Model {
	constructor(path, columns) {
		this.path = path;
		this.columns = columns;
		this.select = methods.select;
		this.insert = methods.insert;
		this.update = methods.update;
	}
}

const pathToDir = path.join(process.cwd(), 'models/');
// Inside the models directory there needs to be a models.js file, that exports an array of strings of the file names
const models = require(pathToDir + 'models.js').models;

const modelObjects = {};

models.forEach(m => {
	const path = `${pathToDir}${m}`;
	const model = JSON.parse(fs.readFileSync(path, 'utf8'));
	const name = m.substring(0, m.indexOf('.'));

	modelObjects[name] = new Model(path, model.columns);
});

exports.getModels = function() {
	return modelObjects;
};
