const serverless = require('serverless-http');
const app = require('../../src/app'); // chemin relatif vers ton app.js

module.exports.handler = serverless(app);