const serverless = require('serverless-http');
const app = require('../../back_end/src/app'); // chemin vers ton fichier app.js

module.exports.handler = serverless(app);