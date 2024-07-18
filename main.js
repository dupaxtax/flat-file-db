const models = require('./models.js');

const usableModels = models.getModels();

console.log(usableModels.test.select('id', 1));
